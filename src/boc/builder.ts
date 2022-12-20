import type { Bit } from '../types/bit'
import type { Coins } from '../coins'
import type { HashmapE } from './hashmap'
import { Address } from '../address'
import { Slice } from './slice'
import {
    Cell,
    CellType
} from './cell'
import {
    bitsToBytes,
    stringToBytes
} from '../utils/helpers'

type BitLike = Bit | number | boolean

/**
 * Cell Builder
 *
 * @class Builder
 */
class Builder {
    private _size: number

    private _refs: Cell[]

    private _bits: Bit[]

    constructor (size: number = 1023) {
        this._size = size
        this._bits = []
        this._refs = []
    }

    private checkSliceType (slice: Slice): void {
        if (slice instanceof Slice === false) {
            throw new Error('Builder: can\'t store slice, because it\'s type is not a Slice.')
        }
    }

    private checkAddressType (address: Address): void {
        if (address instanceof Address === false) {
            throw new Error('Builder: can\'t store address, because it\'s type is not an Address.')
        }
    }

    private checkBitsTypeAndNormalize (bits: BitLike[]): Bit[] {
        return bits.map(bit => {
            if (bit !== 0 && bit !== 1 && bit !== false && bit !== true) {
                throw new Error('Builder: can\'t store bit, because it\'s type is not a Number or Boolean, or value doesn\'t equals 0 nor 1.')
            }

            return (bit === 1 || bit === true) ? 1 : 0
        })
    }

    private checkBitsOverflow (size: number): void {
        if (size > this.remainder) {
            throw new Error(`Builder: bits overflow. Can't add ${size} bits. Only ${this.remainder} bits left.`)
        }
    }

    private checkRefsType (refs: Cell[]): void {
        if (!refs.every(cell => cell instanceof Cell === true)) {
            throw new Error('Builder: can\'t store ref, because it\'s type is not a Cell.')
        }
    }

    private checkRefsOverflow (size: number): void {
        if (size > (4 - this._refs.length)) {
            throw new Error(`Builder: refs overflow. Can't add ${size} refs. Only ${4 - this._refs.length} refs left.`)
        }
    }

    private storeNumber (value: bigint, size: number): this {
        const bits = Array.from({ length: size })
            .map((_el, i) => Number(((value >> BigInt(i)) & 1n) === 1n) as Bit)
            .reverse()

        this.storeBits(bits)

        return this
    }

    /**
     * Returns instance maximum allowed size in bits.
     *
     * @readonly
     * @type {number}
     */
    public get size (): number {
        return this._size
    }

    /**
     * Returns instance stored bits {@link Bit}.
     *
     * @readonly
     * @type {Bit[]}
     */
    public get bits (): Bit[] {
        return Array.from(this._bits)
    }

    /**
     * Returns instance stored bits in bytes.
     *
     * @readonly
     * @type {Uint8Array}
     */
    public get bytes (): Uint8Array {
        return bitsToBytes(this._bits)
    }

    /**
     * Returns instance stored refs {@link Cell}.
     *
     * @readonly
     * @type {Cell[]}
     */
    public get refs (): Cell[] {
        return Array.from(this._refs)
    }

    /**
     * Returns instance unused space in bits.
     *
     * @readonly
     * @type {number}
     */
    public get remainder (): number {
        return this._size - this._bits.length
    }

    /**
     * Merge {@link Slice} into instance.
     *
     * @param {Slice} slice - An instance of a {@link Slice}.
     * @returns {this}
     */
    public storeSlice (slice: Slice): this {
        this.checkSliceType(slice)

        const { bits, refs } = slice

        this.checkBitsOverflow(bits.length)
        this.checkRefsOverflow(refs.length)
        this.storeBits(bits)

        refs.forEach(ref => this.storeRef(ref))

        return this
    }

    /**
     * Add cell to instance refs.
     *
     * @param {Cell} ref - {@link Cell} to reference.
     *
     * @returns {this}
     */
    public storeRef (ref: Cell): this {
        this.checkRefsType([ ref ])
        this.checkRefsOverflow(1)
        this._refs.push(ref)

        return this
    }

    /**
     * Add unary one bit and cell to instance refs or unary zero bit.
     *
     * @param {(Cell | null)} ref - {@link Cell} or null to reference.
     *
     * @returns {this}
     */
    public storeMaybeRef (ref: Cell | null): this {
        if (ref === null) {
            return this.storeBit(0)
        }

        return this.storeBit(1).storeRef(ref)
    }

    /**
     * Add multiple cells to instance refs.
     *
     * @param {Cell[]} refs - Array of {@link Cell} to reference.
     *
     * @returns {this}
     */
    public storeRefs (refs: Cell[]): this {
        this.checkRefsType(refs)
        this.checkRefsOverflow(refs.length)
        this._refs.push(...refs)

        return this
    }

    /**
     * Store one bit in instance.
     *
     * @param {(Bit | number | boolean)} bit - 1 or 0.
     *
     * @returns {this}
     */
    public storeBit (bit: BitLike): this {
        const value = this.checkBitsTypeAndNormalize([ bit ])

        this.checkBitsOverflow(1)
        this._bits = this._bits.concat(value)

        return this
    }

    /**
     * Store multiple bits as array in instance.
     *
     * @param {(Bit[] | number[])} bits - Array of 1 and/or 0.
     *
     * @returns {this}
     */
    public storeBits (bits: BitLike[]): this {
        const value = this.checkBitsTypeAndNormalize(bits)

        this.checkBitsOverflow(value.length)
        this._bits = this._bits.concat(value)

        return this
    }

    /**
     * Store an integer in instance.
     *
     * @param {(number | bigint)} value - Int.
     * @param {number} size - Size in bits of allocated space for value.
     * @returns {this}
     */
    public storeInt (value: number | bigint, size: number): this {
        const int = BigInt(value)
        const intBits = 1n << (BigInt(size) - 1n)

        if (int < -intBits || int >= intBits) {
            throw new Error('Builder: can\'t store an Int, because its value allocates more space than provided.')
        }

        this.storeNumber(int, size)

        return this
    }

    /**
     * Store an unsigned integer in instance.
     *
     * @param {(number | bigint)} value - UInt.
     * @param {number} size - Size in bits of allocated space for value.
     *
     * @returns {this}
     */
    public storeUint (value: number | bigint, size: number): this {
        const uint = BigInt(value)

        if (uint < 0 || uint >= (1n << BigInt(size))) {
            throw new Error('Builder: can\'t store an UInt, because its value allocates more space than provided.')
        }

        this.storeNumber(uint, size)

        return this
    }

    public storeVarInt (value: number | bigint, length: number): this {
        // var_int$_ {n:#} len:(#< n) value:(int (len * 8)) = VarInteger n;

        const int = BigInt(value)
        const size = Math.ceil(Math.log2(length))
        const sizeBytes = Math.ceil((int.toString(2).length) / 8)
        const sizeBits = sizeBytes * 8

        this.checkBitsOverflow(size + sizeBits)

        return int === 0n
            ? this.storeUint(0, size)
            : this.storeUint(sizeBytes, size).storeInt(value, sizeBits)
    }

    public storeVarUint (value: number | bigint, length: number): this {
        // var_uint$_ {n:#} len:(#< n) value:(uint (len * 8)) = VarUInteger n;

        const uint = BigInt(value)
        const size = Math.ceil(Math.log2(length))
        const sizeBytes = Math.ceil((uint.toString(2).length) / 8)
        const sizeBits = sizeBytes * 8

        this.checkBitsOverflow(size + sizeBits)

        return uint === 0n
            ? this.storeUint(0, size)
            : this.storeUint(sizeBytes, size).storeUint(value, sizeBits)
    }

    /**
     * Store a bytes array in instance.
     *
     * @param {(Uint8Array | number[])} value - Array of bytes.
     * @returns {this}
     */
    public storeBytes (value: Uint8Array | number[]): this {
        this.checkBitsOverflow(value.length * 8)

        Uint8Array.from(value).forEach((byte: number) => this.storeUint(byte, 8))

        return this
    }

    /**
     * Store a string in instance.
     *
     * @param {string} value - Any string, Unicode is suppported.
     *
     * @returns {this}
     */
    public storeString (value: string): this {
        const bytes = stringToBytes(value)

        this.storeBytes(bytes)

        return this
    }

    /**
     * Store an {@link Address} in instance.
     *
     * @param {(Address | null)} address - Smart contract address as {@link Address} or as null.
     *
     * @returns {this}
     */
    public storeAddress (address: Address | null): this {
        if (address === null) {
            this.storeBits([ 0, 0 ])

            return this
        }

        const anycast = 0
        const addressBitsSize = 2 + 1 + 8 + 256

        this.checkAddressType(address)
        this.checkBitsOverflow(addressBitsSize)
        this.storeBits([ 1, 0 ])
        this.storeUint(anycast, 1)
        this.storeInt(address.workchain, 8)
        this.storeBytes(address.hash)

        return this
    }

    /**
     * Store a {@link Coins} in instance.
     *
     * @param {Coins} coins - Toncoin as {@link Coins}.
     *
     * @returns {this}
     */
    public storeCoins (coins: Coins): this {
        if (coins.isNegative()) {
            throw new Error('Builder: coins value can\'t be negative.')
        }

        const nano = BigInt(coins.toNano())

        // https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L116
        this.storeVarUint(nano, 16)

        return this
    }

    /**
     * Store a {@link HashmapE} in instance.
     *
     * @param {HashmapE} hashmap - HashmapE.
     *
     * @returns {this}
     */
    public storeDict (hashmap: HashmapE<any, any>): this {
        const slice = hashmap.cell().slice()

        this.storeSlice(slice)

        return this
    }

    /**
     * Returns this instance copy as a new instance.
     *
     * @returns {Builder}
     */
    public clone (): Builder {
        const data = new Builder(this._size)

        // Use getters to get copy of arrays
        data.storeBits(this.bits)
        this.refs.forEach(ref => data.storeRef(ref))

        return data
    }

    /**
     * Returns builded {@link Cell}.
     *
     * @param {boolean} [isExotic=false] - Build exotic {@link Cell}.
     *
     * @example
     * ```typescript
     * import { Builder } from 'ton3-core'
     *
     * const bits = [ 1, 0, 0, 1 ]
     * const cell = new Builder(bits.length)
     *     .storeBits(bits)
     *     .cell()
     * ```
     *
     * @returns {Cell}
     */
    public cell (type: CellType = CellType.Ordinary): Cell {
        // Use getters to get copies of an arrays
        const cell = new Cell({
            bits: this.bits,
            refs: this.refs,
            type
        })

        return cell
    }
}

export { Builder }
