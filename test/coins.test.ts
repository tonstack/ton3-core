// @ts-nocheck

import { expect } from 'chai'
import { Coins } from '../src/coins'

describe('Coins', () => {
    let number: Coins
    let decimal: Coins

    beforeEach(() => {
        number = new Coins('10')
        decimal = new Coins('10.5')
    })

    describe('#constructor()', () => {
        it('should create Coins from Coins', () => {
            const result1 = new Coins(number)
            const result2 = new Coins(decimal)

            expect(result1.toString()).to.equal(number.toString())
            expect(result2.toString()).to.equal(decimal.toString())
        })

        it('should create Coins from BigInt', () => {
            const value = BigInt(10)
            const result = new Coins(value)

            expect(result.toString()).to.equal(value.toString())
        })

        it('should create Coins from Number', () => {
            const value = 10
            const result = new Coins(value)

            expect(result.toString()).to.equal(value.toString())
        })

        it('should create Coins from String', () => {
            const value1 = '10'
            const value2 = '20.555'
            const result1 = new Coins(value1)
            const result2 = new Coins(value2)

            expect(result1.toString()).to.equal(value1.toString())
            expect(result2.toString()).to.equal(value2.toString())
        })

        it('should create Coins from nano', () => {
            const value1 = '10'
            const value2 = '20.555'
            const result1 = new Coins(10_000_000_000, { isNano: true })
            const result2 = new Coins(20_555_000_000, { isNano: true })

            expect(result1.toString()).to.equal(value1.toString())
            expect(result2.toString()).to.equal(value2.toString())
        })

        it('should create Coins with different decimals', () => {
            const value1 = '10'
            const value2 = '20.555'
            const result1 = new Coins(value1, { decimals: 10 })
            const result2 = new Coins(value2, { decimals: 10 })

            expect(result1.toString()).to.equal(value1.toString())
            expect(result2.toString()).to.equal(value2.toString())
        })

        it('should create Coins from nano with different decimals', () => {
            const value1 = '10'
            const value2 = '20.555'
            const result1 = new Coins(10_000_000_000_0, { isNano: true, decimals: 10 })
            const result2 = new Coins(20_555_000_000_0, { isNano: true, decimals: 10 })
            const result3 = new Coins(10_000, { isNano: true, decimals: 3 })
            const result4 = new Coins(20_555, { isNano: true, decimals: 3 })

            expect(result1.toString()).to.equal(value1.toString())
            expect(result2.toString()).to.equal(value2.toString())
            expect(result3.toString()).to.equal(value1.toString())
            expect(result4.toString()).to.equal(value2.toString())
        })

        it('should throw error from bad input data', () => {
            const result1 = () => new Coins('bad_input')
            const result2 = () => new Coins('')
            const result3 = () => new Coins(null)
            const result4 = () => new Coins(undefined)
            const result5 = () => new Coins('20.555', { decimals: 0 })

            expect(result1).to.throw('Invalid Coins value')
            expect(result2).to.throw('Invalid Coins value')
            expect(result3).to.throw('Invalid Coins value')
            expect(result4).to.throw('Invalid Coins value')
            expect(result5).to.throw(`Invalid Coins value, decimals places "3" can't be greater than selected "0"`)
        })
    })

    describe('#add()', () => {
        it('should add Coins', () => {
            const result1 = number.add(new Coins('10'))
            const result2 = decimal.add(new Coins('10'))

            expect(result1.toString()).to.equal('20')
            expect(result2.toString()).to.equal('20.5')
        })

        it('should throw error from bad input data', () => {
            const result1 = () => number.add('bad_input')
            const result2 = () => number.add('')
            const result3 = () => number.add(null)
            const result4 = () => number.add(undefined)
            const result5 = () => number.add(BigInt(10))
            const result6 = () => number.add(10)
            const result7 = () => number.add('10')

            expect(result1).to.throw('Invalid value')
            expect(result2).to.throw('Invalid value')
            expect(result3).to.throw('Invalid value')
            expect(result4).to.throw('Invalid value')
            expect(result5).to.throw('Invalid value')
            expect(result6).to.throw('Invalid value')
            expect(result7).to.throw('Invalid value')
        })
    })

    describe('#sub()', () => {
        it('should sub Coins', () => {
            const result1 = number.sub(new Coins('10'))
            const result2 = decimal.sub(new Coins('10'))

            expect(result1.toString()).to.equal('0')
            expect(result2.toString()).to.equal('0.5')
        })

        it('should throw error from bad input data', () => {
            const result1 = () => number.sub('bad_input')
            const result2 = () => number.sub('')
            const result3 = () => number.sub(null)
            const result4 = () => number.sub(undefined)
            const result5 = () => number.sub(BigInt(10))
            const result6 = () => number.sub(10)
            const result7 = () => number.sub('10')

            expect(result1).to.throw('Invalid value')
            expect(result2).to.throw('Invalid value')
            expect(result3).to.throw('Invalid value')
            expect(result4).to.throw('Invalid value')
            expect(result5).to.throw('Invalid value')
            expect(result6).to.throw('Invalid value')
            expect(result7).to.throw('Invalid value')
        })
    })

    describe('#mul()', () => {
        it('should mul BigInt', () => {
            const result1 = number.mul(BigInt(10))
            const result2 = decimal.mul(BigInt(10))

            expect(result1.toString()).to.equal('100')
            expect(result2.toString()).to.equal('105')
        })

        it('should mul Number', () => {
            const result1 = number.mul(10)
            const result2 = decimal.mul(10)

            expect(result1.toString()).to.equal('100')
            expect(result2.toString()).to.equal('105')
        })

        it('should mul String', () => {
            const result1 = number.mul('10')
            const result2 = decimal.mul('10')

            expect(result1.toString()).to.equal('100')
            expect(result2.toString()).to.equal('105')
        })

        it('should throw error from bad input data', () => {
            const result1 = () => number.mul('bad_input')
            const result2 = () => number.mul('')
            const result3 = () => number.mul(null)
            const result4 = () => number.mul(undefined)
            const result5 = () => number.mul(new Coins('10'))

            expect(result1).to.throw('Invalid value')
            expect(result2).to.throw('Invalid value')
            expect(result3).to.throw('Invalid value')
            expect(result4).to.throw('Invalid value')
            expect(result5).to.throw('Invalid value')
        })
    })

    describe('#div()', () => {
        it('should div BigInt', () => {
            const result1 = number.div(BigInt(10))
            const result2 = decimal.div(BigInt(10))

            expect(result1.toString()).to.equal('1')
            expect(result2.toString()).to.equal('1.05')
        })

        it('should div Number', () => {
            const result1 = number.div(10)
            const result2 = decimal.div(10)

            expect(result1.toString()).to.equal('1')
            expect(result2.toString()).to.equal('1.05')
        })

        it('should div String', () => {
            const result1 = number.div('10')
            const result2 = decimal.div('10')

            expect(result1.toString()).to.equal('1')
            expect(result2.toString()).to.equal('1.05')
        })

        it('should throw error from bad input data', () => {
            const result1 = () => number.div('bad_input')
            const result2 = () => number.div('')
            const result3 = () => number.div(null)
            const result4 = () => number.div(undefined)
            const result5 = () => number.div(new Coins('10'))

            expect(result1).to.throw('Invalid value')
            expect(result2).to.throw('Invalid value')
            expect(result3).to.throw('Invalid value')
            expect(result4).to.throw('Invalid value')
            expect(result5).to.throw('Invalid value')
        })
    })

    describe('#eq()', () => {
        it('should check equality with other Coins', () => {
            const result1 = new Coins('10')
            const result2 = new Coins('11')

            expect(result1.eq(number)).to.equal(true)
            expect(result2.eq(number)).to.equal(false)
        })

        it('should throw error from bad input data', () => {
            const result1 = () => number.eq('bad_input')
            const result2 = () => number.eq('')
            const result3 = () => number.eq(null)
            const result4 = () => number.eq(undefined)
            const result5 = () => number.eq(BigInt(10))
            const result6 = () => number.eq(10)
            const result7 = () => number.eq('10')
            const result8 = () => number.eq(new Coins('10', { decimals: 10 }))

            expect(result1).to.throw('Invalid value')
            expect(result2).to.throw('Invalid value')
            expect(result3).to.throw('Invalid value')
            expect(result4).to.throw('Invalid value')
            expect(result5).to.throw('Invalid value')
            expect(result6).to.throw('Invalid value')
            expect(result7).to.throw('Invalid value')
            expect(result8).to.throw("Can't perform mathematical operation of Coins with different decimals")
        })
    })

    describe('#gt()', () => {
        it('should check which value is greater', () => {
            const result1 = new Coins('10')
            const result2 = new Coins('11')

            expect(result1.gt(number)).to.equal(false)
            expect(result2.gt(number)).to.equal(true)
        })

        it('should throw error from bad input data', () => {
            const result1 = () => number.gt('bad_input')
            const result2 = () => number.gt('')
            const result3 = () => number.gt(null)
            const result4 = () => number.gt(undefined)
            const result5 = () => number.gt(BigInt(10))
            const result6 = () => number.gt(10)
            const result7 = () => number.gt('10')
            const result8 = () => number.gt(new Coins('10', { decimals: 10 }))

            expect(result1).to.throw('Invalid value')
            expect(result2).to.throw('Invalid value')
            expect(result3).to.throw('Invalid value')
            expect(result4).to.throw('Invalid value')
            expect(result5).to.throw('Invalid value')
            expect(result6).to.throw('Invalid value')
            expect(result7).to.throw('Invalid value')
            expect(result8).to.throw("Can't perform mathematical operation of Coins with different decimals")
        })
    })

    describe('#gte()', () => {
        it('should check which value is greater or equal', () => {
            const result1 = new Coins('10')
            const result2 = new Coins('11')

            expect(result1.gte(number)).to.equal(true)
            expect(result2.gte(number)).to.equal(true)
        })

        it('should throw error from bad input data', () => {
            const result1 = () => number.gte('bad_input')
            const result2 = () => number.gte('')
            const result3 = () => number.gte(null)
            const result4 = () => number.gte(undefined)
            const result5 = () => number.gte(BigInt(10))
            const result6 = () => number.gte(10)
            const result7 = () => number.gte('10')
            const result8 = () => number.gte(new Coins('10', { decimals: 10 }))

            expect(result1).to.throw('Invalid value')
            expect(result2).to.throw('Invalid value')
            expect(result3).to.throw('Invalid value')
            expect(result4).to.throw('Invalid value')
            expect(result5).to.throw('Invalid value')
            expect(result6).to.throw('Invalid value')
            expect(result7).to.throw('Invalid value')
            expect(result8).to.throw("Can't perform mathematical operation of Coins with different decimals")
        })
    })

    describe('#lt()', () => {
        it('should check which value is lower', () => {
            const result1 = new Coins('10')
            const result2 = new Coins('9')

            expect(result1.lt(number)).to.equal(false)
            expect(result2.lt(number)).to.equal(true)
        })

        it('should throw error from bad input data', () => {
            const result1 = () => number.lt('bad_input')
            const result2 = () => number.lt('')
            const result3 = () => number.lt(null)
            const result4 = () => number.lt(undefined)
            const result5 = () => number.lt(BigInt(10))
            const result6 = () => number.lt(10)
            const result7 = () => number.lt('10')
            const result8 = () => number.lt(new Coins('10', { decimals: 10 }))

            expect(result1).to.throw('Invalid value')
            expect(result2).to.throw('Invalid value')
            expect(result3).to.throw('Invalid value')
            expect(result4).to.throw('Invalid value')
            expect(result5).to.throw('Invalid value')
            expect(result6).to.throw('Invalid value')
            expect(result7).to.throw('Invalid value')
            expect(result8).to.throw("Can't perform mathematical operation of Coins with different decimals")
        })
    })

    describe('#lte()', () => {
        it('should check which value is lower or equal', () => {
            const result1 = new Coins('10')
            const result2 = new Coins('9')

            expect(result1.lte(number)).to.equal(true)
            expect(result2.lte(number)).to.equal(true)
        })

        it('should throw error from bad input data', () => {
            const result1 = () => number.lte('bad_input')
            const result2 = () => number.lte('')
            const result3 = () => number.lte(null)
            const result4 = () => number.lte(undefined)
            const result5 = () => number.lte(BigInt(10))
            const result6 = () => number.lte(10)
            const result7 = () => number.lte('10')
            const result8 = () => number.lte(new Coins('10', { decimals: 10 }))

            expect(result1).to.throw('Invalid value')
            expect(result2).to.throw('Invalid value')
            expect(result3).to.throw('Invalid value')
            expect(result4).to.throw('Invalid value')
            expect(result5).to.throw('Invalid value')
            expect(result6).to.throw('Invalid value')
            expect(result7).to.throw('Invalid value')
            expect(result8).to.throw("Can't perform mathematical operation of Coins with different decimals")
        })
    })

    describe('#isNegative()', () => {
        it('should check if Coins has negative value', () => {
            const result1 = new Coins('-1.23')
            const result2 = new Coins('0')
            const result3 = new Coins('1.23')

            expect(result1.isNegative()).to.equal(true)
            expect(result2.isNegative()).to.equal(false)
            expect(result3.isNegative()).to.equal(false)
        })
    })

    describe('#isPositive()', () => {
        it('should check if Coins has positive value', () => {
            const result1 = new Coins('-1.23')
            const result2 = new Coins('0')
            const result3 = new Coins('1.23')

            expect(result1.isPositive()).to.equal(false)
            expect(result2.isPositive()).to.equal(true)
            expect(result3.isPositive()).to.equal(true)
        })
    })

    describe('#isZero()', () => {
        it('should check if Coins has zero value', () => {
            const result1 = new Coins('-1.23')
            const result2 = new Coins('0')
            const result3 = new Coins('1.23')

            expect(result1.isZero()).to.equal(false)
            expect(result2.isZero()).to.equal(true)
            expect(result3.isZero()).to.equal(false)
        })
    })

    describe('#toString()', () => {
        it('should get string value from Coins', () => {
            const result1 = new Coins('-1.23')
            const result2 = new Coins('0')
            const result3 = new Coins('1.23')

            expect(result1.toString()).to.equal('-1.23')
            expect(result2.toString()).to.equal('0')
            expect(result3.toString()).to.equal('1.23')
        })
    })

    describe('#toNano()', () => {
        it('should get string value from Coins in nano', () => {
            const result1 = new Coins('-1.23')
            const result2 = new Coins('0')
            const result3 = new Coins('1.23')

            expect(result1.toNano()).to.equal('-1230000000')
            expect(result2.toNano()).to.equal('0')
            expect(result3.toNano()).to.equal('1230000000')
        })
    })

    describe('#fromNano()', () => {
        it('should create Coins from nano', () => {
            const result1 = Coins.fromNano('9007199254740992')
            const result2 = Coins.fromNano(BigInt('9007199254740992'))

            expect(result1.toString()).to.equal('9007199.254740992')
            expect(result2.toString()).to.equal('9007199.254740992')
        })
    })
})
