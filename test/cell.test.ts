import type { Bit } from '../src/types/bit'
import { expect } from 'chai'
import { Cell, CellType, Builder, Slice, BOC } from '../src/boc'
import { bytesToBits, hexToBits } from '../src/utils/helpers'

describe('Cell', () => {
    const TYPE_BITS_ORDINARY = [ 1, 1, 1, 1, 1, 1, 1, 1 ] as Bit[]
    const TYPE_BITS_PRUNED_BRANCH = [ 0, 0, 0, 0, 0, 0, 0, 1 ] as Bit[]
    const TYPE_BITS_LIBRARY_REFERENCE = [ 0, 0, 0, 0, 0, 0, 1, 0 ] as Bit[]
    const TYPE_BITS_MERKLE_PROOF = [ 0, 0, 0, 0, 0, 0, 1, 1 ] as Bit[]
    const TYPE_BITS_MERKLE_UPDATE = [ 0, 0, 0, 0, 0, 1, 0, 0 ] as Bit[]
    const MASK_LEVEL_0 = [ 0, 0, 0, 0, 0, 0, 0, 0 ] as Bit[]
    const MASK_LEVEL_1 = [ 0, 0, 0, 0, 0, 0, 0, 1 ] as Bit[]
    const MASK_LEVEL_2 = [ 0, 0, 0, 0, 0, 0, 1, 1 ] as Bit[]
    const MASK_LEVEL_3 = [ 0, 0, 0, 0, 0, 1, 1, 1 ] as Bit[]
    const MASK_LEVEL_4 = [ 0, 0, 0, 0, 1, 1, 1, 1 ] as Bit[]
    const CELL_EMPTY = new Cell()
    const CELL_HASH_EMPTY = hexToBits('96a296d224f285c67bee93c30f8a309157f0daa35dc5b87e410b78630a09cfc7')
    const CELL_HASH_INVALID = Array.from({ length: 256 }).fill(0) as Bit[]
    const CELL_DEPTH_0 = Array.from({ length: 16 }).fill(0) as Bit[]
    const CELL_DEPTH_1 = Array.from({ length: 15 }).fill(0).concat([ 1 ]) as Bit[]


    describe('#constructor()', () => {
        it('should create new ordinary cell', () => {
            const cell = new Cell()

            expect(cell.bits).to.eql([])
            expect(cell.refs).to.eql([])
            expect(cell.type).to.eq(CellType.Ordinary)
        })

        it('should create new pruned branch cell', () => {
            const bits = [].concat(TYPE_BITS_PRUNED_BRANCH, MASK_LEVEL_1, CELL_HASH_EMPTY, CELL_DEPTH_0)
            const cell = new Cell({ type: CellType.PrunedBranch, bits })

            expect(cell.bits).to.eql(bits)
            expect(cell.refs).to.eql([])
            expect(cell.type).to.eq(CellType.PrunedBranch)
        })

        it('should create new library reference cell', () => {
            const bits = [].concat(TYPE_BITS_LIBRARY_REFERENCE, CELL_HASH_EMPTY)
            const cell = new Cell({ type: CellType.LibraryReference, bits })

            expect(cell.bits).to.eql(bits)
            expect(cell.refs).to.eql([])
            expect(cell.type).to.eq(CellType.LibraryReference)
        })

        it('should create new merkle proof cell', () => {
            const bits = [].concat(TYPE_BITS_MERKLE_PROOF, CELL_HASH_EMPTY, CELL_DEPTH_0)
            const cell = new Cell({ type: CellType.MerkleProof, bits, refs: [ CELL_EMPTY ] })

            expect(cell.bits).to.eql(bits)
            expect(cell.refs.length).to.eq(1)
            expect(cell.refs[0].eq(CELL_EMPTY)).to.eq(true)
            expect(cell.type).to.eq(CellType.MerkleProof)
        })

        it('should create new merkle update cell', () => {
            const bits = [].concat(TYPE_BITS_MERKLE_UPDATE, CELL_HASH_EMPTY, CELL_HASH_EMPTY, CELL_DEPTH_0, CELL_DEPTH_0)
            const cell = new Cell({ type: CellType.MerkleUpdate, bits, refs: [ CELL_EMPTY, CELL_EMPTY ] })

            expect(cell.bits).to.eql(bits)
            expect(cell.refs.length).to.eq(2)
            expect(cell.refs[0].eq(CELL_EMPTY)).to.eq(true)
            expect(cell.refs[1].eq(CELL_EMPTY)).to.eq(true)
            expect(cell.type).to.eq(CellType.MerkleUpdate)
        })

        it('should throw errors on bad cell type', () => {
            const result1 = () => new Cell({ type: 0 })
            const result2 = () => new Cell({ type: 127 })
            const result3 = () => new Cell({ type: -127 })

            expect(result1).to.throw('Unknown cell type')
            expect(result2).to.throw('Unknown cell type')
            expect(result3).to.throw('Unknown cell type')
        })

        it('should throw errors on bad ordinary cell', () => {
            const result1 = () => new Cell({ type: CellType.Ordinary, bits: Array.from({ length: 1024 }) })
            const result2 = () => new Cell({ type: CellType.Ordinary, refs: Array.from({ length: 5 }) })

            expect(result1).to.throw(`Ordinary cell can't has more than 1023 bits, got "1024"`)
            expect(result2).to.throw(`Ordinary cell can't has more than 4 refs, got "5"`)
        })

        it('should throw errors on bad pruned branch cell', () => {
            const result1 = () => new Cell({ type: CellType.PrunedBranch })
            const result2 = () => new Cell({ type: CellType.PrunedBranch, bits: [].concat(TYPE_BITS_PRUNED_BRANCH, MASK_LEVEL_1, CELL_HASH_EMPTY, CELL_DEPTH_0), refs: [ CELL_EMPTY ] })
            const result3 = () => new Cell({ type: CellType.PrunedBranch, bits: [].concat(TYPE_BITS_ORDINARY, MASK_LEVEL_1, CELL_HASH_EMPTY, CELL_DEPTH_0) })
            const result4 = () => new Cell({ type: CellType.PrunedBranch, bits: [].concat(TYPE_BITS_PRUNED_BRANCH, MASK_LEVEL_0, CELL_HASH_EMPTY, CELL_DEPTH_0) })
            const result5 = () => new Cell({ type: CellType.PrunedBranch, bits: [].concat(TYPE_BITS_PRUNED_BRANCH, MASK_LEVEL_4, CELL_HASH_EMPTY, CELL_DEPTH_0) })
            const result6 = () => new Cell({ type: CellType.PrunedBranch, bits: [].concat(TYPE_BITS_PRUNED_BRANCH, MASK_LEVEL_1, CELL_HASH_EMPTY, CELL_DEPTH_0, [ 0 ]) })
            const result7 = () => new Cell({ type: CellType.PrunedBranch, bits: [].concat(TYPE_BITS_PRUNED_BRANCH, MASK_LEVEL_2, CELL_HASH_EMPTY, CELL_DEPTH_0) })
            const result8 = () => new Cell({ type: CellType.PrunedBranch, bits: [].concat(TYPE_BITS_PRUNED_BRANCH, MASK_LEVEL_3, CELL_HASH_EMPTY, CELL_DEPTH_0) })

            expect(result1).to.throw(`Pruned Branch cell can't has less than (8 + 8 + 256 + 16) bits, got "0"`)
            expect(result2).to.throw(`Pruned Branch cell can't has refs, got "1"`)
            expect(result3).to.throw(`Pruned Branch cell type must be exactly 1, got "-1"`)
            expect(result4).to.throw(`Pruned Branch cell level must be >= 1 and <= 3, got "0"`)
            expect(result5).to.throw(`Pruned Branch cell level must be >= 1 and <= 3, got "4"`)
            expect(result6).to.throw(`Pruned Branch cell with level "1" must have exactly 288 bits, got "289"`)
            expect(result7).to.throw(`Pruned Branch cell with level "2" must have exactly 560 bits, got "288"`)
            expect(result8).to.throw(`Pruned Branch cell with level "3" must have exactly 832 bits, got "288"`)
        })

        it('should throw errors on bad library reference cell', () => {
            const result1 = () => new Cell({ type: CellType.LibraryReference })
            const result2 = () => new Cell({ type: CellType.LibraryReference, bits: [].concat(TYPE_BITS_LIBRARY_REFERENCE, CELL_HASH_EMPTY), refs: [ CELL_EMPTY ] })
            const result3 = () => new Cell({ type: CellType.LibraryReference, bits: [].concat(TYPE_BITS_ORDINARY, CELL_HASH_EMPTY) })

            expect(result1).to.throw(`Library Reference cell must have exactly (8 + 256) bits, got "0"`)
            expect(result2).to.throw(`Library Reference cell can't has refs, got "1"`)
            expect(result3).to.throw(`Library Reference cell type must be exactly 2, got "-1"`)
        })

        it('should throw errors on bad merkle proof cell', () => {
            const result1 = () => new Cell({ type: CellType.MerkleProof })
            const result2 = () => new Cell({ type: CellType.MerkleProof, bits: [].concat(TYPE_BITS_MERKLE_PROOF, CELL_HASH_EMPTY, CELL_DEPTH_0) })
            const result3 = () => new Cell({ type: CellType.MerkleProof, bits: [].concat(TYPE_BITS_ORDINARY, CELL_HASH_EMPTY, CELL_DEPTH_0), refs: [ CELL_EMPTY ] })
            const result4 = () => new Cell({ type: CellType.MerkleProof, bits: [].concat(TYPE_BITS_MERKLE_PROOF, CELL_HASH_INVALID, CELL_DEPTH_0), refs: [ CELL_EMPTY ]  })
            const result5 = () => new Cell({ type: CellType.MerkleProof, bits: [].concat(TYPE_BITS_MERKLE_PROOF, CELL_HASH_EMPTY, CELL_DEPTH_1), refs: [ CELL_EMPTY ]  })

            expect(result1).to.throw(`Merkle Proof cell must have exactly (8 + 256 + 16) bits, got "0"`)
            expect(result2).to.throw(`Merkle Proof cell must have exactly 1 ref, got "0"`)
            expect(result3).to.throw(`Merkle Proof cell type must be exactly 3, got "-1"`)
            expect(result4).to.throw(`Merkle Proof cell ref hash must be exactly "0000000000000000000000000000000000000000000000000000000000000000", got "96a296d224f285c67bee93c30f8a309157f0daa35dc5b87e410b78630a09cfc7"`)
            expect(result5).to.throw(`Merkle Proof cell ref depth must be exactly "1", got "0"`)
        })

        it('should throw errors on bad merkle update cell', () => {
            const result1 = () => new Cell({ type: CellType.MerkleUpdate })
            const result2 = () => new Cell({ type: CellType.MerkleUpdate, bits: [].concat(TYPE_BITS_MERKLE_UPDATE, CELL_HASH_EMPTY, CELL_HASH_EMPTY, CELL_DEPTH_0, CELL_DEPTH_0) })
            const result3 = () => new Cell({ type: CellType.MerkleUpdate, bits: [].concat(TYPE_BITS_ORDINARY, CELL_HASH_EMPTY, CELL_HASH_EMPTY, CELL_DEPTH_0, CELL_DEPTH_0), refs: [ CELL_EMPTY, CELL_EMPTY ] })
            const result4 = () => new Cell({ type: CellType.MerkleUpdate, bits: [].concat(TYPE_BITS_MERKLE_UPDATE, CELL_HASH_INVALID, CELL_HASH_EMPTY, CELL_DEPTH_0, CELL_DEPTH_0), refs: [ CELL_EMPTY, CELL_EMPTY ]  })
            const result5 = () => new Cell({ type: CellType.MerkleUpdate, bits: [].concat(TYPE_BITS_MERKLE_UPDATE, CELL_HASH_EMPTY, CELL_HASH_EMPTY, CELL_DEPTH_1, CELL_DEPTH_0), refs: [ CELL_EMPTY, CELL_EMPTY ]  })
            const result6 = () => new Cell({ type: CellType.MerkleUpdate, bits: [].concat(TYPE_BITS_MERKLE_UPDATE, CELL_HASH_EMPTY, CELL_HASH_INVALID, CELL_DEPTH_0, CELL_DEPTH_0), refs: [ CELL_EMPTY, CELL_EMPTY ]  })
            const result7 = () => new Cell({ type: CellType.MerkleUpdate, bits: [].concat(TYPE_BITS_MERKLE_UPDATE, CELL_HASH_EMPTY, CELL_HASH_EMPTY, CELL_DEPTH_0, CELL_DEPTH_1), refs: [ CELL_EMPTY, CELL_EMPTY ]  })

            expect(result1).to.throw(`Merkle Update cell must have exactly (8 + (2 * (256 + 16))) bits, got "0"`)
            expect(result2).to.throw(`Merkle Update cell must have exactly 2 refs, got "0"`)
            expect(result3).to.throw(`Merkle Update cell type must be exactly 4, got "-1"`)
            expect(result4).to.throw(`Merkle Update cell ref #0 hash must be exactly "0000000000000000000000000000000000000000000000000000000000000000", got "96a296d224f285c67bee93c30f8a309157f0daa35dc5b87e410b78630a09cfc7"`)
            expect(result5).to.throw(`Merkle Update cell ref #0 depth must be exactly "1", got "0"`)
            expect(result6).to.throw(`Merkle Update cell ref #1 hash must be exactly "0000000000000000000000000000000000000000000000000000000000000000", got "96a296d224f285c67bee93c30f8a309157f0daa35dc5b87e410b78630a09cfc7"`)
            expect(result7).to.throw(`Merkle Update cell ref #1 depth must be exactly "1", got "0"`)
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

    describe('#slice()', () => {
        it('should create slice', () => {
            const cell = new Cell({ bits: [ 1, 1 ], refs: [] })
            const slice = cell.slice()

            expect(slice instanceof Slice).to.eql(true)
            expect(slice.bits).to.eql([ 1, 1 ])
            expect(slice.refs).to.eql([])
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
