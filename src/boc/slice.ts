import type { Bit } from '../types/bit'
import type { Cell } from './cell'
import { Coins } from '../coins'
import { Address } from '../address'
import {
    HashmapE,
    HashmapOptions
} from './hashmap'
import {
    bitsToHex,
    bitsToBytes,
    bytesToString
} from '../utils/helpers'
import {
    bitsToIntUint,
    bitsToBigUint,
    bitsToBigInt
} from '../utils/numbers'

/**
 * Cell Slice
 *
 * @class Slice
 */
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

    /**
     * Alias for .skipBits()
     *
     * @return {this}
     */
    public skip (size: number): this {
        return this.skipBits(size)
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
     * const slice = builder.cell().slice()
     *
     * console.log(slice.skipBits(2).loadBits(2)) // [ 1, 0 ]
     * ```
     *
     * @return {this}
     */
    public skipBits (size: number): this {
        if (this._bits.length < size) {
            throw new Error('Slice: bits overflow.')
        }

        this._bits.splice(0, size)

        return this
    }

    /**
     * Skip refs from {@link Slice}
     *
     * @param {number} size - Total refs should be skipped
     *
     * @example
     * ```ts
     * import { Builder, Slice } from 'ton3-core'
     *
     * const builder = new Builder()
     * const cell1 = new Builder().cell()
     * const cell2 = new Builder().cell()
     *
     * builder.storeRefs([ cell1, cell2 ])
     *
     * const slice = builder.cell().slice()
     *
     * console.log(slice.skipRefs(1).loadRef()) // cell2
     * ```
     *
     * @return {this}
     */
    public skipRefs (size: number): this {
        if (this._refs.length < size) {
            throw new Error('Slice: refs overflow.')
        }

        this._refs.splice(0, size)

        return this
    }

    /**
     * Skip dict from {@link Slice}
     *
     * @return {this}
     */
    public skipDict (): this {
        // if (this._bits.length === 0) {
        //     throw new Error('Slice: skip dict overflow.')
        // }

        // if (this.preloadBit() === 1 && this._refs.length === 0) {
        //     throw new Error('Slice: skip dict overflow.')
        // }

        const isEmpty = this.loadBit() === 0

        return !isEmpty
            ? this.skipRefs(1)
            : this
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
     * const slice = builder.cell().slice()
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
     * Read maybe ref from {@link Slice}
     *
     * @example
     * ```ts
     * import { Builder, Slice } from 'ton3-core'
     *
     * const builder1 = new Builder()
     * const builder2 = new Builder()
     * const ref = new Builder()
     *
     * builder1.storeBit(0)
     * 
     * builder2
     *  .storeBit(1)
     *  .storeRef(ref.cell())
     *
     * const slice1 = builder1.cell().slice()
     * const slice2 = builder2.cell().slice()
     *
     * console.log(slice1.loadMaybeRef()) // null
     * console.log(slice2.loadMaybeRef()) // Cell
     * ```
     *
     * @return {Cell | null}
     */
    public loadMaybeRef (): Cell | null {
        return this.loadBit() === 1
            ? this.loadRef()
            : null
    }

    /**
     * Same as .loadMaybeRef() but will not mutate {@link Slice}
     *
     * @return {Cell | null}
     */
    public preloadMaybeRef (): Cell | null {
        return this.preloadBit() === 1
            ? this.preloadRef()
            : null
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
     * const slice = builder.cell().slice()
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
     * const slice = builder.cell().slice()
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
     * builder.storeInt(-14, 15)
     *
     * const slice = builder.cell().slice()
     *
     * console.log(slice.loadInt(15)) // -14
     * ```
     *
     * @return {number}
     */
    public loadInt (size: number): number {
        const bits = this.loadBits(size)

        return bitsToIntUint(bits, { type: 'int' })
    }

    /**
     * Same as .loadInt() but will not mutate {@link Slice}
     *
     * @return {number}
     */
    public preloadInt (size: number): number {
        const bits = this.preloadBits(size)

        return bitsToIntUint(bits, { type: 'int' })
    }

    /**
     * Same as .loadInt() but will return {@link BigInt}
     *
     * @return {bigint}
     */
     public loadBigInt (size: number): bigint {
        const bits = this.loadBits(size)
        const { value } = bitsToBigInt(bits)

        return value
    }

    /**
     * Same as .preloadInt() but will return {@link BigInt}
     *
     * @return {bigint}
     */
    public preloadBigInt (size: number): bigint {
        const bits = this.preloadBits(size)
        const { value } = bitsToBigInt(bits)

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
     * const slice = builder.cell().slice()
     *
     * console.log(slice.loadUint(9)) // 14
     * ```
     *
     * @return {number}
     */
    public loadUint (size: number): number {
        const bits = this.loadBits(size)

        return bitsToIntUint(bits, { type: 'uint' })
    }

    /**
     * Same as .loadUint() but will not mutate {@link Slice}
     *
     * @return {number}
     */
    public preloadUint (size: number): number {
        const bits = this.preloadBits(size)

        return bitsToIntUint(bits, { type: 'uint' })
    }

    /**
     * Same as .loadUint() but will return {@link BigInt}
     *
     * @return {bigint}
     */
    public loadBigUint (size: number): bigint {
        const bits = this.loadBits(size)
        const { value } = bitsToBigUint(bits)

        return value
    }

    /**
     * Same as .preloadUint() but will return {@link BigInt}
     *
     * @return {bigint}
     */
    public preloadBigUint (size: number): bigint {
        const bits = this.preloadBits(size)
        const { value } = bitsToBigUint(bits)

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
     * const slice = builder.cell().slice()
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

        return bitsToIntUint(bits, { type: 'int' })
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
        const { value } = bitsToBigInt(bits)

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
        const { value } = bitsToBigInt(bits)

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
     * const slice = builder.cell().slice()
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

        return bitsToIntUint(bits, { type: 'uint' })
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
        const { value } = bitsToBigUint(bits)

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
        const { value } = bitsToBigUint(bits)

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
     * const slice = builder.cell().slice()
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
     * const slice = builder.cell().slice()
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
     * const slice = builder.cell().slice()
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
            // Slice 2 because we dont need flag bits
            const bits = this.loadBits(size).slice(2)
            // Anycast is currently unused
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _anycast = bits.splice(0, 1)
            const workchain = bitsToIntUint(bits.splice(0, 8), { type: 'int' })
            const hash = bitsToHex(bits.splice(0, 256))
            const raw = `${workchain}:${hash}`

            return new Address(raw)
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
            const bits = this.preloadBits(size).slice(2)
            // Splice 2 because we dont need flag bits
            // Anycast is currently unused
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _anycast = bits.splice(0, 1)
            const workchain = bitsToIntUint(bits.splice(0, 8), { type: 'int' })
            const hash = bitsToHex(bits.splice(0, 256))
            const raw = `${workchain}:${hash}`

            return new Address(raw)
        }

        throw new Error('Slice: bad address flag bits.')
    }

    /**
     * Read {@link Coins} from {@link Slice}
     * 
     * @param {number} [decimals=9] - Number of decimals after comma 
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
     * const slice = builder.cell().slice()
     *
     * console.log(slice.loadCoins().toString()) // '100'
     * ```
     *
     * @return {Coins}
     */
    public loadCoins (decimals: number = 9): Coins {
        const coins = this.loadVarBigUint(16)

        return new Coins(coins, { isNano: true, decimals })
    }

    /**
     * Same as .loadCoins() but will not mutate {@link Slice}
     *
     * @return {Coins}
     */
    public preloadCoins (decimals: number = 9): Coins {
        const coins = this.preloadVarBigUint(16)

        return new Coins(coins, { isNano: true, decimals })
    }

    /**
     * Read {@link HashmapE} from {@link Slice}
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
     * const slice = builder.cell().slice()
     * const entries = [ ...slice.loadDict() ]
     * 
     * console.log(entries) // []
     * ```
     *
     * @return {HashmapE}
     */
    public loadDict <K = Bit[], V = Cell>(keySize: number, options?: HashmapOptions<K, V>): HashmapE<K, V> {
        const dictConstructor = this.loadBit()
        const isEmpty = dictConstructor === 0

        return !isEmpty
            ? HashmapE.parse<K, V>(keySize, new Slice([ dictConstructor ], [ this.loadRef() ]), options)
            : new HashmapE<K, V>(keySize, options)
    }

    /**
     * Same as .loadDict() but will not mutate {@link Slice}
     *
     * @return {HashmapE}
     */
    public preloadDict <K = Bit[], V = Cell>(keySize: number, options?: HashmapOptions<K, V>): HashmapE<K, V> {
        const dictConstructor = this.preloadBit()
        const isEmpty = dictConstructor === 0

        return !isEmpty
            ? HashmapE.parse<K, V>(keySize, new Slice([ dictConstructor ], [ this.preloadRef() ]), options)
            : new HashmapE<K, V>(keySize, options)
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
