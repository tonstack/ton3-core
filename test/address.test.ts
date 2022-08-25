import { expect } from 'chai'
import { Address } from '../src/address'
import {
    hexToBytes,
    bytesCompare
} from '../src/utils/helpers'

describe('Address', () => {
    const TEST_HASH_1 = hexToBytes('3333333333333333333333333333333333333333333333333333333333333333')
    const TEST_HASH_2 = hexToBytes('83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8')
    const TEST_HASH_3 = hexToBytes('dd24c4a1f2b88f8b7053513b5cc6c5a31bc44b2a72dcb4d8c0338af0f0d37ec5')

    const TEST_ADDRESS_1 = new Address('-1:3333333333333333333333333333333333333333333333333333333333333333')
    const TEST_ADDRESS_2 = new Address('0:83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8')
    const TEST_ADDRESS_3 = new Address('-1:dd24c4a1f2b88f8b7053513b5cc6c5a31bc44b2a72dcb4d8c0338af0f0d37ec5')
    const TEST_ADDRESS_4 = new Address('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')

    describe('#constructor()', () => {
        it('should create Address from another Address', () => {
            const raw = '0:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260'
            const address1 = new Address(raw)
            const address2 = new Address(address1)
            const result = address2.toString('raw')

            expect(result).to.equal(raw)
        })

        it('should create Address from non url-safe base64', () => {
            const base64unsafe = 'kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny'
            const address1 = new Address(base64unsafe)
            const result = address1.toString('base64', { urlSafe: false })

            const addressBounceable1 = new Address('Ef/dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN+xWdr')
            const addressNonBounceable1 = new Address('Uf/dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN+xTqu')

            expect(result).to.equal(base64unsafe)

            expect(bytesCompare(addressBounceable1.hash, TEST_HASH_3)).to.equal(true)
            expect(bytesCompare(addressNonBounceable1.hash, TEST_HASH_3)).to.equal(true)
            expect(addressBounceable1.workchain).to.equal(-1)
            expect(addressNonBounceable1.workchain).to.equal(-1)
        })

        it('should create Address from url-safe base64', () => {
            const base64 = 'kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny'
            const address1 = new Address(base64)
            const result = address1.toString('base64', { urlSafe: true })

            const addressBounceable1 = new Address('Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF')
            const addressBounceable2 = new Address('EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N')
            const addressBounceable3 = new Address('Ef_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xWdr')

            const addressNonBounceable1 = new Address('Uf8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMxYA')
            const addressNonBounceable2 = new Address('UQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqEBI')
            const addressNonBounceable3 = new Address('Uf_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xTqu')

            expect(result).to.equal(base64)

            expect(bytesCompare(addressBounceable1.hash, TEST_HASH_1)).to.equal(true)
            expect(bytesCompare(addressNonBounceable1.hash, TEST_HASH_1)).to.equal(true)
            expect(addressBounceable1.workchain).to.equal(-1)
            expect(addressNonBounceable1.workchain).to.equal(-1)

            expect(bytesCompare(addressBounceable2.hash, TEST_HASH_2)).to.equal(true)
            expect(bytesCompare(addressNonBounceable2.hash, TEST_HASH_2)).to.equal(true)
            expect(addressBounceable2.workchain).to.equal(0)
            expect(addressNonBounceable2.workchain).to.equal(0)

            expect(bytesCompare(addressBounceable3.hash, TEST_HASH_3)).to.equal(true)
            expect(bytesCompare(addressNonBounceable3.hash, TEST_HASH_3)).to.equal(true)
            expect(addressBounceable3.workchain).to.equal(-1)
            expect(addressNonBounceable3.workchain).to.equal(-1)
        })

        it('should create Address from raw address', () => {
            const raw1 = '-1:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260'
            const raw2 = '-1:3333333333333333333333333333333333333333333333333333333333333333'
            const raw3 = '0:83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8'
            const raw4 = '-1:dd24c4a1f2b88f8b7053513b5cc6c5a31bc44b2a72dcb4d8c0338af0f0d37ec5'
            const address1 = new Address(raw1)
            const address2 = new Address(raw2)
            const address3 = new Address(raw3)
            const address4 = new Address(raw4)

            expect(address1.toString('raw')).to.equal(raw1)

            expect(bytesCompare(address2.hash, TEST_HASH_1)).to.equal(true)
            expect(address2.workchain).to.equal(-1)

            expect(bytesCompare(address3.hash, TEST_HASH_2)).to.equal(true)
            expect(address3.workchain).to.equal(0)

            expect(bytesCompare(address4.hash, TEST_HASH_3)).to.equal(true)
            expect(address4.workchain).to.equal(-1)
        })

        it('should create Address and rewrite options', () => {
            const result = new Address(TEST_ADDRESS_4, {
                workchain: 0,
                bounceable: false,
                testOnly: false
            })

            expect(result.toString('base64', { urlSafe: false })).to.equal('UQD8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYJD1')
        })

        it('should throw error from bad input data', () => {
            const result1 = () => new Address('bad_input')
            const result2 = () => new Address('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYInz')
            const result3 = () => new Address('ov_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYMg3')

            expect(result1).to.throw('Address: can\'t parse address. Unknown type.')
            expect(result2).to.throw('Address: can\'t parse address. Wrong checksum.')
            expect(result3).to.throw('Address: bad address tag.')
        })
    })

    describe('#hash', () => {
        it('should get address hash', () => {
            const result = TEST_ADDRESS_4.hash

            expect(result.length).to.equal(32)
        })

        it('should throw error from changing attempt', () => {
            // @ts-ignore
            const result = () => { TEST_ADDRESS_4.hash = new Uint8Array() }

            expect(result).to.throw('Cannot set property hash of [object Object] which has only a getter')
        })
    })

    describe('#workchain', () => {
        it('should get address workchain', () => {
            const result = TEST_ADDRESS_4.workchain

            expect(result).to.equal(-1)
        })

        it('should throw error from changing attempt', () => {
            // @ts-ignore
            const result = () => { TEST_ADDRESS_4.workchain = 0 }

            expect(result).to.throw('Cannot set property workchain of [object Object] which has only a getter')
        })
    })

    describe('#bounceable', () => {
        it('should get address bounceable flag', () => {
            const result = TEST_ADDRESS_4.bounceable

            expect(result).to.equal(true)
        })

        it('should throw error from changing attempt', () => {
            // @ts-ignore
            const result = () => { TEST_ADDRESS_4.bounceable = false }

            expect(result).to.throw('Cannot set property bounceable of [object Object] which has only a getter')
        })
    })

    describe('#testOnly', () => {
        it('should get address testOnly flag', () => {
            const result = TEST_ADDRESS_4.testOnly

            expect(result).to.equal(true)
        })

        it('should throw error from changing attempt', () => {
            // @ts-ignore
            const result = () => { TEST_ADDRESS_4.testOnly = false }

            expect(result).to.throw('Cannot set property testOnly of [object Object] which has only a getter')
        })
    })

    describe('#eq()', () => {
        it('should compare addresses', () => {
            const address1 = new Address('-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260')
            const address2 = new Address('-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260')
            const address3 = new Address('-1:acb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260')
            const address4 = new Address('0:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260')
            const address5 = new Address('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')

            expect(address1.eq(address1)).to.equal(true)
            expect(address1.eq(address2)).to.equal(true)
            expect(address1.eq(address3)).to.equal(false)
            expect(address1.eq(address4)).to.equal(false)
            expect(address1.eq(address5)).to.equal(true)
        })
    })

    describe('#toString()', () => {
        it('should return non url-safe base64 address in workchain 0 with non bounceable and non testOnly flags', () => {
            const result = TEST_ADDRESS_4.toString('base64', {
                workchain: 0,
                bounceable: false,
                testOnly: false,
                urlSafe: false
            })

            expect(result).to.equal('UQD8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYJD1')
        })

        it('should return url-safe base64 address by default', () => {
            const result = TEST_ADDRESS_4.toString()

            expect(result).to.equal('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')
        })

        it('should return url-safe base64 address', () => {
            const address1 = TEST_ADDRESS_1
            const address2 = TEST_ADDRESS_2
            const address3 = TEST_ADDRESS_3
            const address4 = TEST_ADDRESS_4

            expect(address1.toString('base64', { urlSafe: true, testOnly: false, bounceable: true })).to.equal('Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF')
            expect(address1.toString('base64', { urlSafe: true, testOnly: false, bounceable: false })).to.equal('Uf8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMxYA')

            expect(address2.toString('base64', { bounceable: true })).to.equal('EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N')
            expect(address2.toString('base64', { bounceable: false })).to.equal('UQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqEBI')

            expect(address3.toString('base64', { urlSafe: true, testOnly: false, bounceable: true })).to.equal('Ef_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xWdr')
            expect(address3.toString('base64', { urlSafe: true, testOnly: false, bounceable: false })).to.equal('Uf_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xTqu')
            expect(address3.toString('base64', { urlSafe: true, testOnly: true, bounceable: true })).to.equal('kf_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xdzh')

            expect(address4.toString('base64', { urlSafe: true })).to.equal('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')
        })

        it('should return non url-safe base64 address', () => {
            const address1 = TEST_ADDRESS_1
            const address3 = TEST_ADDRESS_3

            expect(address1.toString('base64', { urlSafe: false, testOnly: false, bounceable: true })).to.equal('Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF')
            expect(address1.toString('base64', { urlSafe: false, testOnly: false, bounceable: false })).to.equal('Uf8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMxYA')

            expect(address3.toString('base64', { urlSafe: false, testOnly: false, bounceable: true })).to.equal('Ef/dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN+xWdr')
            expect(address3.toString('base64', { urlSafe: false, testOnly: false, bounceable: false })).to.equal('Uf/dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN+xTqu')
        })

        it('should return raw address', () => {
            const result = TEST_ADDRESS_4.toString('raw')

            expect(result).to.equal('-1:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260')
        })
    })

    describe('#isValid()', () => {
        it('should validate base64 non url-safe address', () => {
            const result = Address.isValid('kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny')

            expect(result).to.equal(true)
        })

        it('should validate base64 url-safe address', () => {
            const result = Address.isValid('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')

            expect(result).to.equal(true)
        })

        it('should validate base64 raw address', () => {
            const result = Address.isValid('-1:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260')

            expect(result).to.equal(true)
        })

        it('should invalidate bad address', () => {
            const result = Address.isValid('bad_address')

            expect(result).to.equal(false)
        })
    })
})
