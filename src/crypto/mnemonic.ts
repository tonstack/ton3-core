import { MnemonicBIP39 } from './mnemonic-bip39'
import {
    normalize,
    generateSeed,
    generateSeedAsync
} from './utlis'

const TON_SALT = 'TON default seed'
const TON_ROUNDS = 100_000
const TON_KEY_LENGTH = 32

class Mnemonic extends MnemonicBIP39 {
    constructor (mnemonic: string[] = []) {
        super(mnemonic, {
            salt: TON_SALT,
            rounds: TON_ROUNDS,
            keyLength: TON_KEY_LENGTH
        })
    }

    public static generateSeed (mnemonic: string[]): Uint8Array {
        const seed = generateSeed(mnemonic, normalize(TON_SALT), TON_ROUNDS, TON_KEY_LENGTH)

        return seed.slice(0, TON_KEY_LENGTH)
    }

    public static async generateSeedAsync (mnemonic: string[]): Promise<Uint8Array> {
        const seed = await generateSeedAsync(mnemonic, normalize(TON_SALT), TON_ROUNDS, TON_KEY_LENGTH)

        return seed.slice(0, TON_KEY_LENGTH)
    }

    protected generateSalt (salt: string): string {
        return normalize(salt)
    }
}

export { Mnemonic }
