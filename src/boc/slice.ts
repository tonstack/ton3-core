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

    /**
     * Skip bits from {@link Slice}
     *
     * @param {number} size - Total bits should be skipped
     *
     * @example
     * ```ts
     * import { Builder, Slice } from '@tonstack/tontools'
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
     * import { Builder, Slice } from '@tonstack/tontools'
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
     * import { Builder, Slice } from '@tonstack/tontools'
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
     * import { Builder, Slice } from '@tonstack/tontools'
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
     * import { Builder, Slice } from '@tonstack/tontools'
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
        const uint = this.loadUint(size)
        const int = 1 << (size - 1)

        return uint >= int ? (uint - (int * 2)) : uint
    }

    /**
     * Same as .loadInt() but will not mutate {@link Slice}
     *
     * @return {number}
     */
    public preloadInt (size: number): number {
        const uint = this.preloadUint(size)
        const int = 1 << (size - 1)

        return uint >= int ? (uint - (int * 2)) : uint
    }

    /**
     * Read uint from {@link Slice}
     *
     * @param {number} size - Total bits should be readed to represent requested value
     *
     * @example
     * ```ts
     * import { Builder, Slice } from '@tonstack/tontools'
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

        return bits.reverse().reduce((acc, bit, i) => (bit * (2 ** i) + acc), 0)
    }

    /**
     * Same as .loadUint() but will not mutate {@link Slice}
     *
     * @return {number}
     */
    public preloadUint (size: number): number {
        const bits = this.preloadBits(size)

        return bits.reverse().reduce((acc, bit, i) => (bit * (2 ** i) + acc), 0)
    }

    /**
     * Read bytes from {@link Slice}
     *
     * @example
     * ```ts
     * import { Builder, Slice } from '@tonstack/tontools'
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
     * import { Builder, Slice } from '@tonstack/tontools'
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
     * import { Builder, Address, Slice } from '@tonstack/tontools'
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
     * import { Builder, Coins, Slice } from '@tonstack/tontools'
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
        const length = this.preloadUint(4)

        if (length === 0) {
            return this.skip(4) && new Coins(0)
        }

        const size = 4 + (length * 8)
        const bits = this.preloadBits(size)
        const hex = `0x${bitsToHex(bits.splice(4))}`

        return this.skip(size) && new Coins(hex, true)
    }

    /**
     * Same as .loadCoins() but will not mutate {@link Slice}
     *
     * @return {Coins}
     */
    public preloadCoins (): Coins {
        const length = this.preloadUint(4)

        if (length === 0) {
            return new Coins(0)
        }

        const size = 4 + (length * 8)
        const bits = this.preloadBits(size)
        const hex = `0x${bitsToHex(bits.splice(4))}`

        return new Coins(hex, true)
    }

    /**
     * Read {@link HashmapE} as {@link Cell} from {@link Slice}
     *
     * @example
     * ```ts
     * import { Builder, Slice, HashmapE } from '@tonstack/tontools'
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
     * import { Builder, Slice } from '@tonstack/tontools'
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
