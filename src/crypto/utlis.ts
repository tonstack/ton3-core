import nacl from 'tweetnacl'
import { hmac } from '@noble/hashes/hmac'
import { sha512 as SHA512 } from '@noble/hashes/sha512'
import { pbkdf2 as _pbkdf2, pbkdf2Async as _pbkdf2Async } from '@noble/hashes/pbkdf2'
import type { Bit } from '../types/bit'
import { sha256 } from '../utils/hash'
import { KeyPair } from './key-pair'
import bip0039en from './bip-0039-en.json'
import {
    hexToBits,
    bytesToBits,
    stringToBytes
} from '../utils/helpers'

const getNodeSubtle = (): SubtleCrypto | null => {
    try {
        const { webcrypto } = require('node:crypto')

        return webcrypto.subtle
    } catch (err) {
        return null
    }
}

const getWebSubtle = (): SubtleCrypto | null => {
    const subtle = typeof self !== 'undefined' && self.crypto && self.crypto.subtle

    return subtle || null
}

const hmacSha512Async = async (
    mnemonic: string[],
    password = ''
): Promise<Uint8Array> => {
    const subtle = getNodeSubtle() || getWebSubtle()

    if (!subtle) {
        return hmac(SHA512, normalize(mnemonic.join(' ')), password)
    }

    const algo = { name: 'HMAC', hash: 'SHA-512' }
    const key = await subtle.importKey('raw', stringToBytes(normalize(mnemonic.join(' '))), algo, false, [ 'sign' ])
    const result = await subtle.sign(algo.name, key, stringToBytes(password))

    return new Uint8Array(result)
}

const pbkdf2Async = async (
    mnemonic: string[],
    salt: Uint8Array,
    rounds: number,
    keyLength: number
): Promise<Uint8Array> => {
    const subtle = getNodeSubtle() || getWebSubtle()
    const entropy = await hmacSha512Async(mnemonic)

    if (!subtle) {
        const optipns = { c: rounds, dkLen: keyLength }

        return await _pbkdf2Async(SHA512, entropy, salt, optipns)
    }

    const key = await subtle.importKey('raw', entropy, { name: 'PBKDF2' }, false, [ 'deriveBits' ])
    const bytes = await subtle.deriveBits({
        name: 'PBKDF2',
        hash: 'SHA-512',
        salt,
        iterations: rounds
    }, key, keyLength * 8)

    return new Uint8Array(bytes)
}

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
    const bytes = _pbkdf2(SHA512, entropy, salt, optipns)

    return bytes
}

const genereteSeedAsync = async (
    mnemonic: string[],
    salt: string,
    rounds: number,
    keyLength: number
): Promise<Uint8Array> => {
    const bytes = await pbkdf2Async(mnemonic, stringToBytes(salt), rounds, keyLength)

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
