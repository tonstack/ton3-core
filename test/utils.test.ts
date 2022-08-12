import { expect } from 'chai'
import {
    Checksum,
    Helpers,
    Hash,
} from '../src/utils'

describe('Utils', () => {
    const TEST_STRINGS = [ '', '1', 'short test string', Array(1_000_000).fill('a').join('') ]
    const { sha256 } = Hash
    const {
        crc32c,
        crc16
    } = Checksum
    const {
        stringToBytes,
        hexToBytes,
        base64ToBytes,
        bytesCompare
    } = Helpers
    

    describe('#sha256', () => {
        it('should get correct hash', () => {
            const result = TEST_STRINGS.map(el => hexToBytes(sha256(stringToBytes(el))))
            const answers = [
                '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
                'a4ayc/80/OGda4BO/1o/V0etpOqiLx1JwB5S3beHW0s=',
                'yPMaY7Q8PKPwCsw64UnDD5mhRcituEJgzLZMvr0O8pY=',
                'zcduXJkU+5KBocfihNc+Z/GAmkiklyAOBG05zMcRLNA='
            ].map(el => base64ToBytes(el))

            expect(result.every((el, i) => bytesCompare(el, answers[i]))).to.equal(true)
        })
    })

    describe('#crc32c', () => {
        it('should get correct checksum', () => {
            const result = TEST_STRINGS.map(el => crc32c(stringToBytes(el)))
            const answers = [ 0, 2432014819, 1077264849, 1131405888 ]

            expect(result.every((el, i) => el === answers[i])).to.equal(true)
        })
    })

    describe('#crc16', () => {
        it('should get correct checksum', () => {
            const result = TEST_STRINGS.map(el => crc16(stringToBytes(el)))
            const answers = [ 0, 9842, 25046, 37023 ]

            expect(result.every((el, i) => el === answers[i])).to.equal(true)
        })
    })
})
