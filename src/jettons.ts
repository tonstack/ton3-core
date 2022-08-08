import Decimal from 'decimal.js'

interface JettonsOptions {
    isNano?: boolean
    decimals?: number
}

class Jettons {
    private value: Decimal

    private decimals: number

    private multiplier: number

    /**
     * Creates an instance of {@link Jettons}
     *
     * @param {(Jettons | bigint | number | string)} value
     * @param {JettonsOptions} [options] - Jettons options to configure max decimals and if value preserved as nanojettons
     *
     * @example
     * ```ts
     * import { Jettons } from 'ton3-core'
     *
     * const jettons = new Jettons('100')
     *
     * new Jettons(coins)
     * new Jettons(BigInt('100'))
     * new Jettons(100)
     * new Jettons('100')
     * new Jettons('100000', { isNano: true, decimals: 3 })
     * ```
     */
    constructor (value: Jettons | bigint | number | string, options?: JettonsOptions) {
        const { isNano = false, decimals = 9 } = options || {}

        Jettons.checkJettonsType(value)
        Jettons.checkJettonsDecimals(decimals)

        //Decimal.set({ precision: decimals })

        this.decimals = decimals
        this.multiplier = (1 * 10) ** this.decimals
        this.value = !isNano
            ? new Decimal(value.toString()).mul(this.multiplier)
            : new Decimal(value.toString())
    }

    /**
     * Add value to instance value
     *
     * @param {(this | bigint | number | string)} value
     *
     * @example
     * ```ts
     * import { Jettons } from 'ton3-core'
     *
     * const jettons = new Jettons('10').add(9)
     *
     * console.log(jettons.toString()) // '19'
     * ```
     *
     * @return {this} - Current instance reference
     */
    public add (value: this | bigint | number | string): this {
        Jettons.checkJettonsType(value)

        const nano = new Decimal(value.toString()).mul(this.multiplier)

        this.value = this.value.add(nano)

        return this
    }

    /**
     * Subtract value from instance value
     *
     * @param {(this | bigint | number | string)} value
     *
     * @example
     * ```ts
     * import { Jettons } from 'ton3-core'
     *
     * const jettons = new Jettons('10').sub(9)
     *
     * console.log(jettons.toString()) // '1'
     * ```
     *
     * @return {this} - Current instance reference
     */
    public sub (value: this | bigint | number | string): this {
        Jettons.checkJettonsType(value)

        const nano = new Decimal(value.toString()).mul(this.multiplier)

        this.value = this.value.sub(nano)

        return this
    }

    /**
     * Multiplies instance value by value
     *
     * @param {(this | bigint | number | string)} value
     *
     * @example
     * ```ts
     * import { Jettons } from 'ton3-core'
     *
     * const jettons = new Jettons('10').mul(2)
     *
     * console.log(jettons.toString()) // '20'
     * ```
     *
     * @return {this} - Current instance reference
     */
    public mul (value: this | bigint | number | string): this {
        Jettons.checkJettonsType(value)

        const multiplier = value.toString()

        this.value = this.value.mul(multiplier)

        return this
    }

    /**
     * Divides instance value by value
     *
     * @param {(this | bigint | number | string)} value
     *
     * @example
     * ```ts
     * import { Jettons } from 'ton3-core'
     *
     * const jettons = new Jettons('10').div(2)
     *
     * console.log(jettons.toString()) // '5'
     * ```
     *
     * @return {this} - Current instance reference
     */
    public div (value: this | bigint | number | string): this {
        Jettons.checkJettonsType(value)

        const divider = new Decimal(value.toString())

        this.value = this.value.div(divider)

        return this
    }

    /**
     * Checks if instance value equal another {@link Jettons} instance value
     *
     * @example
     * ```ts
     * import { Jettons } from 'ton3-core'
     *
     * const jettons = new Jettons('10')
     * const equal = new Jettons('10')
     * const notEqual = new Jettons('11')
     *
     * console.log(equal.eq(coins), notEqual.eq(coins)) // true, false
     * ```
     *
     * @return {boolean}
     */
    public eq (value: this): boolean {
        Jettons.checkJettonsType(value)

        const nano = new Decimal(value.toNano())

        return this.value.eq(nano)
    }

    /**
     * Checks if instance value greater than another {@link Jettons} instance value
     *
     * @example
     * ```ts
     * import { Jettons } from 'ton3-core'
     *
     * const jettons = new Jettons('10')
     * const equal = new Jettons('10')
     * const greater = new Jettons('11')
     *
     * console.log(equal.gt(coins), greater.gt(coins)) // false, true
     * ```
     *
     * @return {boolean}
     */
    public gt (value: this): boolean {
        Jettons.checkJettonsType(value)

        const nano = new Decimal(value.toNano())

        return this.value.gt(nano)
    }

    /**
     * Checks if instance value greater than or equal another {@link Jettons} instance value
     *
     * @example
     * ```ts
     * import { Jettons } from 'ton3-core'
     *
     * const jettons = new Jettons('10')
     * const equal = new Jettons('10')
     * const greater = new Jettons('11')
     *
     * console.log(equal.gte(coins), greater.gte(coins)) // true, true
     * ```
     *
     * @return {boolean}
     */
    public gte (value: this): boolean {
        Jettons.checkJettonsType(value)

        const nano = new Decimal(value.toNano())

        return this.value.gte(nano)
    }

    /**
     * Checks if instance value lesser than another {@link Jettons} instance value
     *
     * @example
     * ```ts
     * import { Jettons } from 'ton3-core'
     *
     * const jettons = new Jettons('10')
     * const equal = new Jettons('10')
     * const lesser = new Jettons('9')
     *
     * console.log(equal.lt(coins), lesser.lt(coins)) // false, true
     * ```
     *
     * @return {boolean}
     */
    public lt (value: this): boolean {
        Jettons.checkJettonsType(value)

        const nano = new Decimal(value.toNano())

        return this.value.lt(nano)
    }

    /**
     * Checks if instance value lesser than or equal another {@link Jettons} instance value
     *
     * @example
     * ```ts
     * import { Jettons } from 'ton3-core'
     *
     * const jettons = new Jettons('10')
     * const equal = new Jettons('10')
     * const lesser = new Jettons('9')
     *
     * console.log(equal.lte(coins), lesser.lte(coins)) // true, true
     * ```
     *
     * @return {boolean}
     */
    public lte (value: this): boolean {
        Jettons.checkJettonsType(value)

        const nano = new Decimal(value.toNano())

        return this.value.lte(nano)
    }

    /**
     * Checks if instance value is negative
     *
     * @example
     * ```ts
     * import { Jettons } from 'ton3-core'
     *
     * const zero = new Jettons('0')
     * const negative = new Jettons('-1')
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
     * import { Jettons } from 'ton3-core'
     *
     * const zero = new Jettons('0')
     * const positive = new Jettons('1')
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
     * import { Jettons } from 'ton3-core'
     *
     * const zero = new Jettons('0')
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
     * import { Jettons } from 'ton3-core'
     *
     * const jettons = new Jettons('100')
     *
     * console.log(jettons.toString()) // '100'
     * ```
     *
     * @return {string}
     */
    public toString (): string {
        const value = this.value.div(this.multiplier).toFixed(this.decimals)
        // Remove all trailing zeroes
        const re1 = new RegExp(`\\.0{${this.decimals}}$`)
        const re2 = new RegExp('(\\.[0-9]*?[0-9])0+$')
        const jettons = value.replace(re1, '').replace(re2, '$1')

        return jettons
    }

    /**
     * Returns string representation of instance in nanojettons
     *
     * @example
     * ```ts
     * import { Jettons } from 'ton3-core'
     *
     * const jettons = new Jettons('100')
     *
     * console.log(jettons.toNano()) // '100000000000'
     * ```
     *
     * @return {string}
     */
    public toNano (): string {
        return this.value.toFixed(0)
    }

    protected static checkJettonsType (jettons: any): void {
        if (!Jettons.isValid(jettons)) {
            throw new Error('Invalid coins/jettons value')
        }

        try {
            new Decimal(jettons.toString())
        } catch (_err) {
            throw new Error('Invalid coins/jettons value')
        }
    }

    private static checkJettonsDecimals (decimals: number): void {
        if (decimals < 0 || decimals > 18) {
            throw new Error('Invalid decimals value, must be 0-18')
        }
    }

    private static isValid (jettons: any): boolean {
        return jettons instanceof Jettons
            || typeof jettons === 'string'
            || typeof jettons === 'number'
            || typeof jettons === 'bigint'
    }

    /**
     * Creates instance of Jettons from value in nano
     *
     * @static
     * @param {(bigint | number | string)} value - Value in nanojettons
     * @param {number} [decimals=9] - Decimals after comma
     *
     * @example
     * ```ts
     * import { Jettons } from 'ton3-core'
     *
     * const jettons = Jettons.fromNano('100000000000', 9)
     *
     * console.log(jettons.toString()) // 100 coins
     * ```
     *
     * @return {Jettons}
     */
    public static fromNano (value: bigint | number | string, decimals: number = 9): Jettons {
        Jettons.checkJettonsType(value)
        Jettons.checkJettonsDecimals(decimals)

        return new Jettons(value, { isNano: true, decimals })
    }
}

export {
    Jettons,
    JettonsOptions
}
