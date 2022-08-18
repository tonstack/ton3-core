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

const HASH_BITS = 256
const DEPTH_BITS = 16

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

    private mask: Mask

    private hashes: string[] = []

    private depths: number[] = []

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

    public get exotic (): boolean {
        return this._type !== CellType.Ordinary
    }

    public getRefsDescriptor (mask?: Mask): Bit[] {
        const value = this._refs.length + (Number(this.exotic) * 8) + ((mask ? mask.value : this.mask.value) * 32)
        const descriptor = Uint8Array.from([ value ])

        return bytesToBits(descriptor)
    }

    public getBitsDescriptor (): Bit[] {
        const value = Math.ceil(this._bits.length / 8) + Math.floor(this._bits.length / 8)
        const descriptor = Uint8Array.from([ value ])

        return bytesToBits(descriptor)
    }

    public getDepthDescriptor (depth: number): Bit[] {
        const descriptor = Uint8Array.from([ Math.floor(depth / 256), depth % 256 ])

        return bytesToBits(descriptor)
    }

    public getAugmentedBits (): Bit[] {
        return augment(this._bits)
    }

    public print (indent: number = 0): string {
        const bits = Array.from(this._bits)
        const areDivisible = bits.length % 4 === 0
        const augmented = !areDivisible ? augment(bits, 4) : bits
        const fiftHex = `${bitsToHex(augmented).toUpperCase()}${!areDivisible ? '_' : ''}`
        const output = [ `${' '.repeat(indent)}x{${fiftHex}}\n` ]

        this._refs.forEach(ref => output.push(ref.print(indent + 1)))

        return output.join('')
    }

    // Top-level hash by default
    public hash (level: number = 3): string {
        if (this.type !== CellType.PrunedBranch) {
            return this.hashes[this.mask.apply(level).hashIndex]
        }

        const { hashIndex } = this.mask.apply(level)
        const { hashIndex: thisHashIndex } = this.mask
        const skip = 16 + (hashIndex * HASH_BITS)

        return hashIndex !== thisHashIndex
            ? bitsToHex(this._bits.slice(skip, skip + HASH_BITS))
            : this.hashes[0]
    }

    // Top-level depth by default
    public depth (level: number = 3): number {
        if (this.type !== CellType.PrunedBranch) {
            return this.depths[this.mask.apply(level).hashIndex]
        }

        const { hashIndex } = this.mask.apply(level)
        const { hashIndex: thisHashIndex } = this.mask
        const skip = 16 + (thisHashIndex * HASH_BITS) + (hashIndex * DEPTH_BITS)

        return hashIndex !== thisHashIndex
            ? bitsToIntUint(this._bits.slice(skip, skip + DEPTH_BITS), { type: 'uint' })
            : this.depths[0]
    }

    public eq (cell: Cell): boolean {
        return this.hash() === cell.hash()
    }

    private validatePrunedBranch (): void {
        if (this._refs.length !== 0) throw new Error('Pruned Branch cell can\'t has refs')
        if (this._bits.length < 16) throw new Error('Pruned Branch cell can\'t has less than 16 bits')
        if (this.mask.level < 1 || this.mask.level > 3) {
            throw new Error('Pruned Branch has an invalid level')
        }

        const { hashCount } = this.mask.apply(this.mask.level - 1)
        // level + ??? + hashCount * (hash + depth)
        const size = 8 + 8 + hashCount * (HASH_BITS + DEPTH_BITS)

        if (this._bits.length !== size) {
            throw new Error('Pruned Branch has an invalid data')
        }
    }

    private validateLibraryReference (): void {
        // level + hash
        const size = 8 + HASH_BITS

        if (this._bits.length !== size || this._refs.length !== 0) {
            throw new Error('Library reference has an invalid data')
        }
    }

    private validateMerkleProof (): void {
        // level + hash + depth
        const size = 8 + HASH_BITS + DEPTH_BITS

        if (this._bits.length !== size) {
            throw new Error('Merkle Proof has an invalid data')
        }

        if (this._refs.length !== 1) {
            throw new Error('Merkle Proof has an invalid refs')
        }

        const data = Array.from(this._bits.slice(8))

        const proof = bitsToHex(data.splice(0, HASH_BITS))
        const hash = this._refs[0].hash(0)
        const depth = bitsToIntUint(data.splice(0, DEPTH_BITS).reverse(), { type: 'int' })

        if (proof !== hash) {
            throw new Error('Merkle Proof hash mismatch')
        }

        if (depth !== this._refs[0].depth(0)) {
            throw new Error('Merkle Proof depth mismatch')
        }
    }

    private validateMerkleUpdate (): void {
        // level + hash + hash + depth + depth
        const size = 8 + (HASH_BITS * 2) + (DEPTH_BITS * 2)

        if (this._bits.length !== size) {
            throw new Error('Merkle Update has an invalid data')
        }

        if (this._refs.length !== 2) {
            throw new Error('Merkle Update has an invalid refs')
        }

        const data = Array.from(this._bits.slice(8))

        for (let i = 0; i < 2; i++) {
            const proof = bitsToHex(data.splice(0, HASH_BITS))
            const hash = this._refs[i].hash(0)

            if (proof !== hash) {
                throw new Error(`Merkle Update ref #${i} hash mismatch`)
            }
        }

        for (let i = 0; i < 2; i++) {
            const depth = bitsToIntUint(data.splice(0, DEPTH_BITS), { type: 'uint' })

            if (depth !== this._refs[i].depth(0)) {
                throw Error(`Merkle Update ref #${i} depth mismatch`)
            }
        }
    }

    private initialize (): void {
        switch (this.type) {
            case CellType.Ordinary:
                this.mask = new Mask(this._refs.reduce((acc, el) => acc | el.mask.value, 0))
                break
            case CellType.PrunedBranch:
                this.mask = new Mask(bitsToIntUint(this._bits.slice(0, 8), { type: 'uint' }))
                this.validatePrunedBranch()
                break
            case CellType.LibraryReference:
                this.mask = new Mask(0)
                this.validateLibraryReference()
                break
            case CellType.MerkleProof:
                this.mask = new Mask(this._refs[0].mask.value >> 1)
                this.validateMerkleProof()
                break
            case CellType.MerkleUpdate:
                this.mask = new Mask((this._refs[0].mask.value | this._refs[1].mask.value) >> 1)
                this.validateMerkleUpdate()
                break
            default:
                throw new Error('Unknown exotic cell type')
        }

        const isMerkle = [ CellType.MerkleProof, CellType.MerkleUpdate ].includes(this.type)
        const isPrunedBranch = this.type === CellType.PrunedBranch
        const hashCount = isPrunedBranch ? 1 : this.mask.hashCount
        const hashIndexOffset = this.mask.hashCount - hashCount

        for (let levelIndex = 0, hashIndex = 0; levelIndex <= this.mask.level; levelIndex++) {
            if (!this.mask.isSignificant(levelIndex)) continue
            if (hashIndex < hashIndexOffset) {
                hashIndex++

                continue
            }

            if (
                (hashIndex === hashIndexOffset && levelIndex !== 0 && !isPrunedBranch)
                || (hashIndex !== hashIndexOffset && levelIndex === 0 && isPrunedBranch)
            ) {
                throw new Error('Can\'t deserialize cell')
            }

            const level = levelIndex + Number(isMerkle)
            const bits = hashIndex !== hashIndexOffset
                ? hexToBits(this.hashes[hashIndex - hashIndexOffset - 1])
                : this.getAugmentedBits()

            let representation = [].concat(
                this.getRefsDescriptor(this.mask.apply(levelIndex)),
                this.getBitsDescriptor(),
                bits
            )

            const destIndex = hashIndex - hashIndexOffset
            let depth = 0

            this.refs.forEach((ref) => {
                const refDepth = ref.depth(level)

                representation = representation.concat(this.getDepthDescriptor(refDepth))

                depth = Math.max(depth, refDepth)
            })

            if (this.refs.length && depth >= 1024) {
                throw new Error('Depth is too big')
            }

            this.refs.forEach((ref) => {
                const refHash = ref.hash(level)

                representation = representation.concat(hexToBits(refHash))
            })

            this.depths[destIndex] = this.refs.length ? depth + 1 : depth
            this.hashes[destIndex] = sha256(bitsToBytes(representation))

            hashIndex++
        }
    }
}

export {
    Cell,
    CellType,
    CellOptions
}
