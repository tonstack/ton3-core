import { expect } from 'chai'
import { Mask } from '../src/boc'

describe('Mask', () => {
    const MASK_LEVEL_0 = 0b00000_000
    const MASK_LEVEL_1 = 0b00000_001
    const MASK_LEVEL_2 = 0b00000_011
    const MASK_LEVEL_3 = 0b00000_111
    const MASK_FULL_LEVEL_0 = 0b11111_000
    const MASK_FULL_LEVEL_1 = 0b11111_001
    const MASK_FULL_LEVEL_2 = 0b11111_011
    const MASK_FULL_LEVEL_3 = 0b11111_111


    describe('#constructor()', () => {
        it('should create Mask from number', () => {
            const mask = new Mask(MASK_LEVEL_0)

            expect(mask.value).to.equal(MASK_LEVEL_0)
            expect(mask.level).to.equal(0)
            expect(mask.hashCount).to.equal(1)
            expect(mask.hashIndex).to.equal(0)
        })

        it('should create Mask from another Mask', () => {
            const mask = new Mask(new Mask(MASK_LEVEL_0))

            expect(mask.value).to.equal(MASK_LEVEL_0)
            expect(mask.level).to.equal(0)
            expect(mask.hashCount).to.equal(1)
            expect(mask.hashIndex).to.equal(0)
        })
    })

    describe('#value', () => {
        it('should get Mask value', () => {
            const mask1 = new Mask(MASK_LEVEL_0)
            const mask2 = new Mask(MASK_LEVEL_1)
            const mask3 = new Mask(MASK_LEVEL_2)
            const mask4 = new Mask(MASK_LEVEL_3)

            expect(mask1.value).to.equal(MASK_LEVEL_0)
            expect(mask2.value).to.equal(MASK_LEVEL_1)
            expect(mask3.value).to.equal(MASK_LEVEL_2)
            expect(mask4.value).to.equal(MASK_LEVEL_3)
        })

        it('should throw error from changing attempt', () => {
            // @ts-ignore
            const result = () => { new Mask(MASK_LEVEL_0).value = MASK_LEVEL_1 }

            expect(result).to.throw('Cannot set property value of #<Mask> which has only a getter')
        })
    })

    describe('#level', () => {
        it('should get Mask level', () => {
            const mask1 = new Mask(MASK_LEVEL_0)
            const mask2 = new Mask(MASK_LEVEL_1)
            const mask3 = new Mask(MASK_LEVEL_2)
            const mask4 = new Mask(MASK_LEVEL_3)

            // const mask5 = new Mask(MASK_FULL_LEVEL_0)
            // const mask6 = new Mask(MASK_FULL_LEVEL_1)
            // const mask7 = new Mask(MASK_FULL_LEVEL_2)
            // const mask8 = new Mask(MASK_FULL_LEVEL_3)

            expect(mask1.level).to.equal(0)
            expect(mask2.level).to.equal(1)
            expect(mask3.level).to.equal(2)
            expect(mask4.level).to.equal(3)

            // expect(mask5.level).to.equal(8)
            // expect(mask6.level).to.equal(8)
            // expect(mask7.level).to.equal(8)
            // expect(mask8.level).to.equal(8)
        })

        it('should throw error from changing attempt', () => {
            // @ts-ignore
            const result = () => { new Mask(MASK_LEVEL_0).level = 1 }

            expect(result).to.throw('Cannot set property level of #<Mask> which has only a getter')
        })
    })

    describe('#hashIndex', () => {
        it('should get Mask hash index', () => {
            const mask1 = new Mask(MASK_LEVEL_0)
            const mask2 = new Mask(MASK_LEVEL_1)
            const mask3 = new Mask(MASK_LEVEL_2)
            const mask4 = new Mask(MASK_LEVEL_3)

            const mask5 = new Mask(MASK_FULL_LEVEL_0)
            const mask6 = new Mask(MASK_FULL_LEVEL_1)
            const mask7 = new Mask(MASK_FULL_LEVEL_2)
            const mask8 = new Mask(MASK_FULL_LEVEL_3)

            expect(mask1.hashIndex).to.equal(0)
            expect(mask2.hashIndex).to.equal(1)
            expect(mask3.hashIndex).to.equal(2)
            expect(mask4.hashIndex).to.equal(3)

            expect(mask5.hashIndex).to.equal(5)
            expect(mask6.hashIndex).to.equal(6)
            expect(mask7.hashIndex).to.equal(7)
            expect(mask8.hashIndex).to.equal(8)
        })

        it('should throw error from changing attempt', () => {
            // @ts-ignore
            const result = () => { new Mask(MASK_LEVEL_0).hashIndex = 1 }

            expect(result).to.throw('Cannot set property hashIndex of #<Mask> which has only a getter')
        })
    })

    describe('#hashCount', () => {
        it('should get Mask hashes size', () => {
            const mask1 = new Mask(MASK_LEVEL_0)
            const mask2 = new Mask(MASK_LEVEL_1)
            const mask3 = new Mask(MASK_LEVEL_2)
            const mask4 = new Mask(MASK_LEVEL_3)

            const mask5 = new Mask(MASK_FULL_LEVEL_0)
            const mask6 = new Mask(MASK_FULL_LEVEL_1)
            const mask7 = new Mask(MASK_FULL_LEVEL_2)
            const mask8 = new Mask(MASK_FULL_LEVEL_3)

            expect(mask1.hashCount).to.equal(1)
            expect(mask2.hashCount).to.equal(2)
            expect(mask3.hashCount).to.equal(3)
            expect(mask4.hashCount).to.equal(4)

            expect(mask5.hashCount).to.equal(6)
            expect(mask6.hashCount).to.equal(7)
            expect(mask7.hashCount).to.equal(8)
            expect(mask8.hashCount).to.equal(9)
        })

        it('should throw error from changing attempt', () => {
            // @ts-ignore
            const result = () => { new Mask(MASK_LEVEL_0).hashCount = 1 }

            expect(result).to.throw('Cannot set property hashCount of #<Mask> which has only a getter')
        })
    })

    // describe('#apply()', () => {
    //     it('should get new Mask from level', () => {
    //         const mask1 = new Mask(MASK_LEVEL_3)
    //         const mask2 = new Mask(MASK_FULL_LEVEL_3)
    //         const result1 = mask1.apply(0)
    //         const result2 = mask2.apply(0)

    //         expect(result1.value).to.equal(MASK_LEVEL_0)
    //         expect(result2.value).to.equal(MASK_FULL_LEVEL_0)
    //     })
    // })
})
