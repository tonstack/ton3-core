import Decimal from 'decimal.js'

interface CoinsOptions {
    isNano?: boolean
    decimals?: number
}

/**
 * Coins/Jettons
 *
 * @class Address
 */
class Coins {
    private value: Decimal

    private decimals: number

    private multiplier: number

    /**
     * Creates an instance of {@link Coins}
     *
     * @param {(Coins | bigint | number | string)} value
     * @param {CoinsOptions} [options] - Coins options to configure decimals after comma (0-18) and if value preserved as nanocoins
     *
     * 
     * @example
     * ```ts
     * import { Coins } from 'ton3-core'
     *
     * const coins = new Coins('100')
     *
     * new Coins(coins)
     * new Coins(BigInt('100'))
     * new Coins(100)
     * new Coins('100')
     * new Coins('100000', { isNano: true, decimals: 3 })
     * ```
     */
    constructor (value: Coins | bigint | number | string, options?: CoinsOptions) {
        const { isNano = false, decimals = 9 } = options || {}

        Coins.checkCoinsType(value)
        Coins.checkCoinsDecimals(decimals)

        const decimal = new Decimal(value.toString())

        if (decimal.dp() > decimals) {
            throw new Error(`Invalid Coins value, decimals places "${decimal.dp()}" can't be greater than selected "${decimals}"`)
        }

        this.decimals = decimals
        this.multiplier = (1 * 10) ** this.decimals
        this.value = !isNano
            ? decimal.mul(this.multiplier)
            : decimal
    }

    /**
     * Add value to instance value
     *
     * @param {Coins} coins
     *
     * @example
     * ```ts
     * import { Coins } from 'ton3-core'
     *
     * const coinsA = new Coins('10')
     * const coinsB = new Coins('9')
     * 
     * coinsA.add(coinsB)
     *
     * console.log(coinsA.toString()) // '19'
     * ```
     *
     * @return {this} - Current instance reference
     */
    public add (coins: Coins): this {
        Coins.checkCoins(coins)
        Coins.compareCoinsDecimals(this, coins)

        this.value = this.value.add(coins.value)

        return this
    }

    /**
     * Subtract value from instance value
     *
     * @param {Coins} coins
     *
     * @example
     * ```ts
     * import { Coins } from 'ton3-core'
     *
     * const coinsA = new Coins('10')
     * const coinsB = new Coins('9')
     * 
     * coinsA.sub(coinsB)
     *
     * console.log(coinsA.toString()) // '1'
     * ```
     *
     * @return {this} - Current instance reference
     */
    public sub (coins: Coins): this {
        Coins.checkCoins(coins)
        Coins.compareCoinsDecimals(this, coins)

        this.value = this.value.sub(coins.value)

        return this
    }

    /**
     * Multiplies instance value by value
     *
     * @param {(bigint | number | string)} value
     *
     * @example
     * ```ts
     * import { Coins } from 'ton3-core'
     *
     * const coins = new Coins('10').mul(2)
     *
     * console.log(coins.toString()) // '20'
     * ```
     *
     * @return {this} - Current instance reference
     */
    public mul (value: bigint | number | string): this {
        Coins.checkValue(value)
        Coins.checkConvertability(value)

        const multiplier = value.toString()

        this.value = this.value.mul(multiplier)

        return this
    }

    /**
     * Divides instance value by value
     *
     * @param {(bigint | number | string)} value
     *
     * @example
     * ```ts
     * import { Coins } from 'ton3-core'
     *
     * const coins = new Coins('10').div(2)
     *
     * console.log(coins.toString()) // '5'
     * ```
     *
     * @return {this} - Current instance reference
     */
    public div (value: bigint | number | string): this {
        Coins.checkValue(value)
        Coins.checkConvertability(value)

        const divider = value.toString()

        this.value = this.value.div(divider)

        return this
    }

    /**
     * Checks if instance value equal another {@link Coins} instance value
     * 
     * @param {Coins} coins
     *
     * @example
     * ```ts
     * import { Coins } from 'ton3-core'
     *
     * const coins = new Coins('10')
     * const equal = new Coins('10')
     * const notEqual = new Coins('11')
     *
     * console.log(equal.eq(coins), notEqual.eq(coins)) // true, false
     * ```
     *
     * @return {boolean}
     */
    public eq (coins: Coins): boolean {
        Coins.checkCoins(coins)
        Coins.compareCoinsDecimals(this, coins)

        return this.value.eq(coins.value)
    }

    /**
     * Checks if instance value greater than another {@link Coins} instance value
     * 
     * @param {Coins} coins
     *
     * @example
     * ```ts
     * import { Coins } from 'ton3-core'
     *
     * const coins = new Coins('10')
     * const equal = new Coins('10')
     * const greater = new Coins('11')
     *
     * console.log(equal.gt(coins), greater.gt(coins)) // false, true
     * ```
     *
     * @return {boolean}
     */
    public gt (coins: Coins): boolean {
        Coins.checkCoins(coins)
        Coins.compareCoinsDecimals(this, coins)

        return this.value.gt(coins.value)
    }

    /**
     * Checks if instance value greater than or equal another {@link Coins} instance value
     * 
     * @param {Coins} coins
     *
     * @example
     * ```ts
     * import { Coins } from 'ton3-core'
     *
     * const coins = new Coins('10')
     * const equal = new Coins('10')
     * const greater = new Coins('11')
     *
     * console.log(equal.gte(coins), greater.gte(coins)) // true, true
     * ```
     *
     * @return {boolean}
     */
    public gte (coins: Coins): boolean {
        Coins.checkCoins(coins)
        Coins.compareCoinsDecimals(this, coins)

        return this.value.gte(coins.value)
    }

    /**
     * Checks if instance value lesser than another {@link Coins} instance value
     * 
     * @param {Coins} coins
     *
     * @example
     * ```ts
     * import { Coins } from 'ton3-core'
     *
     * const coins = new Coins('10')
     * const equal = new Coins('10')
     * const lesser = new Coins('9')
     *
     * console.log(equal.lt(coins), lesser.lt(coins)) // false, true
     * ```
     *
     * @return {boolean}
     */
    public lt (coins: Coins): boolean {
        Coins.checkCoins(coins)
        Coins.compareCoinsDecimals(this, coins)

        return this.value.lt(coins.value)
    }

    /**
     * Checks if instance value lesser than or equal another {@link Coins} instance value
     * 
     * @param {Coins} coins
     *
     * @example
     * ```ts
     * import { Coins } from 'ton3-core'
     *
     * const coins = new Coins('10')
     * const equal = new Coins('10')
     * const lesser = new Coins('9')
     *
     * console.log(equal.lte(coins), lesser.lte(coins)) // true, true
     * ```
     *
     * @return {boolean}
     */
    public lte (coins: Coins): boolean {
        Coins.checkCoins(coins)
        Coins.compareCoinsDecimals(this, coins)

        return this.value.lte(coins.value)
    }

    /**
     * Checks if instance value is negative
     *
     * @example
     * ```ts
     * import { Coins } from 'ton3-core'
     *
     * const zero = new Coins('0')
     * const negative = new Coins('-1')
     *
     * console.log(zero.isNegative(), negative.isNegative()) // false, true
     * ```
     *
     * @return {boolean}
     */
    public isNegative (): boolean {
        return this.value.isNegative()
    }

    /**
     * Checks if instance value is positive
     *
     * @example
     * ```ts
     * import { Coins } from 'ton3-core'
     *
     * const zero = new Coins('0')
     * const positive = new Coins('1')
     *
     * console.log(zero.isPositive(), positive.isPositive()) // true, true
     * ```
     *
     * @return {boolean}
     */
    public isPositive (): boolean {
        return this.value.isPositive()
    }

    /**
     * Checks if instance value equals zero
     *
     * @example
     * ```ts
     * import { Coins } from 'ton3-core'
     *
     * const zero = new Coins('0')
     *
     * console.log(zero.isZero()) // true
     * ```
     *
     * @return {boolean}
     */
    public isZero (): boolean {
        return this.value.isZero()
    }

    /**
     * Returns string representation of instance in coins
     *
     * @example
     * ```ts
     * import { Coins } from 'ton3-core'
     *
     * const coins = new Coins('100')
     *
     * console.log(coins.toString()) // '100'
     * ```
     *
     * @return {string}
     */
    public toString (): string {
        const value = this.value.div(this.multiplier).toFixed(this.decimals)
        // Remove all trailing zeroes
        const re1 = new RegExp(`\\.0{${this.decimals}}$`)
        const re2 = new RegExp('(\\.[0-9]*?[0-9])0+$')
        const coins = value.replace(re1, '').replace(re2, '$1')

        return coins
    }

    /**
     * Returns string representation of instance in nanocoins
     *
     * @example
     * ```ts
     * import { Coins } from 'ton3-core'
     *
     * const coins = new Coins('100')
     *
     * console.log(coins.toNano()) // '100000000000'
     * ```
     *
     * @return {string}
     */
    public toNano (): string {
        return this.value.toFixed(0)
    }

    private static checkCoinsType (value: any): void {
        if (Coins.isValid(value) && Coins.isConvertable(value)) return undefined
        if (Coins.isCoins(value)) return undefined

        throw new Error('Invalid Coins value')
    }

    private static checkCoinsDecimals (decimals: number): void {
        if (decimals < 0 || decimals > 18) {
            throw new Error('Invalid decimals value, must be 0-18')
        }
    }

    private static compareCoinsDecimals (a: Coins, b: Coins): void {
        if (a.decimals !== b.decimals) {
            throw new Error("Can't perform mathematical operation of Coins with different decimals")
        }
    }

    private static checkValue (value: any): void {
        if (Coins.isValid(value)) return undefined

        throw new Error('Invalid value')
    }

    private static checkCoins (value: any): void {
        if (Coins.isCoins(value)) return undefined

        throw new Error('Invalid value')
    }

    private static checkConvertability (value: any): void {
        if (Coins.isConvertable(value)) return undefined

        throw new Error('Invalid value')
    }

    private static isValid (value: any): boolean {
        return typeof value === 'string'
            || typeof value === 'number'
            || typeof value === 'bigint'
    }

    private static isCoins (value: any): boolean {
        return value instanceof Coins
    }

    private static isConvertable (value: any): boolean {
        try {
            new Decimal(value.toString())

            return true
        } catch (_err) {
            return false
        }
    }

    /**
     * Creates instance of Coins from value in nano
     *
     * @static
     * @param {(bigint | number | string)} value - Value in nanocoins
     * @param {number} [decimals=9] - Decimals after comma
     *
     * @example
     * ```ts
     * import { Coins } from 'ton3-core'
     *
     * const coins = Coins.fromNano('100000000000', 9)
     *
     * console.log(coins.toString()) // 100 coins
     * ```
     *
     * @return {Coins}
     */
    public static fromNano (value: bigint | number | string, decimals: number = 9): Coins {
        Coins.checkCoinsType(value)
        Coins.checkCoinsDecimals(decimals)

        return new Coins(value, { isNano: true, decimals })
    }
}

export {
    Coins,
    CoinsOptions
}
