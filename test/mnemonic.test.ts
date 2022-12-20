import { expect } from 'chai'
import {
    bytesToHex,
    hexToBytes
} from '../src/utils/helpers'
import {
    Mnemonic,
    MnemonicBIP39
} from '../src/crypto'

describe('Mnemonic', () => {
    const TEST_KEY_PUBLIC = '0809a4104e452d5fed62b74331082bc039ea92b2cd26393b1f082c851bf88385'
    const TEST_KEY_PRIVATE = '83491b3d8c7ef27f856049d35de11d02799f36068aee81aa9bb5f144960010500809a4104e452d5fed62b74331082bc039ea92b2cd26393b1f082c851bf88385'
    const TEST_SEED = '83491b3d8c7ef27f856049d35de11d02799f36068aee81aa9bb5f14496001050'
    const TEST_WORDS = [
        'pattern', 'gadget',  'faculty',
        'wire',    'scatter', 'method',
        'setup',   'organ',   'eternal',
        'speak',   'process', 'glare',
        'autumn',  'sad',     'phone',
        'lake',    'bomb',    'dune',
        'high',    'donate',  'october',
        'bid',     'off',     'acquire'
    ]

    describe('#constructor()', () => {
        it('should create new TON Mnemonic', () => {
            const mnemonic = new Mnemonic()

            expect(mnemonic.words.length).to.eq(24)
            expect(mnemonic.seed.length).to.eq(32)
            expect(mnemonic.keys.public.length).to.eq(32)
            expect(mnemonic.keys.private.length).to.eq(64)
        })

        it('should create new TON Mnemonic from words', () => {
            const mnemonic = new Mnemonic(TEST_WORDS)

            expect(mnemonic.words).to.equals(TEST_WORDS)
            expect(bytesToHex(mnemonic.keys.public)).to.eq(TEST_KEY_PUBLIC)
            expect(bytesToHex(mnemonic.keys.private)).to.eq(TEST_KEY_PRIVATE)
            expect(bytesToHex(mnemonic.seed)).to.eq(TEST_SEED)
        })
    })

    describe('#generateWords()', () => {
        it('should generate words', () => {
            const words = Mnemonic.generateWords()

            expect(words.length).to.eq(24)
        })
    })

    describe('#generateSeed()', () => {
        it('should generate seed', () => {
            const seed = Mnemonic.generateSeed(TEST_WORDS)

            expect(bytesToHex(seed)).to.eq(TEST_SEED)
        })
    })

    describe('#generateSeedAsync()', () => {
        it('should generate seed asynchronous', async () => {
            const seed = await Mnemonic.generateSeedAsync(TEST_WORDS)

            expect(bytesToHex(seed)).to.eq(TEST_SEED)
        })
    })

    describe('#generateKeyPair()', () => {
        it('should generate key pair', () => {
            const keyPair = Mnemonic.generateKeyPair(hexToBytes(TEST_SEED))

            expect(bytesToHex(keyPair.private)).to.eq(TEST_KEY_PRIVATE)
            expect(bytesToHex(keyPair.public)).to.eq(TEST_KEY_PUBLIC)
        })
    })
})

describe('MnemonicBIP39', () => {
    const TEST_KEY_PUBLIC = 'b6fdc113ea607a5cb08b5a3eb2af551ded9bbfd6dde04b27b5283c7a2809cc53'
    const TEST_KEY_PRIVATE = '2619ba973158720f874a7996d7627a88d2850b785d1896b6686aa5c27a8803cdb6fdc113ea607a5cb08b5a3eb2af551ded9bbfd6dde04b27b5283c7a2809cc53'
    const TEST_SEED = '2619ba973158720f874a7996d7627a88d2850b785d1896b6686aa5c27a8803cd'
    const TEST_WORDS = [
        'pattern', 'gadget',  'faculty',
        'wire',    'scatter', 'method',
        'setup',   'organ',   'eternal',
        'speak',   'process', 'glare',
        'autumn',  'sad',     'phone',
        'lake',    'bomb',    'dune',
        'high',    'donate',  'october',
        'bid',     'off',     'acquire'
    ]

    describe('#constructor()', () => {
        it('should create new BIP39 Mnemonic', () => {
            const mnemonic = new MnemonicBIP39()
    
            expect(mnemonic.words.length).to.eq(24)
            expect(mnemonic.seed.length).to.eq(32)
            expect(mnemonic.keys.public.length).to.eq(32)
            expect(mnemonic.keys.private.length).to.eq(64)
        })

        it('should create new BIP39 Mnemonic from words', () => {
            const mnemonic = new MnemonicBIP39(TEST_WORDS)

            expect(mnemonic.words).to.equals(TEST_WORDS)
            expect(bytesToHex(mnemonic.keys.public)).to.eq(TEST_KEY_PUBLIC)
            expect(bytesToHex(mnemonic.keys.private)).to.eq(TEST_KEY_PRIVATE)
            expect(bytesToHex(mnemonic.seed)).to.eq(TEST_SEED)
        })
    })

    describe('#generateWords()', () => {
        it('should generate words', () => {
            const words = MnemonicBIP39.generateWords()

            expect(words.length).to.eq(24)
        })
    })

    describe('#generateSeed()', () => {
        it('should generate seed', () => {
            const seed = MnemonicBIP39.generateSeed(TEST_WORDS)

            expect(bytesToHex(seed)).to.eq(TEST_SEED)
        })
    })

    describe('#generateSeedAsync()', () => {
        it('should generate seed asynchronous', async () => {
            const seed = await MnemonicBIP39.generateSeedAsync(TEST_WORDS)

            expect(bytesToHex(seed)).to.eq(TEST_SEED)
        })
    })

    describe('#generateKeyPair()', () => {
        it('should generate key pair', () => {
            const keyPair = MnemonicBIP39.generateKeyPair(hexToBytes(TEST_SEED))

            expect(bytesToHex(keyPair.private)).to.eq(TEST_KEY_PRIVATE)
            expect(bytesToHex(keyPair.public)).to.eq(TEST_KEY_PUBLIC)
        })
    })
})
