import type { Bit } from '../types/bit'

const bitsToBigUint = (bits: Bit[]): { value: bigint, isSafe: boolean } => {
    if (!bits.length) return { value: 0n, isSafe: true }

    const value = bits
        .slice()
        .reverse()
        .reduce((acc, bit, i) => (BigInt(bit) * (2n ** BigInt(i)) + acc), 0n)

    const isSafe = value <= Number.MAX_SAFE_INTEGER

    return {
        value,
        isSafe
    }
}

const bitsToBigInt = (bits: Bit[]): { value: bigint, isSafe: boolean } => {
    if (!bits.length) return { value: 0n, isSafe: true }

    const { value: uint } = bitsToBigUint(bits)
    const size = BigInt(bits.length)
    const int = 1n << (size - 1n)
    const value = uint >= int ? (uint - (int * 2n)) : uint
    const isSafe = value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER

    return {
        value,
        isSafe
    }
}

const bitsToIntUint = (bits: Bit[], options: { type: 'int' | 'uint' }): number => {
    const { type = 'uint' } = options
    const { value, isSafe } = type === 'uint'
        ? bitsToBigUint(bits)
        : bitsToBigInt(bits)

    if (!isSafe) {
        throw new Error('loaded value does not fit max/min safe integer value, use alternative BigInt methods')
    }

    return Number(value)
}

export {
    bitsToIntUint,
    bitsToBigUint,
    bitsToBigInt
}
