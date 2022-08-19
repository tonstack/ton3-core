[ton3-core](../README.md) / MnemonicBIP39

# Class: MnemonicBIP39

## Hierarchy

- **`MnemonicBIP39`**

  ↳ [`Mnemonic`](Mnemonic.md)

## Table of contents

### Constructors

- [constructor](MnemonicBIP39.md#constructor)

### Accessors

- [words](MnemonicBIP39.md#words)
- [seed](MnemonicBIP39.md#seed)
- [keys](MnemonicBIP39.md#keys)

### Methods

- [genereteWords](MnemonicBIP39.md#generetewords)
- [generateKeyPair](MnemonicBIP39.md#generatekeypair)
- [genereteSeed](MnemonicBIP39.md#genereteseed)
- [genereteSeedAsync](MnemonicBIP39.md#genereteseedasync)

## Constructors

### constructor

• **new MnemonicBIP39**(`mnemonic?`, `options?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `mnemonic` | `string`[] | `[]` |
| `options?` | [`MnemonicOptions`](../interfaces/MnemonicOptions.md) | `undefined` |

## Accessors

### words

• `get` **words**(): `string`[]

#### Returns

`string`[]

___

### seed

• `get` **seed**(): `Uint8Array`

#### Returns

`Uint8Array`

___

### keys

• `get` **keys**(): [`KeyPair`](../interfaces/KeyPair.md)

#### Returns

[`KeyPair`](../interfaces/KeyPair.md)

## Methods

### genereteWords

▸ `Static` **genereteWords**(): `string`[]

#### Returns

`string`[]

___

### generateKeyPair

▸ `Static` **generateKeyPair**(`seed`): [`KeyPair`](../interfaces/KeyPair.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `seed` | `Uint8Array` |

#### Returns

[`KeyPair`](../interfaces/KeyPair.md)

___

### genereteSeed

▸ `Static` **genereteSeed**(`mnemonic`, `salt?`, `rounds?`, `keyLength?`): `Uint8Array`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `mnemonic` | `string`[] | `undefined` |
| `salt` | `any` | `null` |
| `rounds` | `number` | `2048` |
| `keyLength` | `number` | `64` |

#### Returns

`Uint8Array`

___

### genereteSeedAsync

▸ `Static` **genereteSeedAsync**(`mnemonic`, `salt?`, `rounds?`, `keyLength?`): `Promise`<`Uint8Array`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `mnemonic` | `string`[] | `undefined` |
| `salt` | `any` | `null` |
| `rounds` | `number` | `2048` |
| `keyLength` | `number` | `64` |

#### Returns

`Promise`<`Uint8Array`\>
