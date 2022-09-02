import { expect } from 'chai'
import { Cell } from '../src/boc'
import {
    ContractBase,
    ContractLibrary
} from '../src/contracts'

describe('Contract Base', () => {
    describe('#constructor()', () => {
        it('should create base contract', () => {
            const code = new Cell()
            const result = () => new ContractBase({ workchain: 0, code })

            expect(result).not.to.throw()
        })

        it('should create base contract with storage', () => {
            const code = new Cell()
            const storage = new Cell()
            const result = () => new ContractBase({ workchain: -1, code, storage })

            expect(result).not.to.throw()
        })

        it('should create base contract with library', () => {
            const code = new Cell()
            const library = new ContractLibrary(ContractLibrary.EmptyCode, true)
            const result = () => new ContractBase({ workchain: -1, code, libraries: [ library ] })

            expect(result).not.to.throw()
        })
    })

    describe('#workchain', () => {
        it('should get workchain', () => {
            const code = new Cell()
            const contract1 = new ContractBase({ workchain: 0, code })
            const contract2 = new ContractBase({ workchain: -1, code })

            expect(contract1.workchain).to.equal(0)
            expect(contract2.workchain).to.equal(-1)
        })
    })

    describe('#address', () => {
        it('should get address', () => {
            const code = new Cell()
            const contract1 = new ContractBase({ workchain: 0, code })
            const contract2 = new ContractBase({ workchain: -1, code })

            expect(contract1.address.toString('raw')).to.equal('0:EB1AAAA9F9843882CB288E99B96CA1637F78756C4EE82BD8189A1ED2A562F661')
            expect(contract2.address.toString('raw')).to.equal('-1:EB1AAAA9F9843882CB288E99B96CA1637F78756C4EE82BD8189A1ED2A562F661')
        })
    })

    describe('#state', () => {
        it('should get state', () => {
            const code = new Cell()
            const contract = new ContractBase({ workchain: 0, code })

            expect(contract.state.bits).to.eql([ 0, 0, 1, 0, 0 ])
        })
    })
})

describe('Contract Librariy', () => {
    describe('#constructor()', () => {
        it('should create contract library', () => {
            const code = ContractLibrary.EmptyCode
            const result = () => new ContractLibrary(code, true)

            expect(result).not.to.throw()
        })
    })

    describe('#code', () => {
        it('should get code', () => {
            const code = ContractLibrary.EmptyCode
            const library = new ContractLibrary(code, true)

            expect(library.code.eq(code)).to.equal(true)
        })
    })

    describe('#isPublic', () => {
        it('should get isPublic', () => {
            const code = ContractLibrary.EmptyCode
            const library = new ContractLibrary(code, false)

            expect(library.isPublic).to.equal(false)
        })
    })
})
