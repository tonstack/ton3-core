/* eslint-disable max-classes-per-file */
import nacl from 'tweetnacl'
import { Coins } from '../coins'
import { Address } from '../address'
import { hexToBytes } from '../utils/helpers'
import {
    Builder,
    Cell
} from '../boc'

interface MessageInternalOptions {
    ihrDisabled?: boolean // optional, because it is not currently implemented in TON
    bounce: boolean // bounce flag
    bounced?: boolean
    src: Address
    dest: Address
    value: Coins // now is Coins, in future maybe CurrencyCollection
    ihrFee?: Coins
    fwdFee?: Coins
    createdLt?: number
    createdAt?: number
}

interface MessageExternalInOptions {
    src?: Address
    dest?: Address
    importFee?: Coins
}

interface MessageData {
    body?: Cell,
    state?: Cell
}

class Message {
    private header: Cell

    private body: Cell

    private state: Cell

    constructor (header: Cell, body: Cell = null, state: Cell = null) {
        this.header = header
        this.body = body
        this.state = state
    }

    private parse (key?: Uint8Array): Cell {
        const message = new Builder()
        const body = this.body !== null && key !== undefined
            ? Message.signed(this.body, key)
            : this.body

        message.storeSlice(this.header.slice())

        if (this.state !== null) {
            message.storeBit(1)

            if (
                // We need at least 1 bit for the body
                message.remainder >= (this.state.bits.length + 1)
                && (message.refs.length + this.state.refs.length) <= 4
            ) {
                message.storeBit(0)
                    .storeSlice(this.state.slice())
            } else {
                message.storeBit(1)
                    .storeRef(this.state)
            }
        } else {
            message.storeBit(0)
        }

        if (body) {
            if (
                message.remainder >= body.bits.length
                && message.refs.length + body.refs.length <= 4
            ) {
                message.storeBit(0)
                    .storeSlice(body.slice())
            } else {
                message.storeBit(1)
                    .storeRef(body)
            }
        } else {
            message.storeBit(0)
        }

        return message.cell()
    }

    private static signed (data: Cell, key: Uint8Array): Cell {
        const hash = hexToBytes(data.hash())
        const signature = nacl.sign.detached(hash, key)

        return new Builder()
            .storeBytes(signature)
            .storeSlice(data.slice())
            .cell()
    }

    public sign (key: Uint8Array): Cell {
        return this.parse(key)
    }

    public cell (): Cell {
        return this.parse()
    }
}

// int_msg_info$0
class MessageInternal extends Message {
    constructor (options: MessageInternalOptions, data?: MessageData) {
        const builder = new Builder()
        const {
            ihrDisabled = true,
            bounce,
            bounced = false,
            src,
            dest,
            value,
            ihrFee = new Coins(0),
            fwdFee = new Coins(0),
            createdLt = 0,
            createdAt = 0
        } = options

        const { body = null, state = null } = data

        const header = builder
            .storeBit(0) // int_msg_info$0
            .storeInt(ihrDisabled ? -1 : 0, 1) // ihr_disabled; true: -1
            .storeInt(bounce ? -1 : 0, 1)
            .storeInt(bounced ? -1 : 0, 1)
            .storeAddress(src)
            .storeAddress(dest)
            .storeCoins(value)
            .storeBit(0) // empty ExtraCurrencyCollection dict is 0 bit
            .storeCoins(ihrFee)
            .storeCoins(fwdFee)
            .storeUint(createdLt, 64)
            .storeUint(createdAt, 32)
            .cell()

        super(header, body, state)
    }
}

// ext_in_msg_info$10
class MessageExternalIn extends Message {
    constructor (options: MessageExternalInOptions, data?: MessageData) {
        const builder = new Builder()
        const {
            src = Address.NONE,
            dest = Address.NONE,
            importFee = new Coins(0)
        } = options

        const { body = null, state = null } = data

        const header = builder
            .storeBits([ 1, 0 ]) // ext_in_msg_info$10
            .storeAddress(src)
            .storeAddress(dest)
            .storeCoins(importFee)
            .cell()

        super(header, body, state)
    }
}

// class MessageExternalOut extends Message {
//      TODO: implement
// }

export {
    MessageInternal,
    MessageExternalIn
}
