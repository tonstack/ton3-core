import { Address } from '../address'
import {
    Builder,
    Cell
} from '../boc'

class ContractBase {
    private code: Cell

    private storage: Cell

    private _state: Cell

    private _workchain: number

    private _address: Address

    constructor (workchain: number, code: Cell, storage?: Cell) {
        this.code = code
        this.storage = storage
        this._state = this.stateInit()
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

    private stateInit (): Cell {
        const builder = new Builder()

        // split_depth: 0, special: 0, code: 1
        builder.storeBits([ 0, 0, 1 ])
        builder.storeRef(this.code)

        if (this.storage) {
            builder.storeBit(1)
            builder.storeRef(this.storage)
        } else {
            builder.storeBit(0)
        }

        // library: null (0 bit)
        builder.storeBit(0)

        return builder.cell()
    }
}

export { ContractBase }
