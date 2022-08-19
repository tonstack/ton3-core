import nacl from 'tweetnacl'
import { hmac } from '@noble/hashes/hmac'
import { sha512 as SHA512 } from '@noble/hashes/sha512'
import { pbkdf2, pbkdf2Async } from '@noble/hashes/pbkdf2'
import { Bit } from '../types/bit'
import { sha256 } from '../utils/hash'
import { KeyPair } from './key-pair'
import bip0039en from './bip-0039-en.json'
import {
    hexToBits,
    bytesToBits
} from '../utils/helpers'

const deriveChecksumBits = (entropy: Uint8Array): Bit[] => {
    const CS = (entropy.length * 8) / 32
    const hex = sha256(entropy)
    const bits = hexToBits(hex)

    return bits.slice(0, CS)
}

const generateKeyPair = (seed: Uint8Array): KeyPair => {
    const pair = nacl.sign.keyPair.fromSeed(seed)

    return {
        private: pair.secretKey,
        public: pair.publicKey
    }
}

const genereteWords = (): string[] => {
    const entropy = nacl.randomBytes(32)
    const checkSumBits = deriveChecksumBits(entropy)
    const entropyBits = bytesToBits(entropy)
    const fullBits = entropyBits.concat(checkSumBits)
    const chunks = fullBits.join('').match(/(.{1,11})/g)
    const words = chunks.map((chunk) => {
        const index = parseInt(chunk, 2)

        return bip0039en[index] as string
    })

    return words
}

const genereteSeed = (
    mnemonic: string[],
    salt: string,
    rounds: number,
    keyLength: number
): Uint8Array => {
    const optipns = { c: rounds, dkLen: keyLength }
    const entropy = hmac(SHA512, normalize(mnemonic.join(' ')), '')
    const bytes = pbkdf2(SHA512, entropy, salt, optipns)

    return bytes
}

const genereteSeedAsync = async (
    mnemonic: string[],
    salt: string,
    rounds: number,
    keyLength: number
): Promise<Uint8Array> => {
    const optipns = { c: rounds, dkLen: keyLength }
    const entropy = hmac(SHA512, normalize(mnemonic.join(' ')), '')
    const bytes = await pbkdf2Async(SHA512, entropy, salt, optipns)

    return bytes
}

const normalize = (value: string): string => {
    return (value || '').normalize('NFKD')
}

export {
    deriveChecksumBits,
    generateKeyPair,
    genereteWords,
    genereteSeed,
    genereteSeedAsync,
    normalize
}
