import { Address } from '../address'
import {
    Builder,
    Cell
} from '../boc'

class ContractBase {
    private _state: Cell

    private _workchain: number

    private _address: Address

    constructor (workchain: number, code: Cell, storage?: Cell) {
        this._state = ContractBase.stateInit(code, storage)
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

    private static stateInit (code: Cell, storage?: Cell): Cell {
        const builder = new Builder()

        // split_depth: 0, special: 0, code: 1
        builder.storeBits([ 0, 0, 1 ])
        builder.storeRef(code)

        if (storage) {
            builder.storeBit(1)
            builder.storeRef(storage)
        } else {
            builder.storeBit(0)
        }

        // library: null (0 bit)
        builder.storeBit(0)

        return builder.cell()
    }
}

export { ContractBase }
