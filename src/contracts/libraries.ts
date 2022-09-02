import {
    BOC,
    Cell
} from '../boc'

/*
    Empty code can be usefull for
    masterchain lib contracts

    <{  SETCP0 ACCEPT
        NEWC ENDC SETCODE
    }>c 2 boc+>B Bx. cr
*/
const EMPTY_CODE = BOC.fromStandard('B5EE9C7241010101000A000010FF00F800C8C9FB041D179D63')

class ContractLibrary {
    public readonly code: Cell

    public readonly isPublic: boolean

    constructor (code: Cell, isPublic: boolean) {
        this.code = code
        this.isPublic = isPublic
    }

    public static get EmptyCode (): Cell {
        return EMPTY_CODE
    }
}

export { ContractLibrary }
