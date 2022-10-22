import type { Bit } from '../types/bit'
import { hexToBits } from '../utils/helpers'
import { Address } from '../address'
import { ContractLibrary } from './libraries'
import {
    Cell,
    Builder,
    HashmapE
} from '../boc'

interface ContractBaseOptions {
    workchain: number
    code: Cell
    storage?: Cell
    libraries?: ContractLibrary[]
}

interface StateInitOptions {
    code: Cell,
    storage: Cell,
    libraries: ContractLibrary[]
}

class ContractBase {
    private _state: Cell

    private _workchain: number

    private _address: Address

    constructor (options: ContractBaseOptions) {
        const {
            code,
            workchain,
            storage = null,
            libraries = []
        } = options

        this._state = ContractBase.stateInit({ code, storage, libraries })
        this._workchain = workchain
        this._address = new Address(`${this._workchain}:${this._state.hash()}`)
    }

    get workchain (): number {
        return this._workchain
    }

    get address (): Address {
        return this._address
    }

    get state (): Cell {
        return this._state
    }

    private static stateInit (options: StateInitOptions): Cell {
        const { code, storage, libraries } = options
        const builder = new Builder()

        // split_depth: 0, special: 0, code: 1
        builder.storeBits([ 0, 0, 1 ])
        builder.storeRef(code)

        if (storage !== null) {
            builder.storeBit(1)
                .storeRef(storage)
        } else {
            builder.storeBit(0)
        }

        const serializers = {
            key: (hash: string): Bit[] => hexToBits(hash),
            value: (lib: ContractLibrary): Cell => new Builder()
                .storeBit(Number(lib.isPublic) as Bit)
                .storeRef(lib.code)
                .cell()
        }

        // HashmapE 256 SimpleLib
        const dict = new HashmapE<string, ContractLibrary>(256, { serializers })

        libraries.forEach(lib => dict.set(lib.code.hash(), lib))
        builder.storeDict(dict)

        return builder.cell()
    }
}

export {
    ContractBase,
    ContractBaseOptions
}
