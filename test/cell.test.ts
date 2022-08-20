import { expect } from 'chai'
import { Bit } from '../src/types/bit'
import { Cell, CellType, Builder, BOC } from '../src/boc'
import { bytesToBits, hexToBits } from '../src/utils/helpers'

describe('Cell', () => {
    describe('#constructor()', () => {
        it('should create new ordinary cell', () => {
            const cell = new Cell()

            expect(cell.bits).to.eql([])
            expect(cell.refs).to.eql([])
            expect(cell.type).to.eq(CellType.Ordinary)
        })

        it('should create new pruned branch cell', () => {
            const mask = [ 0, 0, 0, 0, 0, 0, 0, 1 ] as Bit[]
            const zeroes = Array.from({ length: 8 + 256 + 16 }).fill(0) as Bit[]
            const cell = new Cell({ type: CellType.PrunedBranch, bits: mask.concat(zeroes) })

            expect(cell.bits).to.eql(mask.concat(zeroes))
            expect(cell.refs).to.eql([])
            expect(cell.type).to.eq(CellType.PrunedBranch)
        })

        it('should create new library reference cell', () => {
            const zeroes = Array.from({ length: 8 + 256}).fill(0) as Bit[]
            const cell = new Cell({ type: CellType.LibraryReference, bits: zeroes })

            expect(cell.bits).to.eql(zeroes)
            expect(cell.refs).to.eql([])
            expect(cell.type).to.eq(CellType.LibraryReference)
        })

        it('should create new merkle proof cell', () => {
            const ref = new Cell()
            const mask = Array.from({ length: 8 }).fill(0) as Bit[]
            const hash = hexToBits('96a296d224f285c67bee93c30f8a309157f0daa35dc5b87e410b78630a09cfc7')
            const depth = Array.from({ length: 16 }).fill(0) as Bit[]
            const cell = new Cell({ type: CellType.MerkleProof, bits: mask.concat(hash, depth), refs: [ ref ] })

            expect(cell.bits).to.eql(mask.concat(hash, depth))
            expect(cell.refs.length).to.eq(1)
            expect(cell.refs[0].eq(ref)).to.eq(true)
            expect(cell.type).to.eq(CellType.MerkleProof)
        })

        it('should create new merkle update cell', () => {
            const ref = new Cell()
            const mask = Array.from({ length: 8 }).fill(0) as Bit[]
            const hash = hexToBits('96a296d224f285c67bee93c30f8a309157f0daa35dc5b87e410b78630a09cfc7')
            const depth = Array.from({ length: 16 }).fill(0) as Bit[]
            const cell = new Cell({ type: CellType.MerkleUpdate, bits: mask.concat(hash, hash, depth, depth), refs: [ ref, ref ] })

            expect(cell.bits).to.eql(mask.concat(hash, hash, depth, depth))
            expect(cell.refs.length).to.eq(2)
            expect(cell.refs[0].eq(ref)).to.eq(true)
            expect(cell.refs[1].eq(ref)).to.eq(true)
            expect(cell.type).to.eq(CellType.MerkleUpdate)
        })

        it('should throw errors on bad cell type', () => {
            const result1 = () => new Cell({ type: 0 })
            const result2 = () => new Cell({ type: 255 })

            expect(result1).to.throw('Unknown cell type')
            expect(result2).to.throw('Unknown cell type')
        })

        it('should throw errors on bad ordinary cell', () => {
            const result1 = () => new Cell({ type: CellType.Ordinary, bits: Array.from({ length: 1024 }) })
            const result2 = () => new Cell({ type: CellType.Ordinary, refs: Array.from({ length: 5 }) })

            expect(result1).to.throw('Ordinary cell can\'t has more than 1023 bits')
            expect(result2).to.throw('Ordinary cell can\'t has more than 4 refs')
        })

        it('should throw errors on bad pruned branch cell', () => {
            const result1 = () => new Cell({ type: CellType.PrunedBranch })
            const result2 = () => new Cell({ type: CellType.PrunedBranch, bits: Array.from({ length: 16 }), refs: Array.from({ length: 1 }) })
            const result3 = () => new Cell({ type: CellType.PrunedBranch, bits: Array.from({ length: 16 }).fill(0) as Bit[] })
            const result4 = () => new Cell({ type: CellType.PrunedBranch, bits: Array.from({ length: 16 }).fill(1) as Bit[] })

            expect(result1).to.throw('Pruned Branch cell can\'t has less than 16 bits')
            expect(result2).to.throw('Pruned Branch cell can\'t has refs')
            expect(result3).to.throw('Pruned Branch has an invalid level')
            expect(result4).to.throw('Pruned Branch has an invalid data')
        })

        it('should throw errors on bad library reference cell', () => {
            const result1 = () => new Cell({ type: CellType.LibraryReference })
            const result2 = () => new Cell({ type: CellType.LibraryReference, bits: Array.from({ length: 8 + 256 }), refs: Array.from({ length: 1 }) })

            expect(result1).to.throw('Library reference has an invalid data')
            expect(result2).to.throw('Library reference has an invalid refs')
        })

        it('should throw errors on bad merkle proof cell', () => {
            const cell = new Cell()
            const zeroes = Array.from({ length: 8 + 256 + 16 }).fill(0) as Bit[]
            const mask = Array.from({ length: 8 }).fill(0) as Bit[]
            const hash = hexToBits('96a296d224f285c67bee93c30f8a309157f0daa35dc5b87e410b78630a09cfc7')
            const depth = Array.from({ length: 16 }).fill(1) as Bit[]

            const result1 = () => new Cell({ type: CellType.MerkleProof })
            const result2 = () => new Cell({ type: CellType.MerkleProof, bits: zeroes })
            const result3 = () => new Cell({ type: CellType.MerkleProof, bits: zeroes, refs: [ cell ] })
            const result4 = () => new Cell({ type: CellType.MerkleProof, bits: mask.concat(hash, depth), refs: [ cell ] })

            expect(result1).to.throw('Merkle Proof has an invalid data')
            expect(result2).to.throw('Merkle Proof has an invalid refs')
            expect(result3).to.throw('Merkle Proof hash mismatch')
            expect(result4).to.throw('Merkle Proof depth mismatch')
        })

        it('should throw errors on bad merkle update cell', () => {
            const cell = new Cell()
            const mask = Array.from({ length: 8 }).fill(0) as Bit[]
            const zeroes = Array.from({ length: 8 + (256 + 16) * 2 }).fill(0) as Bit[]
            const hash = hexToBits('96a296d224f285c67bee93c30f8a309157f0daa35dc5b87e410b78630a09cfc7')
            const hashBad = Array.from({ length: 256 }).fill(0) as Bit[]
            const depth = Array.from({ length: 16 }).fill(0) as Bit[]
            const depthBad = Array.from({ length: 16 }).fill(1) as Bit[]

            const result1 = () => new Cell({ type: CellType.MerkleUpdate })
            const result2 = () => new Cell({ type: CellType.MerkleUpdate, bits: zeroes })
            const result3 = () => new Cell({ type: CellType.MerkleUpdate, bits: mask.concat(hashBad, hashBad, depth, depthBad), refs: [ cell, cell ] })
            const result4 = () => new Cell({ type: CellType.MerkleUpdate, bits: mask.concat(hash, hashBad, depth, depthBad), refs: [ cell, cell ] })
            const result5 = () => new Cell({ type: CellType.MerkleUpdate, bits: mask.concat(hash, hash, depthBad, depthBad), refs: [ cell, cell ] })
            const result6 = () => new Cell({ type: CellType.MerkleUpdate, bits: mask.concat(hash, hash, depth, depthBad), refs: [ cell, cell ] })

            expect(result1).to.throw('Merkle Update has an invalid data')
            expect(result2).to.throw('Merkle Update has an invalid refs')
            expect(result3).to.throw('Merkle Update ref #0 hash mismatch')
            expect(result4).to.throw('Merkle Update ref #1 hash mismatch')
            expect(result5).to.throw('Merkle Update ref #0 depth mismatch')
            expect(result6).to.throw('Merkle Update ref #1 depth mismatch')
        })
    })

    describe('#initialize()', () => {
        it('should throw error on reaching max depth limit', () => {
            const result = () => Array.from({ length: 1025 }).reduce<Cell>((acc) => {
                return new Cell({ refs: [ acc ] })
            }, new Cell())

            expect(result).to.throw('Cell depth can\'t be more than 1024')
        })
    })

    describe('#getRefsDescriptor()', () => {
        it('should calculate refs descriptor', () => {
            const cell1 = BOC.fromStandard('x{_}')
            const cell2 = BOC.fromStandard('x{1}')
            const cell3 = new Builder().storeBits(BOC.fromStandard('x{23}').bits).storeRef(cell2).cell()
            const cell4 = new Builder().storeBits(BOC.fromStandard('x{4567}').bits).storeRefs([ cell1, cell2, cell3 ]).cell()

            const refsDescriptorCell1 = Uint8Array.from([ 0 + 8 * 0 + 16 * 0 + 32 * 0 ])
            const refsDescriptorCell2 = Uint8Array.from([ 0 + 8 * 0 + 16 * 0 + 32 * 0 ])
            const refsDescriptorCell3 = Uint8Array.from([ 1 + 8 * 0 + 16 * 0 + 32 * 0 ])
            const refsDescriptorCell4 = Uint8Array.from([ 3 + 8 * 0 + 16 * 0 + 32 * 0 ])

            expect(cell1.getRefsDescriptor()).to.eql(bytesToBits(refsDescriptorCell1))
            expect(cell2.getRefsDescriptor()).to.eql(bytesToBits(refsDescriptorCell2))
            expect(cell3.getRefsDescriptor()).to.eql(bytesToBits(refsDescriptorCell3))
            expect(cell4.getRefsDescriptor()).to.eql(bytesToBits(refsDescriptorCell4))
        })
    })

    describe('#getBitsDescriptor()', () => {
        it('should calculate bits descriptor', () => {
            const cell1 = BOC.fromStandard('x{_}')
            const cell2 = BOC.fromStandard('x{1}')
            const cell3 = new Builder().storeBits(BOC.fromStandard('x{23}').bits).storeRef(cell2).cell()
            const cell4 = new Builder().storeBits(BOC.fromStandard('x{4567}').bits).storeRefs([ cell1, cell2, cell3 ]).cell()

            const bitsDescriptorCell1 = Uint8Array.from([ 0 ])
            const bitsDescriptorCell2 = Uint8Array.from([ 1 + 0 ])
            const bitsDescriptorCell3 = Uint8Array.from([ 1 + 1 ])
            const bitsDescriptorCell4 = Uint8Array.from([ 2 + 2 ])

            expect(cell1.getBitsDescriptor()).to.eql(bytesToBits(bitsDescriptorCell1))
            expect(cell2.getBitsDescriptor()).to.eql(bytesToBits(bitsDescriptorCell2))
            expect(cell3.getBitsDescriptor()).to.eql(bytesToBits(bitsDescriptorCell3))
            expect(cell4.getBitsDescriptor()).to.eql(bytesToBits(bitsDescriptorCell4))
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
    })

    describe('#eq()', () => {
        it('should check hash equality', () => {
            const cell1 = new Cell({ bits: [ 1, 0, 1 ] })
            const cell2 = new Cell({ bits: [ 1, 0, 1 ] })
            const cell3 = new Cell({ refs: [ cell1 ] })
            const cell4 = new Cell({ refs: [ cell2 ] })

            expect(cell1.eq(cell2)).to.eq(true)
            expect(cell1.eq(cell3)).to.eq(false)
            expect(cell3.eq(cell4)).to.eq(true)
        })
    })
})
