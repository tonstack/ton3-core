import type { Bit } from '../src/types/bit'
import { expect } from 'chai'
import { Builder, Cell, BOC, Slice } from '../src/boc'
import { Hashmap, HashmapE } from '../src/boc/hashmap'

describe('Hashmap', () => {
    describe('#constructor()', () => {
        it('should create Hashmap', () => {
            expect(true).to.eql(true)
        })
    })

    describe('#parse()', () => {
        it('should (de)serialize dict with mixed empty edges', () => {
            const BOC_NETWORK_CONFIG = BOC.fromStandard('te6cckEBEwEAVwACASABAgIC2QMEAgm3///wYBESAgEgBQYCAWIODwIBIAcIAgHODQ0CAdQNDQIBIAkKAgEgCxACASAQDAABWAIBIA0NAAEgAgEgEBAAAdQAAUgAAfwAAdwXk+eF')
            const KEYS_NETWORK_CONFIG = [ 0, 1, 9, 10, 12, 14, 15, 16, 17, 32, 34, 36, -1001, -1000 ]
    
            const deserializers = {
                key: (k: Bit[]): number => Slice.parse(new Builder().storeBits(k).cell()).loadInt(32),
                value: (v: Cell): Cell => v
            }
    
            const parsed = [ ...Hashmap.parse(32, Slice.parse(BOC_NETWORK_CONFIG), { deserializers }) ]
    
            expect(parsed.map(el => el[0])).to.eql(KEYS_NETWORK_CONFIG)
            expect(parsed.map(el => el[1]).every(cell => !cell.bits.length)).to.equal(true)
        })

        it('should (de)serialize dict with both edges', () => {
            const BOC_FIFT = BOC.fromStandard('B5EE9C7241010501001D0002012001020201CF03040009BC0068054C0007B91012180007BEFDF218CFA830D9')

            const serializers = {
                key: (k: number): Bit[] => new Builder().storeUint(k, 16).bits,
                value: (v: number): Cell => new Builder().storeUint(v, 16).cell()
            }
    
            const deserializers = {
                key: (k: Bit[]): number => Slice.parse(new Builder().storeBits(k).cell()).loadUint(16),
                value: (v: Cell): number => Slice.parse(v).loadUint(16)
            }
    
            const dict = new Hashmap<number, number>(16, { serializers, deserializers })
    
            dict.set(17, 289)
            dict.set(239, 57121)
            dict.set(32781, 169)
    
            const result = [ ...dict ]
            const parsed = [ ...Hashmap.parse(16, Slice.parse(BOC_FIFT), { deserializers }) ]
    
            expect(parsed.map(el => el[0])).to.eql(result.map(el => el[0]))
            expect(parsed.map(el => el[1])).to.eql(result.map(el => el[1]))
        })
    })
})

describe('HashmapE', () => {
    describe('#constructor()', () => {
        it('should create HashmapE', () => {
            expect(true).to.eql(true)
        })
    })

    describe('#parse()', () => {
        it('should (de)serialize dict with empty right edges', () => {
            const BOC_FIFT = BOC.fromStandard('B5EE9C72410106010020000101C0010202C8020302016204050007BEFDF2180007A68054C00007A08090C08D16037D')

            const serializers = {
                key: (k: number): Bit[] => new Builder().storeUint(k, 16).bits,
                value: (v: number): Cell => new Builder().storeUint(v, 16).cell()
            }

            const deserializers = {
                key: (k: Bit[]): number => Slice.parse(new Builder().storeBits(k).cell()).loadUint(16),
                value: (v: Cell): number => Slice.parse(v).loadUint(16)
            }

            const dict = new HashmapE<number, number>(16, { serializers, deserializers })

            dict.set(13, 169)
            dict.set(17, 289)
            dict.set(239, 57121)

            const result = [ ...dict ]
            const parsed = [ ...HashmapE.parse(16, Slice.parse(BOC_FIFT), { deserializers }) ]

            expect(parsed.map(el => el[0])).to.eql(result.map(el => el[0]))
            expect(parsed.map(el => el[1])).to.eql(result.map(el => el[1]))
        })
    })
})
