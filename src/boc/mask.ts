class Mask {
    private _value: number

    private _hashIndex: number

    private _hashCount: number

    constructor (mask: number | Mask) {
        this._value = mask instanceof Mask
            ? mask.value
            : mask

        this._hashIndex = Mask.countSetBits(this._value)
        this._hashCount = this._hashIndex + 1
    }

    public get value (): number {
        return this._value
    }

    public get level (): number {
        return 32 - Math.clz32(this._value)
    }

    public get hashIndex (): number {
        return this._hashIndex
    }

    public get hashCount (): number {
        return this._hashCount
    }

    public isSignificant (level: number): boolean {
        const result = level === 0 || (this._value >> (level - 1)) % 2 !== 0

        return result
    }

    public apply (level: number): Mask {
        return new Mask(this._value & ((1 << level) - 1))
    }

    // count binary ones
    private static countSetBits (n: number): number {
        n = n - ((n >> 1) & 0x55555555)
        n = (n & 0x33333333) + ((n >> 2) & 0x33333333)

        return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24
    }
}

export { Mask }
