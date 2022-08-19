class Mask {
    private _value: number

    constructor (mask: number | Mask) {
        this._value = mask instanceof Mask
            ? mask.value
            : mask
    }

    public get value (): number {
        return this._value
    }

    public get level (): number {
        let mask = this._value & 7

        for (let i = 0; i <= 3; i++) {
            if (!mask) return i

            mask = mask >> 1
        }

        return 3
    }

    public get hashIndex (): number {
        return Mask.countBits(this._value)
    }

    public get hashCount (): number {
        return this.hashIndex + 1
    }

    public apply (level: number): Mask {
        return new Mask(this._value & ((1 << level) - 1))
    }

    public isSignificant (level: number): boolean {
        return level === 0 || ((this._value >> (level - 1)) % 2 !== 0)
    }

    // count binary ones
    private static countBits (n: number): number {
        n = n - ((n >> 1) & 0x55555555)
        n = (n & 0x33333333) + ((n >> 2) & 0x33333333)

        return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24
    }
}

export { Mask }
