import { Bit } from '../types/bit'
import { Cell } from './cell'
import { Coins } from '../coins'
import { Address } from '../address'
import {
    bitsToHex,
    bitsToInt8,
    bitsToBytes,
    bytesToString
} from '../utils/helpers'

class Slice {
    private _bits: Bit[]

    private _refs: Cell[]

    private constructor (bits: Bit[], refs: Cell[]) {
        this._bits = bits
        this._refs = refs
    }

    public get bits (): Bit[] {
        return Array.from(this._bits)
    }

    public get refs (): Cell[] {
        return Array.from(this._refs)
    }

    private static bitsToBigUint (bits: Bit[]): { value: bigint, isSafe: boolean } {
        if (!bits.length) return { value: 0n, isSafe: true }

        const value = bits
            .reverse()
            .reduce((acc, bit, i) => (BigInt(bit) * (2n ** BigInt(i)) + acc), 0n)

        const isSafe = value <= Number.MAX_SAFE_INTEGER

        return {
            value,
            isSafe
        }
    }

    private static bitsToBigInt (bits: Bit[]): { value: bigint, isSafe: boolean } {
        if (!bits.length) return { value: 0n, isSafe: true }

        const { value: uint } = Slice.bitsToBigUint(bits)
        const size = BigInt(bits.length)
        const int = 1n << (size - 1n)
        const value = uint >= int ? (uint - (int * 2n)) : uint
        const isSafe = value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER

        return {
            value,
            isSafe
        }
    }

    private static bitsToIntUint (
        bits: Bit[],
        options: {
            type: 'int' | 'uint'
        }
    ): number {
        const { type = 'uint' } = options
        const { value, isSafe } = type === 'uint'
            ? Slice.bitsToBigUint(bits)
            : Slice.bitsToBigInt(bits)

        if (!isSafe) {
            throw new Error('Slice: loaded value does not fit max/min safe integer value, use alternative BigInt methods.')
        }

        return Number(value)
    }

    /**
     * Skip bits from {@link Slice}
     *
     * @param {number} size - Total bits should be skipped
     *
     * @example
     * ```ts
     * import { Builder, Slice } from 'ton3-core'
     *
     * const builder = new Builder()
     *
     * builder.storeBits([ 0, 1, 1, 0 ])
     *
     * const slice = Slice.parse(builder.cell())
     *
     * console.log(slice.skip(2).loadBits(2)) // [ 1, 0 ]
     * ```
     *
     * @return {this}
     */
    public skip (size: number): Slice {
        if (this._bits.length < size) {
            throw new Error('Slice: skip bits overflow.')
        }

        this._bits.splice(0, size)

        return this
    }

    /**
     * Same as .loadDict() but will return instance of {@link Slice} with unloaded dict
     *
     * @return {this}
     */
    public skipDict (): this {
        this.loadDict()

        return this
    }

    /**
     * Read ref from {@link Slice}
     *
     * @example
     * ```ts
     * import { Builder, Slice } from 'ton3-core'
     *
     * const builder = new Builder()
     * const ref = new Builder()
     *
     * builder.storeRef(ref.cell())
     *
     * const slice = Slice.parse(builder.cell())
     *
     * console.log(slice.loadRef()) // Cell
     * ```
     *
     * @return {Cell}
     */
    public loadRef (): Cell {
        if (!this._refs.length) {
            throw new Error('Slice: refs overflow.')
        }

        return this._refs.shift()
    }

    /**
     * Same as .loadRef() but will not mutate {@link Slice}
     *
     * @return {Cell}
     */
    public preloadRef (): Cell {
        if (!this._refs.length) {
            throw new Error('Slice: refs overflow.')
        }

        return this._refs[0]
    }

    /**
     * Read bit from {@link Slice}
     *
     * @example
     * ```ts
     * import { Builder, Slice } from 'ton3-core'
     *
     * const builder = new Builder()
     *
     * builder.storeBit(1)
     *
     * const slice = Slice.parse(builder.cell())
     *
     * console.log(slice.loadBit()) // 1
     * ```
     *
     * @return {Bit[]}
     */
    public loadBit (): Bit {
        if (!this._bits.length) {
            throw new Error('Slice: bits overflow.')
        }

        return this._bits.shift()
    }

    /**
     * Same as .loadBit() but will not mutate {@link Slice}
     *
     * @return {Bit}
     */
    public preloadBit (): Bit {
        if (!this._bits.length) {
            throw new Error('Slice: bits overflow.')
        }

        return this._bits[0]
    }

    /**
     * Read bits from {@link Slice}
     *
     * @param {number} size - Total bits should be readed to represent requested value
     *
     * @example
     * ```ts
     * import { Builder, Slice } from 'ton3-core'
     *
     * const builder = new Builder()
     *
     * builder.storeBits([ 0, 1 ])
     *
     * const slice = Slice.parse(builder.cell())
     *
     * console.log(slice.loadBits(2)) // [ 0, 1 ]
     * ```
     *
     * @return {Bit[]}
     */
    public loadBits (size: number): Bit[] {
        if (size < 0 || this._bits.length < size) {
            throw new Error('Slice: bits overflow.')
        }

        return this._bits.splice(0, size)
    }

    /**
     * Same as .loadBits() but will not mutate {@link Slice}
     *
     * @return {Bit[]}
     */
    public preloadBits (size: number): Bit[] {
        if (size < 0 || this._bits.length < size) {
            throw new Error('Slice: bits overflow.')
        }

        return this._bits.slice(0, size)
    }

    /**
     * Read int from {@link Slice}
     *
     * @param {number} size - Total bits should be readed to represent requested value
     *
     * @example
     * ```ts
     * import { Builder, Slice } from 'ton3-core'
     *
     * const builder = new Builder()
     *
     * builder.storeUint(-14, 15)
     *
     * const slice = Slice.parse(builder.cell())
     *
     * console.log(slice.loadUint(15)) // -14
     * ```
     *
     * @return {number}
     */
    public loadInt (size: number): number {
        const bits = this.loadBits(size)

        return Slice.bitsToIntUint(bits, { type: 'int' })
    }

    /**
     * Same as .loadInt() but will not mutate {@link Slice}
     *
     * @return {number}
     */
    public preloadInt (size: number): number {
        const bits = this.preloadBits(size)

        return Slice.bitsToIntUint(bits, { type: 'int' })
    }

    /**
     * Same as .loadInt() but will return {@link BigInt}
     *
     * @return {bigint}
     */
     public loadBigInt (size: number): bigint {
        const bits = this.loadBits(size)
        const { value } = Slice.bitsToBigInt(bits)

        return value
    }

    /**
     * Same as .preloadInt() but will return {@link BigInt}
     *
     * @return {bigint}
     */
    public preloadBigInt (size: number): bigint {
        const bits = this.preloadBits(size)
        const { value } = Slice.bitsToBigInt(bits)

        return value
    }

    /**
     * Read uint from {@link Slice}
     *
     * @param {number} size - Total bits should be readed to represent requested value
     *
     * @example
     * ```ts
     * import { Builder, Slice } from 'ton3-core'
     *
     * const builder = new Builder()
     *
     * builder.storeUint(14, 9)
     *
     * const slice = Slice.parse(builder.cell())
     *
     * console.log(slice.loadUint(9)) // 14
     * ```
     *
     * @return {number}
     */
    public loadUint (size: number): number {
        const bits = this.loadBits(size)

        return Slice.bitsToIntUint(bits, { type: 'uint' })
    }

    /**
     * Same as .loadUint() but will not mutate {@link Slice}
     *
     * @return {number}
     */
    public preloadUint (size: number): number {
        const bits = this.preloadBits(size)

        return Slice.bitsToIntUint(bits, { type: 'uint' })
    }

    /**
     * Same as .loadUint() but will return {@link BigInt}
     *
     * @return {bigint}
     */
    public loadBigUint (size: number): bigint {
        const bits = this.loadBits(size)
        const { value } = Slice.bitsToBigUint(bits)

        return value
    }

    /**
     * Same as .preloadUint() but will return {@link BigInt}
     *
     * @return {bigint}
     */
    public preloadBigUint (size: number): bigint {
        const bits = this.preloadBits(size)
        const { value } = Slice.bitsToBigUint(bits)

        return value
    }

    /**
     * Read variable int from {@link Slice}
     *
     * @param {number} length - Maximum possible number of bits used to store value??
     *
     * @example
     * ```ts
     * import { Builder, Slice } from 'ton3-core'
     *
     * const builder = new Builder()
     *
     * builder.storeVarInt(-101101, 16)
     *
     * const slice = Slice.parse(builder.cell())
     *
     * console.log(slice.loadVarInt(16)) // -101101
     * ```
     *
     * @return {number}
     */
    public loadVarInt (length: number): number {
        const size = Math.ceil(Math.log2(length))
        const sizeBytes = this.loadUint(size)
        const sizeBits = sizeBytes * 8

        return this.loadInt(sizeBits)
    }

    /**
     * Same as .loadVarInt() but will not mutate {@link Slice}
     *
     * @return {number}
     */
    public preloadVarInt (length: number): number {
        const size = Math.ceil(Math.log2(length))
        const sizeBytes = this.preloadUint(size)
        const sizeBits = sizeBytes * 8
        const bits = this.preloadBits(size + sizeBits).slice(size)

        return Slice.bitsToIntUint(bits, { type: 'int' })
    }

    /**
     * Same as .loadVarInt() but will return {@link BigInt}
     *
     * @return {bigint}
     */
     public loadVarBigInt (length: number): bigint {
        const size = Math.ceil(Math.log2(length))
        const sizeBytes = this.loadUint(size)
        const sizeBits = sizeBytes * 8
        const bits = this.loadBits(sizeBits)
        const { value } = Slice.bitsToBigInt(bits)

        return value
    }

    /**
     * Same as .preloadVarInt() but will return {@link BigInt}
     *
     * @return {bigint}
     */
    public preloadVarBigInt (length: number): bigint {
        const size = Math.ceil(Math.log2(length))
        const sizeBytes = this.preloadUint(size)
        const sizeBits = sizeBytes * 8
        const bits = this.preloadBits(size + sizeBits).slice(size)
        const { value } = Slice.bitsToBigInt(bits)

        return value
    }

    /**
     * Read variable uint from {@link Slice}
     *
     * @param {number} length - Maximum possible number of bits used to store value??
     *
     * @example
     * ```ts
     * import { Builder, Slice } from 'ton3-core'
     *
     * const builder = new Builder()
     *
     * builder.storeVarUint(101101, 16)
     *
     * const slice = Slice.parse(builder.cell())
     *
     * console.log(slice.loadVarUint(16)) // 101101
     * ```
     *
     * @return {number}
     */
    public loadVarUint (length: number): number {
        const size = Math.ceil(Math.log2(length))
        const sizeBytes = this.loadUint(size)
        const sizeBits = sizeBytes * 8

        return this.loadUint(sizeBits)
    }

    /**
     * Same as .loadVarUint() but will not mutate {@link Slice}
     *
     * @return {number}
     */
    public preloadVarUint (length: number): number {
        const size = Math.ceil(Math.log2(length))
        const sizeBytes = this.preloadUint(size)
        const sizeBits = sizeBytes * 8
        const bits = this.preloadBits(size + sizeBits).slice(size)

        return Slice.bitsToIntUint(bits, { type: 'uint' })
    }

    /**
     * Same as .loadVarUint() but will return {@link BigInt}
     *
     * @return {bigint}
     */
     public loadVarBigUint (length: number): bigint {
        const size = Math.ceil(Math.log2(length))
        const sizeBytes = this.loadUint(size)
        const sizeBits = sizeBytes * 8
        const bits = this.loadBits(sizeBits)
        const { value } = Slice.bitsToBigUint(bits)

        return value
    }

    /**
     * Same as .preloadVarUint() but will return {@link BigInt}
     *
     * @return {bigint}
     */
    public preloadVarBigUint (length: number): bigint {
        const size = Math.ceil(Math.log2(length))
        const sizeBytes = this.preloadUint(size)
        const sizeBits = sizeBytes * 8
        const bits = this.preloadBits(size + sizeBits).slice(size)
        const { value } = Slice.bitsToBigUint(bits)

        return value
    }

    /**
     * Read bytes from {@link Slice}
     *
     * @example
     * ```ts
     * import { Builder, Slice } from 'ton3-core'
     *
     * const builder = new Builder()
     *
     * builder.storeBytes(new Uint8Array([ 255, 255 ]))
     *
     * const slice = Slice.parse(builder.cell())
     *
     * console.log(slice.loadBytes(16)) // [ 255, 255 ]
     * ```
     *
     * @return {Uint8Array}
     */
    public loadBytes (size: number): Uint8Array {
        const bits = this.loadBits(size)

        return bitsToBytes(bits)
    }

    /**
     * Same as .loadBytes() but will not mutate {@link Slice}
     *
     * @return {Uint8Array}
     */
    public preloadBytes (size: number): Uint8Array {
        const bits = this.preloadBits(size)

        return bitsToBytes(bits)
    }

    /**
     * Read string from {@link Slice}
     *
     * @param {number} [size=null] - Total bits should be readed to represent requested value
     *
     * @example
     * ```ts
     * import { Builder, Slice } from 'ton3-core'
     *
     * const builder = new Builder()
     *
     * builder.storeString('Привет, мир!')
     *
     * const slice = Slice.parse(builder.cell())
     *
     * console.log(slice.loadString()) // 'Привет, мир!'
     * ```
     *
     * @return {string}
     */
    public loadString (size: number = null): string {
        const bytes = size === null
            ? this.loadBytes(this._bits.length)
            : this.loadBytes(size)

        return bytesToString(bytes)
    }

    /**
     * Same as .loadString() but will not mutate {@link Slice}
     *
     * @return {string}
     */
    public preloadString (size: number = null): string {
        const bytes = size === null
            ? this.preloadBytes(this._bits.length)
            : this.preloadBytes(size)

        return bytesToString(bytes)
    }

    /**
     * Read {@link Address} from {@link Slice}
     *
     * @example
     * ```ts
     * import { Builder, Address, Slice } from 'ton3-core'
     *
     * const builder = new Builder()
     * const address = new Address('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')
     *
     * builder.storeAddress(address)
     *
     * const slice = Slice.parse(builder.cell())
     *
     * console.log(slice.loadAddress().toString())
     * // 'kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny'
     * ```
     *
     * @return {Address}
     */
    public loadAddress (): Address | null {
        const FLAG_ADDRESS_NO = [ 0, 0 ]
        const FLAG_ADDRESS = [ 1, 0 ]
        const flag = this.preloadBits(2)

        if (flag.every((bit, i) => bit === FLAG_ADDRESS_NO[i])) {
            return this.skip(2) && Address.NONE
        }

        if (flag.every((bit, i) => bit === FLAG_ADDRESS[i])) {
            // 2 bits flag, 1 bit anycast, 8 bits workchain, 256 bits address hash
            const size = 2 + 1 + 8 + 256
            const bits = this.preloadBits(size)
            // Splice 2 because we dont need flag bits
            // Anycast is currently unused
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const anycast = bits.splice(2, 1)
            const workchain = bitsToInt8(bits.splice(2, 8))
            const hash = bitsToHex(bits.splice(2, 256))
            const raw = `${workchain}:${hash}`

            return this.skip(size) && new Address(raw)
        }

        throw new Error('Slice: bad address flag bits.')
    }

    /**
     * Same as .loadAddress() but will not mutate {@link Slice}
     *
     * @return {Address}
     */
    public preloadAddress (): Address {
        const FLAG_ADDRESS_NO = [ 0, 0 ]
        const FLAG_ADDRESS = [ 1, 0 ]
        const flag = this.preloadBits(2)

        if (flag.every((bit, i) => bit === FLAG_ADDRESS_NO[i])) {
            return Address.NONE
        }

        if (flag.every((bit, i) => bit === FLAG_ADDRESS[i])) {
            // 2 bits flag, 1 bit anycast, 8 bits workchain, 256 bits address hash
            const size = 2 + 1 + 8 + 256
            const bits = this.preloadBits(size)
            // Splice 2 because we dont need flag bits
            // Anycast is currently unused
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const anycast = bits.splice(2, 1)
            const workchain = bitsToInt8(bits.splice(2, 8))
            const hash = bitsToHex(bits.splice(2, 256))
            const raw = `${workchain}:${hash}`

            return new Address(raw)
        }

        throw new Error('Slice: bad address flag bits.')
    }

    /**
     * Read {@link Coins} from {@link Slice}
     *
     * @example
     * ```ts
     * import { Builder, Coins, Slice } from 'ton3-core'
     *
     * const builder = new Builder()
     * const coins = new Coins('100')
     *
     * builder.storeCoins(coins)
     *
     * const slice = Slice.parse(builder.cell())
     *
     * console.log(slice.loadCoins().toString()) // '100'
     * ```
     *
     * @return {Coins}
     */
    public loadCoins (): Coins {
        const coins = this.loadVarUint(16)

        return new Coins(coins, true)
    }

    /**
     * Same as .loadCoins() but will not mutate {@link Slice}
     *
     * @return {Coins}
     */
    public preloadCoins (): Coins {
        const coins = this.preloadVarUint(16)

        return new Coins(coins, true)
    }

    /**
     * Read {@link HashmapE} as {@link Cell} from {@link Slice}
     *
     * @example
     * ```ts
     * import { Builder, Slice, HashmapE } from 'ton3-core'
     *
     * const builder = new Builder()
     * const dict = new HashmapE(16)
     *
     * builder.storeDict(dict)
     *
     * const slice = Slice.parse(builder.cell())
     * const cell = slice.loadDict()
     * ```
     *
     * @return {Cell}
     */
    public loadDict (): Cell {
        const isEmpty = this.preloadBit() === 0

        if (isEmpty) {
            this.skip(1)

            return null
        }

        return new Cell([ this.loadBit() ], [ this.loadRef() ], false)
    }

    /**
     * Same as .loadDict() but will not mutate {@link Slice}
     *
     * @return {Cell}
     */
    public preloadDict (): Cell {
        const isEmpty = this.preloadBit() === 0

        if (isEmpty) {
            return null
        }

        return new Cell([ this.preloadBit() ], [ this.preloadRef() ], false)
    }

    /**
     * Creates new {@link Slice} from {@link Cell}
     *
     * @example
     * ```ts
     * import { Builder, Slice } from 'ton3-core'
     *
     * const builder = new Builder()
     * const cell = builder.cell()
     * const slice = Slice.parse(cell)
     * ```
     *
     * @return {Coins}
     */
    public static parse (cell: Cell): Slice {
        return new Slice(cell.bits, cell.refs)
    }
}

export { Slice }
