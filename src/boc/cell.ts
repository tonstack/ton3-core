import type { Bit } from '../types/bit'
import type { Builder} from './builder'
import { Mask } from './mask'
import { Slice } from './slice'
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
    if (bits.length > 1023) throw new Error(`Ordinary cell can't has more than 1023 bits, got "${bits.length}"`)
    if (refs.length > 4) throw new Error(`Ordinary cell can't has more than 4 refs, got "${refs.length}"`)
}

const validatePrunedBranch = (bits: Bit[], refs: Cell[]): void => {
    // type + mask + (higher hashes * (hash + depth))
    const minSize = 8 + 8 + (1 * (HASH_BITS + DEPTH_BITS))

    if (bits.length < minSize) { 
        throw new Error(`Pruned Branch cell can't has less than (8 + 8 + 256 + 16) bits, got "${bits.length}"`)
    }

    if (refs.length !== 0) {
        throw new Error(`Pruned Branch cell can't has refs, got "${refs.length}"`)
    }

    const type = bitsToIntUint(bits.slice(0, 8), { type: 'int' })

    if (type !== CellType.PrunedBranch) {
        throw new Error(`Pruned Branch cell type must be exactly ${CellType.PrunedBranch}, got "${type}"`)
    }

    const mask = new Mask(bitsToIntUint(bits.slice(8, 16), { type: 'uint' }))

    if (mask.level < 1 || mask.level > 3) {
        throw new Error(`Pruned Branch cell level must be >= 1 and <= 3, got "${mask.level}"`)
    }

    const { hashCount } = mask.apply(mask.level - 1)
    const size = 8 + 8 + (hashCount * (HASH_BITS + DEPTH_BITS))

    if (bits.length !== size) {
        throw new Error(`Pruned Branch cell with level "${mask.level}" must have exactly ${size} bits, got "${bits.length}"`)
    }
}

const validateLibraryReference = (bits: Bit[], refs: Cell[]): void => {
    // type + hash
    const size = 8 + HASH_BITS

    if (bits.length !== size) {
        throw new Error(`Library Reference cell must have exactly (8 + 256) bits, got "${bits.length}"`)
    }

    if (refs.length !== 0) {
        throw new Error(`Library Reference cell can't has refs, got "${refs.length}"`)
    }

    const type = bitsToIntUint(bits.slice(0, 8), { type: 'int' })

    if (type !== CellType.LibraryReference) {
        throw new Error(`Library Reference cell type must be exactly ${CellType.LibraryReference}, got "${type}"`)
    }
}

const validateMerkleProof = (bits: Bit[], refs: Cell[]): void => {
    // type + hash + depth
    const size = 8 + HASH_BITS + DEPTH_BITS

    if (bits.length !== size) {
        throw new Error(`Merkle Proof cell must have exactly (8 + 256 + 16) bits, got "${bits.length}"`)
    }

    if (refs.length !== 1) {
        throw new Error(`Merkle Proof cell must have exactly 1 ref, got "${refs.length}"`)
    }

    const type = bitsToIntUint(bits.slice(0, 8), { type: 'int' })

    if (type !== CellType.MerkleProof) {
        throw new Error(`Merkle Proof cell type must be exactly ${CellType.MerkleProof}, got "${type}"`)
    }

    const data = Array.from(bits.slice(8))
    const proofHash = bitsToHex(data.splice(0, HASH_BITS))
    const proofDepth = bitsToIntUint(data.splice(0, DEPTH_BITS), { type: 'uint' })
    const refHash = refs[0].hash(0)
    const refDepth = refs[0].depth(0)

    if (proofHash !== refHash) {
        throw new Error(`Merkle Proof cell ref hash must be exactly "${proofHash}", got "${refHash}"`)
    }

    if (proofDepth !== refDepth) {
        throw new Error(`Merkle Proof cell ref depth must be exactly "${proofDepth}", got "${refDepth}"`)
    }
}

const validateMerkleUpdate = (bits: Bit[], refs: Cell[]): void => {
    // type + hash + hash + depth + depth
    const size = 8 + (2 * (HASH_BITS + DEPTH_BITS))

    if (bits.length !== size) {
        throw new Error(`Merkle Update cell must have exactly (8 + (2 * (256 + 16))) bits, got "${bits.length}"`)
    }

    if (refs.length !== 2) {
        throw new Error(`Merkle Update cell must have exactly 2 refs, got "${refs.length}"`)
    }

    const type = bitsToIntUint(bits.slice(0, 8), { type: 'int' })

    if (type !== CellType.MerkleUpdate) {
        throw new Error(`Merkle Update cell type must be exactly ${CellType.MerkleUpdate}, got "${type}"`)
    }

    const data = Array.from(bits.slice(8))
    const hashes = [ data.splice(0, HASH_BITS), data.splice(0, HASH_BITS) ].map(el => bitsToHex(el))
    const depths = [ data.splice(0, DEPTH_BITS), data.splice(0, DEPTH_BITS) ].map(el => bitsToIntUint(el, { type: 'uint' }))

    refs.forEach((ref, i) => {
        const proofHash = hashes[i]
        const proofDepth = depths[i]
        const refHash = ref.hash(0)
        const refDepth = ref.depth(0)

        if (proofHash !== refHash) {
            throw new Error(`Merkle Update cell ref #${i} hash must be exactly "${proofHash}", got "${refHash}"`)
        }

        if (proofDepth !== refDepth) {
            throw Error(`Merkle Update cell ref #${i} depth must be exactly "${proofDepth}", got "${refDepth}"`)
        }
    })
}

const getMapper = (type: CellType): CellTypeMapper => {
    const map = new Map<CellType, CellTypeMapper>([
        [ CellType.Ordinary, {
            validate: validateOrdinary,
            mask: (_b: Bit[], r: Cell[]) => new Mask(r.reduce((acc, el) => acc | el.mask.value, 0))
        } ],
        [ CellType.PrunedBranch, {
            validate: validatePrunedBranch,
            mask: (b: Bit[]) => new Mask(bitsToIntUint(b.slice(8, 16), { type: 'uint' }))
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

    const result = map.get(type)

    if (result === undefined) {
        throw new Error('Unknown cell type')
    }

    return result
}

class Cell {
    private _bits: Bit[]

    private _refs: Cell[]

    private _type: CellType

    private _mask: Mask

    private hashes: string[] = []

    private depths: number[] = []

    /**
     * Creates an instance of {@link Cell}
     * - You should avoid creating {@link Cell} manually
     * - Use {@link Builder} to construct your {@link Cell}
     *
     * @param {CellOptions} [options]
     *
     * @example
     * ```ts
     * import { Cell, CellType } from 'ton3-core'
     * 
     * const ref = new Cell()
     * const cell = new Cell({
     *     type: CellType.Ordinary,
     *     bits: [ 1, 0, 1 ],
     *     refs: [ ref ]
     * })
     * ```
     */
    constructor (options?: CellOptions) {
        const {
            bits = [],
            refs = [],
            type = CellType.Ordinary
        } = options || {}

        const { validate, mask } = getMapper(type)

        validate(bits, refs)

        this._mask = mask(bits, refs)
        this._type = type
        this._bits = bits
        this._refs = refs

        this.initialize()
    }

    /**
     * Get current {@link Cell} instance bits
     *
     * @example
     * ```ts
     * import { Builder } from 'ton3-core'
     *
     * const cell = new Builder().storeBits([ 1, 0 ])
     *
     * console.log(cell.bits) // [ 1, 0 ]
     * ```
     *
     * @returns {Bit[]}
     */
    public get bits (): Bit[] {
        return Array.from(this._bits)
    }

    /**
     * Get current {@link Cell} instance refs
     *
     * @example
     * ```ts
     * import { Builder } from 'ton3-core'
     *
     * const ref = new Builder().cell()
     * const cell = new Builder().storeRef(ref)
     *
     * console.log(cell.refs) // [ ref ]
     * ```
     *
     * @returns {Cell[]}
     */
    public get refs (): Cell[] {
        return Array.from(this._refs)
    }

    /**
     * Get current {@link Cell} instance {@link Mask} (that includes level, hashes count, etc...)
     *
     * @example
     * ```ts
     * import { Builder } from 'ton3-core'
     *
     * const cell = new Builder().cell()
     *
     * console.log(cell.mask.level) // 0
     * console.log(cell.mask.hashCount) // 1
     * ```
     *
     * @returns {Mask}
     */
    public get mask (): Mask {
        return this._mask
    }

    /**
     * Get current {@link Cell} instance {@link CellType}
     *
     * @example
     * ```ts
     * import { CellType, Builder } from 'ton3-core'
     *
     * const cell = new Builder().cell()
     *
     * console.log(cell.type === CellType.Ordinary) // true
     * ```
     *
     * @returns {CellType}
     */
    public get type (): CellType {
        return this._type
    }

    /**
     * Check if current {@link Cell} instance is exotic type
     *
     * @example
     * ```ts
     * import { CellType, Builder, Bit } from 'ton3-core'
     *
     * const zeroes = Array.from({ length: 8 + 256}).fill(0) as Bit[]
     * const cell1 = new Builder().cell(CellType.Ordinary)
     * const cell2 = new Builder().storeBits(zeroes).cell(CellType.LibraryReference)
     *
     * console.log(cell1.exotic) // false
     * console.log(cell2.exotic) // true
     * ```
     *
     * @returns {boolean}
     */
    public get exotic (): boolean {
        return this._type !== CellType.Ordinary
    }

    private initialize (): void {
        const hasRefs = this._refs.length > 0
        const isMerkle = [ CellType.MerkleProof, CellType.MerkleUpdate ].includes(this.type)
        const isPrunedBranch = this.type === CellType.PrunedBranch
        const hashIndexOffset = isPrunedBranch
            ? this.mask.hashCount - 1
            : 0

        for (let levelIndex = 0, hashIndex = 0; levelIndex <= this.mask.level; levelIndex++) {
            if (!this.mask.isSignificant(levelIndex)) {
                continue
            }

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

            const refLevel = levelIndex + Number(isMerkle)
            const refsDescriptor = this.getRefsDescriptor(this.mask.apply(levelIndex))
            const bitsDescriptor = this.getBitsDescriptor()
            const data = hashIndex !== hashIndexOffset
                ? hexToBits(this.hashes[hashIndex - hashIndexOffset - 1])
                : this.getAugmentedBits()

            const { depthRepr, hashRepr, depth } = this._refs.reduce((acc, ref) => {
                const refDepth = ref.depth(refLevel)
                const refHash = ref.hash(refLevel)

                acc.depthRepr = acc.depthRepr.concat(this.getDepthDescriptor(refDepth))
                acc.hashRepr = acc.hashRepr.concat(hexToBits(refHash))
                acc.depth = Math.max(acc.depth, refDepth)

                return acc
            }, { depthRepr: [] as Bit[], hashRepr: [] as Bit[], depth: 0 })

            const representation = [].concat(refsDescriptor, bitsDescriptor, data, depthRepr, hashRepr)

            if (this._refs.length && depth >= 1024) {
                throw new Error('Cell depth can\'t be more than 1024')
            }

            const dest = hashIndex - hashIndexOffset

            this.depths[dest] = depth + Number(hasRefs)
            this.hashes[dest] = sha256(bitsToBytes(representation))

            hashIndex++
        }
    }

    /**
     * Calculate depth descriptor
     * 
     * @param {number} depth
     * 
     * @private
     */
    private getDepthDescriptor (depth: number): Bit[] {
        const descriptor = Uint8Array.from([ Math.floor(depth / 256), depth % 256 ])

        return bytesToBits(descriptor)
    }

    /**
     * Get current {@link Cell} instance refs descriptor
     * 
     * @param {Mask} [mask]
     * 
     * @private
     */
    public getRefsDescriptor (mask?: Mask): Bit[] {
        const value = this._refs.length + (Number(this.exotic) * 8) + ((mask ? mask.value : this.mask.value) * 32)
        const descriptor = Uint8Array.from([ value ])

        return bytesToBits(descriptor)
    }

    /**
     * Get current {@link Cell} instance bits descriptor
     * 
     * @private
     */
    public getBitsDescriptor (): Bit[] {
        const value = Math.ceil(this._bits.length / 8) + Math.floor(this._bits.length / 8)
        const descriptor = Uint8Array.from([ value ])

        return bytesToBits(descriptor)
    }

    /**
     * Get current {@link Cell} instance augmented bits
     * 
     * @private
     */
    public getAugmentedBits (): Bit[] {
        return augment(this._bits)
    }

    /**
     * Get cell's hash in hex (max level by default)
     * 
     * @param {number} [level=3]
     *
     * @example
     * ```ts
     * import { Builder } from 'ton3-core'
     *
     * const cell = new Builder().cell()
     *
     * console.log(cell.hash()) // 96a296d224f285c67bee93c30f8a309157f0daa35dc5b87e410b78630a09cfc7
     * ```
     *
     * @return {string}
     */
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

    /**
     * Get cell's depth (max level by default)
     * 
     * @param {number} [level=3]
     *
     * @example
     * ```ts
     * import { Builder } from 'ton3-core'
     *
     * const cell1 = new Builder().cell()
     * const cell2 = new Builder().storeRef(cell1).cell()
     *
     * console.log(cell2.depth()) // 1
     * ```
     *
     * @return {number}
     */
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

    /**
     * Get {@link Slice} from current instance
     * - Same as `Slice.parse(cell)`
     *
     * @example
     * ```ts
     * import { Builder } from 'ton3-core'
     *
     * const cell = new Builder()
     *     .storeBits([ 1, 0 ])
     *     .cell()
     * 
     * const slice = cell.slice()
     *
     * console.log(slice.loadBits(2)) // [ 1, 0 ]
     * console.log(cell.bits) // [ 1, 0 ]
     * ```
     *
     * @return {Slice}
     */
    public slice (): Slice {
        return Slice.parse(this)
    }

    /**
     * Print cell as fift-hex
     * 
     * @param {number} [indent=1] Indentation of nested elements
     *
     * @example
     * ```ts
     * import { Builder } from 'ton3-core'
     *
     * const cell = new Builder().cell()
     *
     * console.log(cell.print()) // x{_}
     * ```
     *
     * @return {string}
     */
    public print (indent: number = 1, size = 0): string {
        const bits = Array.from(this._bits)
        const areDivisible = bits.length % 4 === 0
        const augmented = !areDivisible ? augment(bits, 4) : bits
        const fiftHex = `${bitsToHex(augmented).toUpperCase()}${!areDivisible ? '_' : ''}`
        const output = [ `${' '.repeat(indent * size)}x{${fiftHex}}\n` ]

        this._refs.forEach(ref => output.push(ref.print(indent, size + 1)))

        return output.join('')
    }

    /**
     * Checks {@link Cell} equality by comparing cell hashes
     * 
     * @param {Cell} cell
     *
     * @example
     * ```ts
     * import { Builder } from 'ton3-core'
     *
     * const cell = new Builder().storeBits([ 1, 0 ]).cell()
     * const equal = new Builder().storeBits([ 1, 0 ]).cell()
     * const notEqual = new Builder().storeBits([ 0, 1 ]).cell()
     *
     * console.log(equal.eq(cell), notEqual.eq(cell)) // true, false
     * ```
     *
     * @return {boolean}
     */
    public eq (cell: Cell): boolean {
        return this.hash() === cell.hash()
    }
}

export {
    Cell,
    CellType,
    CellOptions
}
