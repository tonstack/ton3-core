import { Bit } from '../types/bit'
import { Mask } from './mask'
import {
    bitsToBytes,
    bitsToHex,
    bytesToBits,
    hexToBits
} from '../utils/helpers'
import { bitsToIntUint } from '../utils/numbers'
import { augment } from '../utils/bits'
import { sha256 } from '../utils/hash'

enum CellType {
    Ordinary = -1,
    PrunedBranch = 1,
    LibraryReference = 2,
    MerkleProof = 3,
    MerkleUpdate = 4
}

interface CellOptions {
    bits?: Bit[]
    refs?: Cell[]
    type?: CellType
}

class Cell {
    private _bits: Bit[]

    private _refs: Cell[]

    private _type: CellType

    private _mask: Mask

    private hashes: string[]

    private depths: number[]

    constructor (options?: CellOptions) {
        const {
            bits = [],
            refs = [],
            type = CellType.Ordinary
        } = options || {}

        this._bits = bits
        this._refs = refs
        this._type = type

        this.initialize()
    }

    public get bits (): Bit[] {
        return Array.from(this._bits)
    }

    public get refs (): Cell[] {
        return Array.from(this._refs)
    }

    public get type (): CellType {
        return this._type
    }

    public get mask (): Mask {
        return this._mask
    }

    public get level (): number {
        return this._mask.level
    }

    public get exotic (): boolean {
        return this._type !== CellType.Ordinary
    }

    public refsDescriptor (mask: Mask = null): Bit[] {
        const value = this._refs.length + (Number(this.exotic) * 8) + (mask ? mask.value : this.mask.value * 32)
        const bits = value.toString(2).padStart(8, '0').split('').map(el => parseInt(el, 10)) as Bit[]

        return bits
    }

    public bitsDescriptor (): Bit[] {
        const value = Math.ceil(this._bits.length / 8) + Math.floor(this._bits.length / 8)
        const bits = value.toString(2).padStart(8, '0').split('').map(el => parseInt(el, 10)) as Bit[]

        return bits
    }

    public depthDescriptor (depth: number): Bit[] {
        // const value = Math.floor(depth / 256) + (depth % 256)
        // const bits = value.toString(2).padStart(16, '0').split('').map(el => parseInt(el, 10)) as Bit[]

        const d = Uint8Array.from({length: 2}, () => 0)
        d[1] = depth % 256
        d[0] = Math.floor(depth / 256)


        return bytesToBits(d)
    }

    // private get representation (): Bit[] {
    //     let representation = this.descriptors.concat(this.augmentedBits)

    //     this._refs.forEach((ref) => {
    //         const depth = ref.maxDepth

    //         representation = representation.concat(depth)
    //     })

    //     this._refs.forEach((ref) => {
    //         const hex = ref.hash()
    //         const bits = hexToBits(hex)

    //         representation = representation.concat(bits)
    //     })

    //     return representation
    // }

    // public get descriptors (): Bit[] {
    //     return this.refsDescriptor.concat(this.bitsDescriptor)
    // }

    public get augmentedBits (): Bit[] {
        return augment(this._bits)
    }

    // public hash (): string {
    //     const bytes = bitsToBytes(this.representation)

    //     return sha256(bytes)
    // }

    public print (indent: string = ''): string {
        const bits = Array.from(this._bits)
        const areDivisible = bits.length % 4 === 0
        const augmented = !areDivisible ? augment(bits, 4) : bits
        const fiftHex = `${bitsToHex(augmented).toUpperCase()}${!areDivisible ? '_' : ''}`
        const output = [ `${indent}x{${fiftHex}}\n` ]

        this._refs.forEach(ref => output.push(ref.print(`${indent} `)))

        return output.join('')
    }

    public hash (level: number = 3): string {
        if (this.type !== CellType.PrunedBranch) {
            return this.hashes[this.mask.apply(level).hashIndex]
        }

        const { hashIndex } = this.mask.apply(level)
        const { hashIndex: thisHashIndex } = this.mask
        const skip = 16 + (hashIndex * 256)

        return hashIndex !== thisHashIndex
            ? bitsToHex(this._bits.slice(skip, skip + 256))
            : this.hashes[0]
    }

    public depth (level: number = 3): number {
        if (this.type !== CellType.PrunedBranch) {
            return this.depths[this.mask.apply(level).hashIndex]
        }

        const { hashIndex } = this.mask.apply(level)
        const { hashIndex: thisHashIndex } = this.mask
        const skip = 16 + (thisHashIndex * 256) + (hashIndex * 16)

        return hashIndex !== thisHashIndex
            ? bitsToIntUint(this._bits.slice(skip, skip + 16), { type: 'uint' })
            : this.depths[0]
    }

    private validatePrunedBranch (): void {
        if (this._refs.length !== 0) throw new Error("Pruned Branch cell can't has refs")
        if (this._bits.length < 16) throw new Error("Pruned Branch cell can't has less than 16 bits")
        if (this.level < 1 || this.level > 3) {
            throw new Error('Pruned Branch has an invalid level')
        }

        const { hashCount } = this.mask.apply(this.level - 1)
        // level + ??? + hashCount * (hash + depth)
        const size = 8 + 8 + hashCount * (256 + 16)

        if (this._bits.length !== size) {
            throw new Error('Pruned Branch has an invalid data')
        }
    }

    private validateLibraryReference (): void {
        // level + hash
        const size = 8 + 256

        if (this._bits.length !== size || this._refs.length !== 0) {
            throw new Error('Library reference has an invalid data')
        }
    }

    private validateMerkleProof (): void {
        // level + hash + depth
        const size = 8 + 256 + 16

        if (this._bits.length !== size) {
            throw new Error('Merkle Proof has an invalid data')
        }

        if (this._refs.length !== 1) {
            throw new Error('Merkle Proof has an invalid refs')
        }

        const data = Array.from(this._bits.slice(8))

        const proof = bitsToHex(data.splice(0, 256))
        const hash = this._refs[0].hash(0)
        const depth = bitsToIntUint(data.splice(0, 16).reverse(), { type: 'int' })

        if (proof !== hash) {
            throw new Error('Merkle Proof hash mismatch')
        }

        if (depth !== this._refs[0].depth(0)) {
            throw new Error('Merkle Proof depth mismatch')
        }
    }

    private validateMerkleUpdate (): void {
        // level + hash + hash + depth + depth
        const size = 8 + (256 * 2) + (16 * 2)

        if (this._bits.length !== size) {
            throw new Error('Merkle Update has an invalid data')
        }

        if (this._refs.length !== 2) {
            throw new Error('Merkle Update has an invalid refs')
        }

        const data = Array.from(this._bits.slice(8))

        for (let i = 0; i < 2; i++) {
            const proof = bitsToHex(data.splice(0, 256))
            const hash = this._refs[i].hash(0)

            if (proof !== hash) {
                throw new Error(`Merkle Update ref #${i} hash mismatch`)
            }
        }

        for (let i = 0; i < 2; i++) {
            const depth = bitsToIntUint(data.splice(0, 16), { type: 'uint' })

            if (depth !== this._refs[i].depth(0)) {
                throw Error(`Merkle Update ref #${i} depth mismatch`)
            }
        }
    }

    private initialize (): void {
        switch (this.type) {
            case CellType.Ordinary:
                this._mask = new Mask(this._refs.reduce((acc, el) => acc | el.mask.value, 0))
                break
            case CellType.PrunedBranch:
                this._mask = new Mask(bitsToIntUint(this._bits.slice(0, 8), { type: 'uint' }))
                this.validatePrunedBranch()
                break
            case CellType.LibraryReference:
                this._mask = new Mask(0)
                this.validateLibraryReference()
                break
            case CellType.MerkleProof:
                this._mask = new Mask(this._refs[0].mask.value << 1)
                this.validateMerkleProof()
                break
            case CellType.MerkleUpdate:
                this._mask = new Mask((this._refs[0].mask.value | this._refs[1].mask.value) << 1)
                this.validateMerkleUpdate()
                break
            default:
                throw new Error('Unknown exotic cell type')
        }

        const isMerkle = [ CellType.MerkleProof, CellType.MerkleUpdate ].includes(this.type)
        const totalHashes = this.mask.hashCount
        const hashCount = this.type === CellType.PrunedBranch ? 1 : totalHashes
        const hashIndexOffset = totalHashes - hashCount

        this.hashes = []
        this.depths = []

        for (let levelIndex = 0, hashIndex = 0; levelIndex <= this.level; levelIndex++) {
            if (!this.mask.isSignificant(levelIndex)) {
                continue
            }

            if (hashIndex < hashIndexOffset) {
                hashIndex++

                continue
            }

            const refsDescriptor = this.refsDescriptor(this.mask.apply(levelIndex))
            const bitsDescriptor = this.bitsDescriptor()
            const descriptors = refsDescriptor.concat(bitsDescriptor)
            const data = hashIndex === hashIndexOffset
                ? this.augmentedBits
                : hexToBits(this.hashes[hashIndex - hashIndexOffset - 1])

            let representation = descriptors.concat(data)

            const destIndex = hashIndex - hashIndexOffset
            let depth = 0

            this.refs.forEach((ref) => {
                const level = levelIndex + Number(isMerkle)
                const childDepth = ref.depth(level)

                representation = representation.concat(this.depthDescriptor(childDepth))

                depth = Math.max(depth, childDepth)
            })

            if (this.refs.length) {
                if (depth > 1024) {
                    throw new Error('Depth is too big')
                }

                depth++
            }

            this.depths[destIndex] = depth

            this.refs.forEach((ref) => {
                const level = levelIndex + Number(isMerkle)
                const childHash = ref.hash(level)

                representation = representation.concat(hexToBits(childHash))
            })

            this.hashes[destIndex] = sha256(bitsToBytes(representation))

            hashIndex++
        }
    }
}

export {
    Cell,
    CellType
}
