ton3-core

# ton3-core

## Table of contents

### Type aliases

- [AddressType](README.md#addresstype)
- [Bit](README.md#bit)

### Interfaces

- [AddressRewriteOptions](interfaces/AddressRewriteOptions.md)
- [AddressStringifyOptions](interfaces/AddressStringifyOptions.md)
- [CellOptions](interfaces/CellOptions.md)
- [HashmapOptions](interfaces/HashmapOptions.md)
- [BOCOptions](interfaces/BOCOptions.md)
- [CoinsOptions](interfaces/CoinsOptions.md)
- [ContractBaseOptions](interfaces/ContractBaseOptions.md)
- [KeyPair](interfaces/KeyPair.md)
- [MnemonicOptions](interfaces/MnemonicOptions.md)

### Classes

- [Address](classes/Address.md)
- [Builder](classes/Builder.md)
- [Cell](classes/Cell.md)
- [Hashmap](classes/Hashmap.md)
- [HashmapE](classes/HashmapE.md)
- [BOC](classes/BOC.md)
- [Mask](classes/Mask.md)
- [Slice](classes/Slice.md)
- [Coins](classes/Coins.md)
- [ContractBase](classes/ContractBase.md)
- [ContractLibrary](classes/ContractLibrary.md)
- [MessageInternal](classes/MessageInternal.md)
- [MessageExternalIn](classes/MessageExternalIn.md)
- [MnemonicBIP39](classes/MnemonicBIP39.md)
- [Mnemonic](classes/Mnemonic.md)

### Enumerations

- [CellType](enums/CellType.md)

### Functions

- [deserializeFift](README.md#deserializefift)
- [deserialize](README.md#deserialize)
- [serialize](README.md#serialize)
- [deriveChecksumBits](README.md#derivechecksumbits)
- [generateKeyPair](README.md#generatekeypair)
- [genereteWords](README.md#generetewords)
- [genereteSeed](README.md#genereteseed)
- [genereteSeedAsync](README.md#genereteseedasync)
- [normalize](README.md#normalize)
- [augment](README.md#augment)
- [rollback](README.md#rollback)
- [crc16](README.md#crc16)
- [crc16BytesBe](README.md#crc16bytesbe)
- [crc32c](README.md#crc32c)
- [crc32cBytesLe](README.md#crc32cbytesle)
- [sha256](README.md#sha256)
- [sha512](README.md#sha512)
- [uintToHex](README.md#uinttohex)
- [hexToBits](README.md#hextobits)
- [hexToBytes](README.md#hextobytes)
- [bytesToUint](README.md#bytestouint)
- [bytesCompare](README.md#bytescompare)
- [bytesToBits](README.md#bytestobits)
- [bitsToHex](README.md#bitstohex)
- [bitsToBytes](README.md#bitstobytes)
- [bytesToHex](README.md#bytestohex)
- [bytesToString](README.md#bytestostring)
- [stringToBytes](README.md#stringtobytes)
- [bytesToBase64](README.md#bytestobase64)
- [base64ToBytes](README.md#base64tobytes)
- [sliceIntoChunks](README.md#sliceintochunks)
- [bitsToBigUint](README.md#bitstobiguint)
- [bitsToBigInt](README.md#bitstobigint)
- [bitsToIntUint](README.md#bitstointuint)

### Variables

- [isNodeEnv](README.md#isnodeenv)

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

▸ **deserialize**(`data`, `checkMerkleProofs`): [`Cell`](classes/Cell.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Uint8Array` |
| `checkMerkleProofs` | `boolean` |

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

### deriveChecksumBits

▸ **deriveChecksumBits**(`entropy`): [`Bit`](README.md#bit)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `entropy` | `Uint8Array` |

#### Returns

[`Bit`](README.md#bit)[]

___

### generateKeyPair

▸ **generateKeyPair**(`seed`): [`KeyPair`](interfaces/KeyPair.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `seed` | `Uint8Array` |

#### Returns

[`KeyPair`](interfaces/KeyPair.md)

___

### genereteWords

▸ **genereteWords**(): `string`[]

#### Returns

`string`[]

___

### genereteSeed

▸ **genereteSeed**(`mnemonic`, `salt`, `rounds`, `keyLength`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mnemonic` | `string`[] |
| `salt` | `string` |
| `rounds` | `number` |
| `keyLength` | `number` |

#### Returns

`Uint8Array`

___

### genereteSeedAsync

▸ **genereteSeedAsync**(`mnemonic`, `salt`, `rounds`, `keyLength`): `Promise`<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `mnemonic` | `string`[] |
| `salt` | `string` |
| `rounds` | `number` |
| `keyLength` | `number` |

#### Returns

`Promise`<`Uint8Array`\>

___

### normalize

▸ **normalize**(`value`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`string`

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

___

### bitsToBigUint

▸ **bitsToBigUint**(`bits`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bits` | [`Bit`](README.md#bit)[] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `value` | `bigint` |
| `isSafe` | `boolean` |

___

### bitsToBigInt

▸ **bitsToBigInt**(`bits`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bits` | [`Bit`](README.md#bit)[] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `value` | `bigint` |
| `isSafe` | `boolean` |

___

### bitsToIntUint

▸ **bitsToIntUint**(`bits`, `options`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bits` | [`Bit`](README.md#bit)[] |
| `options` | `Object` |
| `options.type` | ``"int"`` \| ``"uint"`` |

#### Returns

`number`

## Variables

### isNodeEnv

• `Const` **isNodeEnv**: `boolean`
