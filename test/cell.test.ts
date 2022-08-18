import { expect } from 'chai'
import { Cell, CellType, Builder, BOC } from '../src/boc'
import { bytesToBits } from '../src/utils/helpers'

describe('Cell', () => {
    describe('#constructor()', () => {
        it('should create new Cell', () => {
            const cell = new Cell()

            expect(cell.bits).to.eql([])
            expect(cell.refs).to.eql([])
            expect(cell.type).to.eql(CellType.Ordinary)
        })
    })

    describe('#depth()', () => {
        it('should calculate depth', () => {
            const cell1 = new Cell()
            const cell2 = new Cell({ refs: [ cell1 ] })
            const cell3 = new Cell({ refs: [ cell1, cell2 ] })
            const cell4 = new Cell({ refs: [ cell1, cell2, cell3 ] })
            const cell5 = new Cell({ refs: [ cell1, cell2, cell3, cell4 ] })
            const cell6 = new Cell({ refs: [
                new Cell({ refs: [
                    new Cell(),
                    new Cell({ refs: [
                        new Cell({ refs: [
                            new Cell()
                        ] })
                    ] }),
                ] }),
                new Cell(),
                new Cell({ refs: [
                    new Cell(),
                    new Cell({ refs: [
                        new Cell({ refs: [
                            new Cell({ refs: [
                                new Cell()
                            ] })
                        ] })
                    ] })
                ] })
            ] })

            expect(cell1.depth()).to.eql(0)
            expect(cell2.depth()).to.eql(1)
            expect(cell3.depth()).to.eql(2)
            expect(cell4.depth()).to.eql(3)
            expect(cell5.depth()).to.eql(4)
            expect(cell6.depth()).to.eql(5)
        })

        it('should calculate descriptors', () => {
            const cell1 = BOC.fromStandard('x{_}')
            const cell2 = BOC.fromStandard('x{1}')
            const cell3 = new Builder().storeBits(BOC.fromStandard('x{23}').bits).storeRef(cell2).cell()
            const cell4 = new Builder().storeBits(BOC.fromStandard('x{4567}').bits).storeRefs([ cell1, cell2, cell3 ]).cell()

            const refsDescriptorCell1 = Uint8Array.from([ 0 + 8 * 0 + 16 * 0 + 32 * 0 ])
            const refsDescriptorCell2 = Uint8Array.from([ 0 + 8 * 0 + 16 * 0 + 32 * 0 ])
            const refsDescriptorCell3 = Uint8Array.from([ 1 + 8 * 0 + 16 * 0 + 32 * 0 ])
            const refsDescriptorCell4 = Uint8Array.from([ 3 + 8 * 0 + 16 * 0 + 32 * 0 ])

            const bitsDescriptorCell1 = Uint8Array.from([ 0 ])
            const bitsDescriptorCell2 = Uint8Array.from([ 1 + 0 ])
            const bitsDescriptorCell3 = Uint8Array.from([ 1 + 1 ])
            const bitsDescriptorCell4 = Uint8Array.from([ 2 + 2 ])

            expect(cell1.getRefsDescriptor()).to.eql(bytesToBits(refsDescriptorCell1))
            expect(cell2.getRefsDescriptor()).to.eql(bytesToBits(refsDescriptorCell2))
            expect(cell3.getRefsDescriptor()).to.eql(bytesToBits(refsDescriptorCell3))
            expect(cell4.getRefsDescriptor()).to.eql(bytesToBits(refsDescriptorCell4))

            expect(cell1.getBitsDescriptor()).to.eql(bytesToBits(bitsDescriptorCell1))
            expect(cell2.getBitsDescriptor()).to.eql(bytesToBits(bitsDescriptorCell2))
            expect(cell3.getBitsDescriptor()).to.eql(bytesToBits(bitsDescriptorCell3))
            expect(cell4.getBitsDescriptor()).to.eql(bytesToBits(bitsDescriptorCell4))
        })
    })
})
