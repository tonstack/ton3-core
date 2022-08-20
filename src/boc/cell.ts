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

interface CellTypeMapper {
    validate: (bits: Bit[], refs: Cell[]) => void
    mask: (bits: Bit[], refs: Cell[]) => Mask
}

interface CellOptions {
    bits?: Bit[]
    refs?: Cell[]
    type?: CellType
}

const validateOrdinary = (bits: Bit[], refs: Cell[]): void => {
    if (bits.length > 1023) throw new Error('Ordinary cell can\'t has more than 1023 bits')
    if (refs.length > 4) throw new Error('Ordinary cell can\'t has more than 4 refs')
}

const validatePrunedBranch = (bits: Bit[], refs: Cell[]): void => {
    if (bits.length < 16) throw new Error('Pruned Branch cell can\'t has less than 16 bits')
    if (refs.length !== 0) throw new Error('Pruned Branch cell can\'t has refs')

    const mask = new Mask(bitsToIntUint(bits.slice(0, 8), { type: 'uint' }))

    if (mask.level < 1 || mask.level > 3) {
        throw new Error('Pruned Branch has an invalid level')
    }

    const { hashCount } = mask.apply(mask.level - 1)
    // level + ??? + hashCount * (hash + depth)
    const size = 8 + 8 + hashCount * (HASH_BITS + DEPTH_BITS)

    if (bits.length !== size) {
        throw new Error('Pruned Branch has an invalid data')
    }
}

const validateLibraryReference = (bits: Bit[], refs: Cell[]): void => {
    // level + hash
    const size = 8 + HASH_BITS

    if (bits.length !== size) {
        throw new Error('Library reference has an invalid data')
    }

    if (refs.length !== 0) {
        throw new Error('Library reference has an invalid refs')
    }
}

const validateMerkleProof = (bits: Bit[], refs: Cell[]): void => {
    // level + hash + depth
    const size = 8 + HASH_BITS + DEPTH_BITS

    if (bits.length !== size) {
        throw new Error('Merkle Proof has an invalid data')
    }

    if (refs.length !== 1) {
        throw new Error('Merkle Proof has an invalid refs')
    }

    const data = Array.from(bits.slice(8))

    const proof = bitsToHex(data.splice(0, HASH_BITS))
    const hash = refs[0].hash(0)
    const depth = bitsToIntUint(data.splice(0, DEPTH_BITS), { type: 'uint' })

    if (proof !== hash) {
        throw new Error('Merkle Proof hash mismatch')
    }

    if (depth !== refs[0].depth(0)) {
        throw new Error('Merkle Proof depth mismatch')
    }
}

const validateMerkleUpdate = (bits: Bit[], refs: Cell[]): void => {
    // level + hash + hash + depth + depth
    const size = 8 + (HASH_BITS * 2) + (DEPTH_BITS * 2)

    if (bits.length !== size) {
        throw new Error('Merkle Update has an invalid data')
    }

    if (refs.length !== 2) {
        throw new Error('Merkle Update has an invalid refs')
    }

    const data = Array.from(bits.slice(8))

    for (let i = 0; i < 2; i++) {
        const proof = bitsToHex(data.splice(0, HASH_BITS))
        const hash = refs[i].hash(0)

        if (proof !== hash) {
            throw new Error(`Merkle Update ref #${i} hash mismatch`)
        }
    }

    for (let i = 0; i < 2; i++) {
        const depth = bitsToIntUint(data.splice(0, DEPTH_BITS), { type: 'uint' })

        if (depth !== refs[i].depth(0)) {
            throw Error(`Merkle Update ref #${i} depth mismatch`)
        }
    }
}

const validateUnknown = () => {
    throw new Error('Unknown cell type')
}

const mapper = new Map<CellType, CellTypeMapper>([
    [ CellType.Ordinary, {
        validate: validateOrdinary,
        mask: (_b: Bit[], r: Cell[]) => new Mask(r.reduce((acc, el) => acc | el.mask.value, 0))
    } ],
    [ CellType.PrunedBranch, {
        validate: validatePrunedBranch,
        mask: (b: Bit[]) => new Mask(bitsToIntUint(b.slice(0, 8), { type: 'uint' }))
    } ],
    [ CellType.LibraryReference, {
        validate: validateLibraryReference,
        mask: () => new Mask(0)
    } ],
    [ CellType.MerkleProof, {
        validate: validateMerkleProof,
        mask: (_b: Bit[], r: Cell[]) => new Mask(r[0].mask.value >> 1)
    } ],
    [ CellType.MerkleUpdate, {
        validate: validateMerkleUpdate,
        mask: (_b: Bit[], r: Cell[]) => new Mask((r[0].mask.value | r[1].mask.value) >> 1)
    } ]
])

class Cell {
    private _bits: Bit[]

    private _refs: Cell[]

    private _type: CellType

    private _mask: Mask

    private hashes: string[] = []

    private depths: number[] = []

    constructor (options?: CellOptions) {
        const {
            bits = [],
            refs = [],
            type = CellType.Ordinary
        } = options || {}

        const { validate, mask } = mapper.get(type) || { validate: validateUnknown }

        validate(bits, refs)

        this._mask = mask(bits, refs)
        this._type = type
        this._bits = bits
        this._refs = refs

        this.initialize()
    }

    public get bits (): Bit[] {
        return Array.from(this._bits)
    }

    public get refs (): Cell[] {
        return Array.from(this._refs)
    }

    public get mask (): Mask {
        return this._mask
    }

    public get type (): CellType {
        return this._type
    }

    public get exotic (): boolean {
        return this._type !== CellType.Ordinary
    }

    private initialize (): void {
        const isMerkle = [ CellType.MerkleProof, CellType.MerkleUpdate ].includes(this.type)
        const isPrunedBranch = this.type === CellType.PrunedBranch
        const hashIndexOffset = isPrunedBranch
            ? this.mask.hashCount - 1
            : 0

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
            const refsDescriptor = this.getRefsDescriptor(this.mask.apply(levelIndex))
            const bitsDescriptor = this.getBitsDescriptor()
            const data = hashIndex !== hashIndexOffset
                ? hexToBits(this.hashes[hashIndex - hashIndexOffset - 1])
                : this.getAugmentedBits()

            const { repr, depth } = this._refs.concat(this._refs).reduce((acc, ref, i) => {
                const isDepthCalculation = i < this._refs.length

                if (isDepthCalculation) {
                    const refDepth = ref.depth(level)

                    acc.repr = acc.repr.concat(this.getDepthDescriptor(refDepth))
                    acc.depth = Math.max(acc.depth, refDepth)
                } else {
                    const refHash = ref.hash(level)

                    acc.repr = acc.repr.concat(hexToBits(refHash))
                }

                return acc
            }, { repr: [].concat(refsDescriptor, bitsDescriptor, data), depth: 0 })

            if (this._refs.length && depth >= 1024) {
                throw new Error('Cell depth can\'t be more than 1024')
            }

            const dest = hashIndex - hashIndexOffset

            this.depths[dest] = this._refs.length ? depth + 1 : depth
            this.hashes[dest] = sha256(bitsToBytes(repr))

            hashIndex++
        }
    }

    private getDepthDescriptor (depth: number): Bit[] {
        const descriptor = Uint8Array.from([ Math.floor(depth / 256), depth % 256 ])

        return bytesToBits(descriptor)
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

    public getAugmentedBits (): Bit[] {
        return augment(this._bits)
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

    public print (indent: number = 0): string {
        const bits = Array.from(this._bits)
        const areDivisible = bits.length % 4 === 0
        const augmented = !areDivisible ? augment(bits, 4) : bits
        const fiftHex = `${bitsToHex(augmented).toUpperCase()}${!areDivisible ? '_' : ''}`
        const output = [ `${' '.repeat(indent)}x{${fiftHex}}\n` ]

        this._refs.forEach(ref => output.push(ref.print(indent + 1)))

        return output.join('')
    }
}

export {
    Cell,
    CellType,
    CellOptions
}
