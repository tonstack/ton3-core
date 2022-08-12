ton3-core

# ton3-core

## Table of contents

### Type aliases

- [AddressType](README.md#addresstype)
- [Bit](README.md#bit)

### Classes

- [Address](classes/Address.md)
- [Builder](classes/Builder.md)
- [Cell](classes/Cell.md)
- [Hashmap](classes/Hashmap.md)
- [HashmapE](classes/HashmapE.md)
- [BOC](classes/BOC.md)
- [Slice](classes/Slice.md)
- [Coins](classes/Coins.md)
- [ContractBase](classes/ContractBase.md)
- [MessageInternal](classes/MessageInternal.md)
- [MessageExternalIn](classes/MessageExternalIn.md)
- [Mnemonic](classes/Mnemonic.md)

### Interfaces

- [HashmapOptions](interfaces/HashmapOptions.md)
- [BOCOptions](interfaces/BOCOptions.md)
- [CoinsOptions](interfaces/CoinsOptions.md)
- [StateInitOptions](interfaces/StateInitOptions.md)
- [KeyPair](interfaces/KeyPair.md)

### Functions

- [deserializeFift](README.md#deserializefift)
- [deserialize](README.md#deserialize)
- [serialize](README.md#serialize)
- [augment](README.md#augment)
- [rollback](README.md#rollback)
- [crc16](README.md#crc16)
- [crc16BytesBe](README.md#crc16bytesbe)
- [crc32c](README.md#crc32c)
- [crc32cBytesLe](README.md#crc32cbytesle)
- [sha256](README.md#sha256)
- [sha512](README.md#sha512)
- [uint8toInt8](README.md#uint8toint8)
- [int8ToUint8](README.md#int8touint8)
- [uintToHex](README.md#uinttohex)
- [hexToBits](README.md#hextobits)
- [hexToBytes](README.md#hextobytes)
- [bytesToUint](README.md#bytestouint)
- [bytesCompare](README.md#bytescompare)
- [bytesToBits](README.md#bytestobits)
- [bitsToHex](README.md#bitstohex)
- [bitsToBytes](README.md#bitstobytes)
- [bitsToInt8](README.md#bitstoint8)
- [bytesToHex](README.md#bytestohex)
- [bytesToString](README.md#bytestostring)
- [stringToBytes](README.md#stringtobytes)
- [bytesToBase64](README.md#bytestobase64)
- [base64ToBytes](README.md#base64tobytes)
- [sliceIntoChunks](README.md#sliceintochunks)

## Type aliases

### AddressType

Ƭ **AddressType**: ``"base64"`` \| ``"raw"``

___

### Bit

Ƭ **Bit**: ``1`` \| ``0``

## Functions

### deserializeFift

▸ **deserializeFift**(`data`): [`Cell`](classes/Cell.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` |

#### Returns

[`Cell`](classes/Cell.md)[]

___

### deserialize

▸ **deserialize**(`data`): [`Cell`](classes/Cell.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Uint8Array` |

#### Returns

[`Cell`](classes/Cell.md)[]

___

### serialize

▸ **serialize**(`root`, `options?`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | [`Cell`](classes/Cell.md)[] |
| `options` | [`BOCOptions`](interfaces/BOCOptions.md) |

#### Returns

`Uint8Array`

___

### augment

▸ **augment**(`bits`, `divider?`): [`Bit`](README.md#bit)[]

Augment bits with 1 and leading 0 to be divisible by 8 or 4 without remainder.
Mostly used for BOC serialization or Cell hash calculations.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `bits` | [`Bit`](README.md#bit)[] | `undefined` | Bits which need to be augmented. |
| `divider` | ``4`` \| ``8`` | `8` | - |

#### Returns

[`Bit`](README.md#bit)[]

___

### rollback

▸ **rollback**(`bits`): [`Bit`](README.md#bit)[]

Remove augmented bits.
Mostly used for BOC serialization or Cell hash calculations.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bits` | [`Bit`](README.md#bit)[] | Bits which needs to be cleared from augmented bits. |

#### Returns

[`Bit`](README.md#bit)[]

___

### crc16

▸ **crc16**(`data`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Uint8Array` \| `number`[] |

#### Returns

`number`

___

### crc16BytesBe

▸ **crc16BytesBe**(`data`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Uint8Array` \| `number`[] |

#### Returns

`Uint8Array`

___

### crc32c

▸ **crc32c**(`data`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Uint8Array` \| `number`[] |

#### Returns

`number`

___

### crc32cBytesLe

▸ **crc32cBytesLe**(`data`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Uint8Array` \| `number`[] |

#### Returns

`Uint8Array`

___

### sha256

▸ **sha256**(`bytes`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `Uint8Array` |

#### Returns

`string`

___

### sha512

▸ **sha512**(`bytes`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `Uint8Array` |

#### Returns

`string`

___

### uint8toInt8

▸ **uint8toInt8**(`uint8`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint8` | `number` |

#### Returns

`number`

___

### int8ToUint8

▸ **int8ToUint8**(`int8`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `int8` | `number` |

#### Returns

`number`

___

### uintToHex

▸ **uintToHex**(`uint`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `uint` | `number` |

#### Returns

`string`

___

### hexToBits

▸ **hexToBits**(`hex`): [`Bit`](README.md#bit)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `hex` | `string` |

#### Returns

[`Bit`](README.md#bit)[]

___

### hexToBytes

▸ **hexToBytes**(`hex`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `hex` | `string` |

#### Returns

`Uint8Array`

___

### bytesToUint

▸ **bytesToUint**(`bytes`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `Uint8Array` \| `number`[] |

#### Returns

`number`

___

### bytesCompare

▸ **bytesCompare**(`a`, `b`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `Uint8Array` \| `number`[] |
| `b` | `Uint8Array` \| `number`[] |

#### Returns

`boolean`

___

### bytesToBits

▸ **bytesToBits**(`data`): [`Bit`](README.md#bit)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Uint8Array` \| `number`[] |

#### Returns

[`Bit`](README.md#bit)[]

___

### bitsToHex

▸ **bitsToHex**(`bits`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bits` | [`Bit`](README.md#bit)[] |

#### Returns

`string`

___

### bitsToBytes

▸ **bitsToBytes**(`bits`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bits` | [`Bit`](README.md#bit)[] |

#### Returns

`Uint8Array`

___

### bitsToInt8

▸ **bitsToInt8**(`bits`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bits` | [`Bit`](README.md#bit)[] |

#### Returns

`number`

___

### bytesToHex

▸ **bytesToHex**(`bytes`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `Uint8Array` |

#### Returns

`string`

___

### bytesToString

▸ **bytesToString**(`bytes`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `Uint8Array` |

#### Returns

`string`

___

### stringToBytes

▸ **stringToBytes**(`value`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`Uint8Array`

___

### bytesToBase64

▸ **bytesToBase64**(`data`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Uint8Array` \| `number`[] |

#### Returns

`string`

___

### base64ToBytes

▸ **base64ToBytes**(`base64`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `base64` | `string` |

#### Returns

`Uint8Array`

___

### sliceIntoChunks

▸ **sliceIntoChunks**(`arr`, `chunkSize`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | `any`[] |
| `chunkSize` | `number` |

#### Returns

`any`[]
