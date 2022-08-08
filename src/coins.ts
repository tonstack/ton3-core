import { Jettons } from './jettons'

class Coins extends Jettons {
    /**
     * Creates an instance of {@link Coins}
     *
     * @param {(Coins | bigint | number | string)} value
     * @param {boolean} [isNano=false] - Is argument value represented in nanocoins
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
     * ```
     */
    constructor (value: Coins | bigint | number | string, isNano: boolean = false) {
        super(value, { isNano, decimals: 9 })
    }

    /**
     * Creates instance of Coins from value in nano
     *
     * @static
     * @param {(bigint | number | string)} value - Value in nanocoins
     *
     * @example
     * ```ts
     * import { Coins } from 'ton3-core'
     *
     * const coins = Coins.fromNano('100000000000')
     *
     * console.log(coins.toString()) // 100 coins
     * ```
     *
     * @return {Coins}
     */
    public static fromNano (value: bigint | number | string): Coins {
        Coins.checkJettonsType(value)

        return new Coins(value, true)
    }
}

export { Coins }
