import { expect } from 'chai'
import { Builder, Cell, Slice, HashmapE } from '../src/boc'
import { stringToBytes } from '../src/utils/helpers'
import { Address } from '../src/address'
import { Coins } from '../src/coins'

describe('Slice', () => {
    let builder: Builder

    beforeEach(() => {
        builder = new Builder()
    })

    describe('#constructor()', () => {
        it('should create Slice from Cell', () => {
            const cell = builder.cell()
            const result = Slice.parse(cell)

            expect(result).to.be.instanceOf(Slice)
        })
    })

    describe('#bits', () => {
        it('should get Slice bits', () => {
            const slice = builder.cell().slice()
            const result = slice.bits

            expect(result).to.eql([])
        })

        it('should throw error from changing attempt', () => {
            const slice = builder.cell().slice()
            // @ts-ignore
            const result = () => { slice.bits = [ 0, 1 ] }

            expect(result).to.throw('Cannot set property bits of #<Slice> which has only a getter')
        })
    })

    describe('#refs', () => {
        it('should get Slice refs', () => {
            const slice = builder.cell().slice()
            const result = slice.refs

            expect(result).to.eql([])
        })

        it('should throw error from changing attempt', () => {
            const slice = builder.cell().slice()
            // @ts-ignore
            const result = () => { slice.refs = [] }

            expect(result).to.throw('Cannot set property refs of #<Slice> which has only a getter')
        })
    })

    describe('#skip()', () => {
        it('should skip bits', () => {
            builder.storeBits([ 0, 0, 1, 1 ])

            const slice = builder.cell().slice()
            const result = slice.skip(2).loadBits(2)

            expect(result).to.eql([ 1, 1 ])
        })

        it('should throw error on overflow', () => {
            builder.storeBits([ 0, 0, 1, 1 ])

            const slice = builder.cell().slice()
            const result = () => slice.skip(6)

            expect(result).to.throw('Slice: bits overflow.')
        })
    })

    describe('#skipBits()', () => {
        it('should skip bits', () => {
            builder.storeBits([ 0, 0, 1, 1 ])

            const slice = builder.cell().slice()
            const result = slice.skipBits(2).loadBits(2)

            expect(result).to.eql([ 1, 1 ])
        })

        it('should throw error on overflow', () => {
            builder.storeBits([ 0, 0, 1, 1 ])

            const slice = builder.cell().slice()
            const result = () => slice.skipBits(6)

            expect(result).to.throw('Slice: bits overflow.')
        })
    })

    describe('#skipRefs()', () => {
        it('should skip refs', () => {
            const ref1 = new Cell({ bits: [ 0, 1 ] })
            const ref2 = new Cell({ bits: [ 1, 0 ] })

            builder.storeRefs([ ref1, ref2 ])

            const slice = builder.cell().slice()
            const result = slice.skipRefs(1).loadRef()

            expect(result.bits).to.eql([ 1, 0 ])
            expect(slice.refs.length).to.eql(0)
        })

        it('should throw error on overflow', () => {
            const ref = new Cell()

            builder.storeRef(ref)

            const slice = builder.cell().slice()
            const result = () => slice.skipRefs(2)

            expect(result).to.throw('Slice: refs overflow.')
        })
    })

    describe('#skipDict()', () => {
        it('should skip empty dict', () => {
            const dict = new HashmapE(16)
            const ref = new Cell()

            builder.storeDict(dict)
                .storeBits([ 1, 1 ])
                .storeRef(ref)

            const slice = builder.cell().slice()

            expect(slice.bits).to.eql([ 0, 1, 1 ])
            expect(slice.refs.length).to.eql(1)

            const result = slice.skipDict()

            expect(result.bits).to.eql([ 1, 1 ])
            expect(result.refs.length).to.eql(1)
        })

        it('should skip non-empty dict', () => {
            const dict = new HashmapE(16)
            const ref = new Cell()

            dict.set([ 0 ], new Cell())
            dict.set([ 1 ], new Cell())

            builder.storeDict(dict)
                .storeBits([ 1, 1 ])
                .storeRef(ref)

            const slice = builder.cell().slice()

            expect(slice.bits).to.eql([ 1, 1, 1 ])
            expect(slice.refs.length).to.eql(2)

            const result = slice.skipDict()

            expect(result.bits).to.eql([ 1, 1 ])
            expect(result.refs.length).to.eql(1)
        })

        it('should throw error on overflow', () => {
            const result1 = () => new Cell().slice().skipDict()
            const result2 = () => new Cell({ bits: [ 1 ] }).slice().skipDict()

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: refs overflow.')
        })
    })

    describe('#loadRef(), #preloadRef()', () => {
        it('should load ref', () => {
            const ref = new Builder().cell()

            builder.storeRef(ref)

            const slice = builder.cell().slice()
            const result1 = slice.loadRef()
            const result2 = slice.refs.length

            expect(result1).to.eq(ref)
            expect(result2).to.eq(0)
        })

        it('should preload ref without splicing refs', () => {
            const ref = new Builder().cell()

            builder.storeRef(ref)

            const slice = builder.cell().slice()
            const result1 = slice.preloadRef()
            const result2 = slice.refs.length

            expect(result1).to.eq(ref)
            expect(result2).to.eq(1)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().slice()
            const result1 = () => slice.loadRef()
            const result2 = () => slice.preloadRef()

            expect(result1).to.throw('Slice: refs overflow.')
            expect(result2).to.throw('Slice: refs overflow.')
        })
    })

    describe('#loadMaybeRef(), #preloadMaybeRef()', () => {
        it('should load ref', () => {
            const ref = new Builder().cell()

            builder.storeMaybeRef(ref)

            const slice = builder.cell().slice()
            const result1 = slice.loadMaybeRef()
            const result2 = slice.refs.length
            const result3 = slice.bits.length

            expect(result1).to.eq(ref)
            expect(result2).to.eq(0)
            expect(result3).to.eq(0)
        })

        it('should load null', () => {
            builder.storeMaybeRef(null)

            const slice = builder.cell().slice()
            const result1 = slice.loadMaybeRef()
            const result2 = slice.refs.length
            const result3 = slice.bits.length

            expect(result1).to.eq(null)
            expect(result2).to.eq(0)
            expect(result3).to.eq(0)
        })

        it('should preload ref without splicing refs and bits', () => {
            const ref = new Builder().cell()

            builder.storeMaybeRef(ref)

            const slice = builder.cell().slice()
            const result1 = slice.preloadMaybeRef()
            const result2 = slice.refs.length
            const result3 = slice.bits.length
            const result4 = slice.bits[0]

            expect(result1).to.eq(ref)
            expect(result2).to.eq(1)
            expect(result3).to.eq(1)
            expect(result4).to.eq(1)
        })

        it('should preload null without splicing bits', () => {
            builder.storeMaybeRef(null)

            const slice = builder.cell().slice()
            const result1 = slice.preloadMaybeRef()
            const result2 = slice.refs.length
            const result3 = slice.bits.length
            const result4 = slice.bits[0]

            expect(result1).to.eq(null)
            expect(result2).to.eq(0)
            expect(result3).to.eq(1)
            expect(result4).to.eq(0)
        })

        it('should throw error on overflow', () => {
            builder.storeBit(1)

            const slice = builder.cell().slice()

            const result1 = () => slice.preloadMaybeRef()
            const result2 = () => slice.loadMaybeRef()
            const result3 = () => slice.preloadMaybeRef()
            const result4 = () => slice.loadMaybeRef()

            expect(result1).to.throw('Slice: refs overflow.')
            expect(result2).to.throw('Slice: refs overflow.')
            expect(result3).to.throw('Slice: bits overflow.')
            expect(result4).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadBit(), #preloadBit()', () => {
        it('should load bit', () => {
            builder.storeBit(1)

            const slice = builder.cell().slice()
            const result1 = slice.loadBit()
            const result2 = slice.bits.length

            expect(result1).to.eq(1)
            expect(result2).to.eq(0)
        })

        it('should preload bit without splicing bits', () => {
            builder.storeBit(1)

            const slice = builder.cell().slice()
            const result1 = slice.preloadBit()
            const result2 = slice.bits.length

            expect(result1).to.eq(1)
            expect(result2).to.eq(1)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().slice()
            const result1 = () => slice.loadBit()
            const result2 = () => slice.preloadBit()

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadBits(), #preloadBits()', () => {
        it('should load bits', () => {
            builder.storeBits([ 0, 1 ])

            const slice = builder.cell().slice()
            const result1 = slice.loadBits(2)
            const result2 = slice.bits.length

            expect(result1).to.eql([ 0, 1 ])
            expect(result2).to.eq(0)
        })

        it('should preload bits without splicing bits', () => {
            builder.storeBits([ 0, 1 ])

            const slice = builder.cell().slice()
            const result1 = slice.preloadBits(2)
            const result2 = slice.bits.length

            expect(result1).to.eql([ 0, 1 ])
            expect(result2).to.eq(2)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().slice()
            const result1 = () => slice.loadBits(2)
            const result2 = () => slice.loadBits(2)

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadInt(), #preloadInt()', () => {
        it('should load negative int', () => {
            const int = -14

            builder.storeInt(int, 15)

            const slice = builder.cell().slice()
            const result1 = slice.loadInt(15)
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(0)
        })

        it('should load positive int', () => {
            const int = 14

            builder.storeInt(int, 15)

            const slice = builder.cell().slice()
            const result1 = slice.loadInt(15)
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(0)
        })

        it('should preload negative int without splicing bits', () => {
            const int = -14

            builder.storeInt(int, 15)

            const slice = builder.cell().slice()
            const result1 = slice.preloadInt(15)
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(15)
        })

        it('should preload positive int without splicing bits', () => {
            const int = 14

            builder.storeInt(int, 15)

            const slice = builder.cell().slice()
            const result1 = slice.preloadInt(15)
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(15)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().slice()
            const result1 = () => slice.loadInt(15)
            const result2 = () => slice.preloadInt(15)

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })

        it('should throw error on loading positive BigInt', () => {
            builder.storeInt(BigInt(Number.MAX_SAFE_INTEGER) + 100n, 64)

            const slice = builder.cell().slice()

            const result1 = () => slice.preloadInt(64)
            const result2 = () => slice.loadInt(64)

            expect(result1).to.throw('loaded value does not fit max/min safe integer value, use alternative BigInt methods')
            expect(result2).to.throw('loaded value does not fit max/min safe integer value, use alternative BigInt methods')
        })

        it('should throw error on loading negative BigInt', () => {
            builder.storeInt(BigInt(Number.MIN_SAFE_INTEGER) - 100n, 64)

            const slice = builder.cell().slice()

            const result1 = () => slice.preloadInt(64)
            const result2 = () => slice.loadInt(64)

            expect(result1).to.throw('loaded value does not fit max/min safe integer value, use alternative BigInt methods')
            expect(result2).to.throw('loaded value does not fit max/min safe integer value, use alternative BigInt methods')
        })
    })

    describe('#loadBigInt(), #preloadBigInt()', () => {
        it('should load negative bigint', () => {
            const bigint = BigInt(Number.MIN_SAFE_INTEGER) - 100n

            builder.storeInt(bigint, 64)

            const slice = builder.cell().slice()
            const result1 = slice.loadBigInt(64)
            const result2 = slice.bits.length

            expect(result1).to.eq(bigint)
            expect(result2).to.eq(0)
        })

        it('should load positive bigint', () => {
            const bigint = BigInt(Number.MAX_SAFE_INTEGER) + 100n

            builder.storeInt(bigint, 64)

            const slice = builder.cell().slice()
            const result1 = slice.loadBigInt(64)
            const result2 = slice.bits.length

            expect(result1).to.eq(bigint)
            expect(result2).to.eq(0)
        })

        it('should preload negative bigint without splicing bits', () => {
            const bigint = BigInt(Number.MIN_SAFE_INTEGER) - 100n

            builder.storeInt(bigint, 64)

            const slice = builder.cell().slice()
            const result1 = slice.preloadBigInt(64)
            const result2 = slice.bits.length

            expect(result1).to.eq(bigint)
            expect(result2).to.eq(64)
        })

        it('should preload positive bigint without splicing bits', () => {
            const bigint = BigInt(Number.MAX_SAFE_INTEGER) + 100n

            builder.storeInt(bigint, 64)

            const slice = builder.cell().slice()
            const result1 = slice.preloadBigInt(64)
            const result2 = slice.bits.length

            expect(result1).to.eq(bigint)
            expect(result2).to.eq(64)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().slice()
            const result1 = () => slice.loadBigInt(64)
            const result2 = () => slice.preloadBigInt(64)

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadVarInt(), #preloadVarInt()', () => {
        it('should load negative variable int', () => {
            const int = -14

            builder.storeVarInt(int, 4)

            const slice = builder.cell().slice()
            const result1 = slice.loadVarInt(4)
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(0)
        })

        it('should load positive variable int', () => {
            const int = 14

            builder.storeVarInt(int, 4)

            const slice = builder.cell().slice()
            const result1 = slice.loadVarInt(4)
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(0)
        })

        it('should preload negative variable int without splicing bits', () => {
            const int = -14

            builder.storeVarInt(int, 4)

            const slice = builder.cell().slice()
            const result1 = slice.preloadVarInt(4)
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(10)
        })

        it('should preload positive variable int without splicing bits', () => {
            const int = 14

            builder.storeVarInt(int, 4)

            const slice = builder.cell().slice()
            const result1 = slice.preloadVarInt(4)
            const result2 = slice.bits.length

            expect(result1).to.eq(int)
            expect(result2).to.eq(10)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().slice()
            const result1 = () => slice.loadVarInt(4)
            const result2 = () => slice.preloadVarInt(4)

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })

        it('should throw error on loading positive variable BigInt', () => {
            builder.storeVarInt(BigInt(Number.MAX_SAFE_INTEGER) + 100n, 16)

            const slice = builder.cell().slice()

            const result1 = () => slice.preloadVarInt(16)
            const result2 = () => slice.loadVarInt(16)

            expect(result1).to.throw('loaded value does not fit max/min safe integer value, use alternative BigInt methods')
            expect(result2).to.throw('loaded value does not fit max/min safe integer value, use alternative BigInt methods')
        })

        it('should throw error on loading negative variable BigInt', () => {
            builder.storeVarInt(BigInt(Number.MIN_SAFE_INTEGER) - 100n, 16)

            const slice = builder.cell().slice()

            const result1 = () => slice.preloadVarInt(16)
            const result2 = () => slice.loadVarInt(16)

            expect(result1).to.throw('loaded value does not fit max/min safe integer value, use alternative BigInt methods')
            expect(result2).to.throw('loaded value does not fit max/min safe integer value, use alternative BigInt methods')
        })
    })

    describe('#loadVarBigInt(), #preloadVarBigInt()', () => {
        it('should load negative variable bigint', () => {
            const bigint = BigInt(Number.MIN_SAFE_INTEGER) - 100n

            builder.storeVarInt(bigint, 16)

            const slice = builder.cell().slice()
            const result1 = slice.loadVarBigInt(16)
            const result2 = slice.bits.length

            expect(result1).to.eq(bigint)
            expect(result2).to.eq(0)
        })

        it('should load positive variable bigint', () => {
            const bigint = BigInt(Number.MAX_SAFE_INTEGER) + 100n

            builder.storeVarInt(bigint, 16)

            const slice = builder.cell().slice()
            const result1 = slice.loadVarBigInt(16)
            const result2 = slice.bits.length

            expect(result1).to.eq(bigint)
            expect(result2).to.eq(0)
        })

        it('should preload negative variable bigint without splicing bits', () => {
            const bigint = BigInt(Number.MIN_SAFE_INTEGER) - 100n

            builder.storeVarInt(bigint, 16)

            const slice = builder.cell().slice()
            const result1 = slice.preloadVarBigInt(16)
            const result2 = slice.bits.length

            expect(result1).to.eq(bigint)
            expect(result2).to.eq(60)
        })

        it('should preload positive variable bigint without splicing bits', () => {
            const bigint = BigInt(Number.MAX_SAFE_INTEGER) + 100n

            builder.storeVarInt(bigint, 16)

            const slice = builder.cell().slice()
            const result1 = slice.preloadVarBigInt(16)
            const result2 = slice.bits.length

            expect(result1).to.eq(bigint)
            expect(result2).to.eq(60)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().slice()
            const result1 = () => slice.loadVarBigInt(16)
            const result2 = () => slice.preloadVarBigInt(16)

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadUint(), #preloadUint()', () => {
        it('should load uint', () => {
            const uint = 14

            builder.storeUint(uint, 9)

            const slice = builder.cell().slice()
            const result1 = slice.loadUint(9)
            const result2 = slice.bits.length

            expect(result1).to.eq(uint)
            expect(result2).to.eq(0)
        })

        it('should preload uint without splicing bits', () => {
            const uint = 14

            builder.storeUint(uint, 9)

            const slice = builder.cell().slice()
            const result1 = slice.preloadUint(9)
            const result2 = slice.bits.length

            expect(result1).to.eq(uint)
            expect(result2).to.eq(9)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().slice()
            const result1 = () => slice.loadUint(9)
            const result2 = () => slice.preloadUint(9)

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })

        it('should throw error on loading BigInt', () => {
            builder.storeUint(BigInt(Number.MAX_SAFE_INTEGER) + 100n, 64)

            const slice = builder.cell().slice()

            const result1 = () => slice.preloadUint(64)
            const result2 = () => slice.loadUint(64)

            expect(result1).to.throw('loaded value does not fit max/min safe integer value, use alternative BigInt methods')
            expect(result2).to.throw('loaded value does not fit max/min safe integer value, use alternative BigInt methods')
        })
    })

    describe('#loadBigUint(), #preloadBigUint()', () => {
        it('should load biguint', () => {
            const biguint = BigInt(Number.MAX_SAFE_INTEGER) + 100n

            builder.storeUint(biguint, 64)

            const slice = builder.cell().slice()
            const result1 = slice.loadBigUint(64)
            const result2 = slice.bits.length

            expect(result1).to.eq(biguint)
            expect(result2).to.eq(0)
        })

        it('should preload biguint without splicing bits', () => {
            const biguint = BigInt(Number.MAX_SAFE_INTEGER) + 100n

            builder.storeUint(biguint, 64)

            const slice = builder.cell().slice()
            const result1 = slice.preloadBigUint(64)
            const result2 = slice.bits.length

            expect(result1).to.eq(biguint)
            expect(result2).to.eq(64)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().slice()
            const result1 = () => slice.loadBigUint(64)
            const result2 = () => slice.preloadBigUint(64)

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadVarUint(), #preloadVarUint()', () => {
        it('should load variable uint', () => {
            const uint = 14

            builder.storeVarUint(uint, 4)

            const slice = builder.cell().slice()
            const result1 = slice.loadVarUint(4)
            const result2 = slice.bits.length

            expect(result1).to.eq(uint)
            expect(result2).to.eq(0)
        })

        it('should preload variable uint without splicing bits', () => {
            const uint = 14

            builder.storeVarUint(uint, 4)

            const slice = builder.cell().slice()
            const result1 = slice.preloadVarUint(4)
            const result2 = slice.bits.length

            expect(result1).to.eq(uint)
            expect(result2).to.eq(10)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().slice()
            const result1 = () => slice.loadVarUint(4)
            const result2 = () => slice.preloadVarUint(4)

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })

        it('should throw error on loading BigInt', () => {
            builder.storeVarUint(BigInt(Number.MAX_SAFE_INTEGER) + 100n, 16)

            const slice = builder.cell().slice()

            const result1 = () => slice.preloadVarUint(16)
            const result2 = () => slice.loadVarUint(16)

            expect(result1).to.throw('loaded value does not fit max/min safe integer value, use alternative BigInt methods')
            expect(result2).to.throw('loaded value does not fit max/min safe integer value, use alternative BigInt methods')
        })
    })

    describe('#loadVarBigUint(), #preloadVarBigUint()', () => {
        it('should load variable biguint', () => {
            const biguint = BigInt(Number.MAX_SAFE_INTEGER) + 100n

            builder.storeVarUint(biguint, 16)

            const slice = builder.cell().slice()
            const result1 = slice.loadVarBigUint(16)
            const result2 = slice.bits.length

            expect(result1).to.eq(biguint)
            expect(result2).to.eq(0)
        })

        it('should preload variable biguint without splicing bits', () => {
            const biguint = BigInt(Number.MAX_SAFE_INTEGER) + 100n

            builder.storeVarUint(biguint, 16)

            const slice = builder.cell().slice()
            const result1 = slice.preloadVarBigUint(16)
            const result2 = slice.bits.length

            expect(result1).to.eq(biguint)
            expect(result2).to.eq(60)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().slice()
            const result1 = () => slice.loadVarBigUint(16)
            const result2 = () => slice.preloadVarBigUint(16)

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadBytes(), #preloadBytes()', () => {
        it('should load bytes', () => {
            const bytes = new Uint8Array([ 255, 11, 12 ])

            builder.storeBytes(bytes)

            const slice = builder.cell().slice()
            const result1 = slice.loadBytes(bytes.byteLength * 8)
            const result2 = slice.bits.length

            expect(result1).to.eql(bytes)
            expect(result2).to.eq(0)
        })

        it('should preload bytes without splicing bits', () => {
            const bytes = new Uint8Array([ 255, 11, 12 ])

            builder.storeBytes(bytes)

            const slice = builder.cell().slice()
            const result1 = slice.preloadBytes(bytes.byteLength * 8)
            const result2 = slice.bits.length

            expect(result1).to.eql(bytes)
            expect(result2).to.eq(bytes.byteLength * 8)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().slice()
            const result1 = () => slice.loadBytes(8)
            const result2 = () => slice.loadBytes(8)

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadString(), #preloadString()', () => {
        it('should load string', () => {
            const string = 'Привет, мир!'

            builder.storeString(string)

            const slice = builder.cell().slice()
            const result1 = slice.loadString()
            const result2 = slice.bits.length

            expect(result1).to.eq(string)
            expect(result2).to.eq(0)
        })

        it('should load string with size', () => {
            const string = 'Привет, мир!'
            const size = stringToBytes(string).length * 8

            builder.storeString(string)

            const slice = builder.cell().slice()
            const result1 = slice.loadString(size)
            const result2 = slice.bits.length

            expect(result1).to.eq(string)
            expect(result2).to.eq(0)
        })

        it('should preload string without splicing bits', () => {
            const string = 'Привет, мир!'
            const size = stringToBytes(string).length * 8

            builder.storeString(string)

            const slice = builder.cell().slice()
            const result1 = slice.preloadString()
            const result2 = slice.bits.length

            expect(result1).to.eq(string)
            expect(result2).to.eq(size)
        })

        it('should preload string with size without splicing bits', () => {
            const string = 'Привет, мир!'
            const size = stringToBytes(string).length * 8

            builder.storeString(string)

            const slice = builder.cell().slice()
            const result1 = slice.preloadString(size)
            const result2 = slice.bits.length

            expect(result1).to.eq(string)
            expect(result2).to.eq(size)
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().slice()
            const result1 = () => slice.loadString(2)
            const result2 = () => slice.preloadString(2)

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadAddress(), #preloadAddress()', () => {
        it('should load Address', () => {
            const raw = '-1:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260'
            const address = new Address(raw)

            builder.storeAddress(address)

            const slice = builder.cell().slice()
            const result1 = slice.loadAddress()
            const result2 = slice.bits.length

            expect(result1.toString('raw')).to.eq(raw)
            expect(result2).to.eq(0)
        })

        it('should load null Address with splicing bits', () => {
            builder.storeAddress(Address.NONE)

            const slice = builder.cell().slice()
            const result1 = slice.loadAddress()
            const result2 = slice.bits.length

            expect(result1).to.eq(Address.NONE)
            expect(result2).to.eq(0)
        })

        it('should preload Address without splicing bits', () => {
            const raw = '0:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260'
            const address = new Address(raw)

            builder.storeAddress(address)

            const slice = builder.cell().slice()
            const result1 = slice.preloadAddress()
            const result2 = slice.bits.length

            expect(result1.toString('raw')).to.eq(raw)
            expect(result2).to.eq(2 + 1 + 8 + 256)
        })

        it('should preload null Address without splicing bits', () => {
            builder.storeAddress(Address.NONE)

            const slice = builder.cell().slice()
            const result1 = slice.preloadAddress()
            const result2 = slice.bits.length

            expect(result1).to.eq(Address.NONE)
            expect(result2).to.eq(2)
        })

        it('should throw error on incorrect Address flags', () => {
            builder.storeBits([ 1, 1 ])

            const slice = builder.cell().slice()
            const result1 = () => slice.loadAddress()
            const result2 = () => slice.preloadAddress()

            expect(result1).to.throw('Slice: bad address flag bits')
            expect(result2).to.throw('Slice: bad address flag bits')
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().slice()
            const result1 = () => slice.loadAddress()
            const result2 = () => slice.preloadAddress()

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadCoins(), #preloadCoins()', () => {
        it('should load Coins', () => {
            const coins = new Coins('100.5')

            builder.storeCoins(coins)

            const slice = builder.cell().slice()
            const result1 = slice.loadCoins()
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(coins.toString())
            expect(result2).to.eq(0)
        })

        it('should load zero Coins', () => {
            const coins = new Coins('0')

            builder.storeCoins(coins)

            const slice = builder.cell().slice()
            const result1 = slice.loadCoins()
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(coins.toString())
            expect(result2).to.eq(0)
        })

        it('should load Jettons with different decimals', () => {
            const decimals = 10
            const jettons = new Coins('100.5', { decimals })

            builder.storeCoins(jettons)

            const slice = builder.cell().slice()
            const result1 = slice.loadCoins(decimals)
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(jettons.toString())
            expect(result2).to.eq(0)
        })

        it('should preload Coins without splicing bits', () => {
            const coins = new Coins('100.5')
            const size = BigInt(coins.toNano()).toString(16).length

            builder.storeCoins(coins)

            const slice = builder.cell().slice()
            const result1 = slice.preloadCoins()
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(coins.toString())
            expect(result2).to.eq(4 + (size * 4))
        })

        it('should preload zero Coins without splicing bits', () => {
            const coins = new Coins('0')

            builder.storeCoins(coins)

            const slice = builder.cell().slice()
            const result1 = slice.preloadCoins()
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(coins.toString())
            expect(result2).to.eq(4)
        })

        it('should preload Jettons with different decimals without splicing bits', () => {
            const decimals = 10
            const jettons = new Coins('100.5', { decimals })
            const size = BigInt(jettons.toNano()).toString(16).length

            builder.storeCoins(jettons)

            const slice = builder.cell().slice()
            const result1 = slice.preloadCoins(decimals)
            const result2 = slice.bits.length

            expect(result1.toString()).to.eql(jettons.toString())
            expect(result2).to.eq(4 + (size * 4))
        })

        it('should throw error on overflow', () => {
            const slice = builder.cell().slice()
            const result1 = () => slice.loadCoins()
            const result2 = () => slice.preloadCoins()

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
        })
    })

    describe('#loadDict(), #preloadDict()', () => {
        it('should load empty dict', () => {
            const dict = new HashmapE(16)
            const ref = new Cell()

            builder.storeDict(dict)
                .storeBit(1)
                .storeRef(ref)

            const slice = builder.cell().slice()
            const result = [ ...slice.loadDict(16) ]

            expect(slice.bits).to.eql([ 1 ])
            expect(slice.refs.length).to.eql(1)
            expect(slice.refs[0].eq(ref)).to.eql(true)
            expect(result).to.eql([])
        })

        it('should load non-empty dict', () => {
            const dict = new HashmapE(2)
            const ref = new Cell()

            dict.set([ 0, 0 ], ref)
            dict.set([ 0, 1 ], ref)

            builder.storeDict(dict)
                .storeBit(1)
                .storeRef(ref)

            const slice = builder.cell().slice()
            const result = [ ...slice.loadDict(2) ]

            expect(slice.bits).to.eql([ 1 ])
            expect(slice.refs.length).to.eql(1)
            expect(slice.refs[0].eq(ref)).to.eql(true)
            expect(result[0][0]).to.eql([ 0, 0 ])
            expect(result[1][0]).to.eql([ 0, 1 ])
            expect(result[0][1].eq(ref)).to.eql(true)
            expect(result[1][1].eq(ref)).to.eql(true)
        })

        it('should preload empty dict without splicing bits and refs', () => {
            const dict = new HashmapE(16)
            const ref = new Cell()

            builder.storeDict(dict)
                .storeBit(1)
                .storeRef(ref)

            const slice = builder.cell().slice()
            const result = [ ...slice.preloadDict(16) ]

            expect(slice.bits).to.eql([ 0, 1 ])
            expect(slice.refs.length).to.eql(1)
            expect(slice.refs[0].eq(ref)).to.eql(true)
            expect(result).to.eql([])
        })

        it('should preload non-empty dict without splicing bits and refs', () => {
            const dict = new HashmapE(2)
            const ref = new Cell()

            dict.set([ 0, 0 ], ref)
            dict.set([ 0, 1 ], ref)

            builder.storeDict(dict)
                .storeBit(1)
                .storeRef(ref)

            const slice = builder.cell().slice()
            const result = [ ...slice.preloadDict(2) ]

            expect(slice.bits).to.eql([ 1, 1 ])
            expect(slice.refs.length).to.eql(2)
            expect(slice.refs[1].eq(ref)).to.eql(true)
            expect(result[0][0]).to.eql([ 0, 0 ])
            expect(result[1][0]).to.eql([ 0, 1 ])
            expect(result[0][1].eq(ref)).to.eql(true)
            expect(result[1][1].eq(ref)).to.eql(true)
        })

        it('should throw error on overflow', () => {
            const result1 = () => new Cell().slice().loadDict(16)
            const result2 = () => new Cell().slice().preloadDict(16)
            const result3 = () => new Cell({ bits: [ 1 ] }).slice().loadDict(16)
            const result4 = () => new Cell({ bits: [ 1 ] }).slice().preloadDict(16)

            expect(result1).to.throw('Slice: bits overflow.')
            expect(result2).to.throw('Slice: bits overflow.')
            expect(result3).to.throw('Slice: refs overflow.')
            expect(result4).to.throw('Slice: refs overflow.')
        })
    })
})
