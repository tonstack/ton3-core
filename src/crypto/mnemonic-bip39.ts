import bip0039en from './bip-0039-en.json'
import { KeyPair } from './key-pair'
import {
    normalize,
    generateSeed,
    generateSeedAsync,
    generateWords,
    generateKeyPair
} from './utlis'

interface MnemonicOptions {
    salt?: string
    rounds?: number
    keyLength?: number
}

class MnemonicBIP39 {
    private _words: string[]

    private _seed: Uint8Array

    private _keys: KeyPair

    constructor (mnemonic: string[] = [], options?: MnemonicOptions) {
        if (mnemonic.length && mnemonic.length !== 24) {
            throw new Error('Mnemonic: must contain 24 bip39 words.')
        }

        if (mnemonic.length && !mnemonic.every(word => bip0039en.includes(word))) {
            throw new Error('Mnemonic: invalid mnemonic phrase words.')
        }

        // According to BIP39 by default
        const {
            salt = '',
            rounds = 2048,
            keyLength = 64
        } = options || {}

        const words = mnemonic.length ? mnemonic : generateWords()
        const seed = generateSeed(words, this.generateSalt(salt), rounds, keyLength).slice(0, 32)
        const keys = generateKeyPair(seed)

        this._words = words
        this._seed = seed
        this._keys = keys
    }

    public get words (): string[] {
        return this._words
    }

    public get seed (): Uint8Array {
        return this._seed
    }

    public get keys (): KeyPair {
        return this._keys
    }

    public static generateWords (): string[] {
        return generateWords()
    }

    public static generateKeyPair (seed: Uint8Array): KeyPair {
        return generateKeyPair(seed)
    }

    public static generateSeed (
        mnemonic: string[],
        salt = null,
        rounds = 2048,
        keyLength = 64
    ): Uint8Array {
        const _salt = 'mnemonic' + (salt !== null ? normalize(salt) : '')
        const seed = generateSeed(mnemonic, _salt, rounds, keyLength)

        return seed.slice(0, 32)
    }

    public static async generateSeedAsync (
        mnemonic: string[],
        salt = null,
        rounds = 2048,
        keyLength = 64
    ): Promise<Uint8Array> {
        const _salt = 'mnemonic' + (salt !== null ? normalize(salt) : '')
        const seed = await generateSeedAsync(mnemonic, _salt, rounds, keyLength)

        return seed.slice(0, 32)
    }

    protected generateSalt (salt: string = null): string {
        return 'mnemonic' + (salt !== null ? normalize(salt) : '')
    }
}

export {
    MnemonicBIP39,
    MnemonicOptions
}
