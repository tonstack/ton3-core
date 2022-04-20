import { Bit } from 'types/bit'
import { hexToBits } from 'utils/helpers'
import { Address } from '../address'
import {
    BOC,
    Builder,
    Cell,
    HashmapE
} from '../boc'

interface Library {
    public: boolean
    library: Cell
}

interface StateInitOptions {
    code: Cell,
    storage?: Cell,
    libraries?: Library[]
}

class ContractBase {
    private _state: Cell

    private _workchain: number

    private _address: Address

    /*
        Empty code can be usefull for
        masterchain lib contracts

        <{  SETCP0 ACCEPT
            NEWC ENDC SETCODE
        }>c 2 boc+>B Bx. cr
    */
    public static EMPTY_CODE: Cell = BOC.fromStandard('B5EE9C7241010101000A000010FF00F800C8C9FB041D179D63')

    constructor (workchain: number, code: Cell, storage?: Cell) {
        this._state = ContractBase.stateInit({ code, storage })
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

    // private static stateInit (code: Cell, storage?: Cell): Cell {
    private static stateInit (options: StateInitOptions): Cell {
        const { code, storage, libraries } = options
        const builder = new Builder()

        // split_depth: 0, special: 0, code: 1
        builder.storeBits([ 0, 0, 1 ])
        builder.storeRef(code)

        if (storage) {
            builder.storeBit(1).storeRef(storage)
        } else {
            builder.storeBit(0)
        }

        const serializers = {
            key: (bits: Bit[]): Bit[] => bits,
            value: (lib: Library): Cell => new Builder()
                .storeBit(<Bit><any>lib.public)
                .storeRef(lib.library).cell()
        }

        // HashmapE 256 SimpleLib
        const dict = new HashmapE<Bit[], Library>(256, { serializers })
        libraries.forEach((lib) => { dict.set(hexToBits(lib.library.hash()), lib) })

        builder.storeDict(dict)

        return builder.cell()
    }
}

export { ContractBase, Library, StateInitOptions }
