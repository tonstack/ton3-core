import { sha256 as _sha256 } from '@noble/hashes/sha256'
import { sha512 as _sha512 } from '@noble/hashes/sha512'
import { bytesToHex } from './helpers'

const sha256 = (bytes: Uint8Array): string => {
    const digest = _sha256.create()
        .update(bytes)
        .digest()

    return bytesToHex(digest)
}

const sha512 = (bytes: Uint8Array): string => {
    const digest = _sha512.create()
        .update(bytes)
        .digest()

    return bytesToHex(digest)
}

export {
    sha256,
    sha512
}
