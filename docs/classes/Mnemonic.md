[ton3-core](../README.md) / Mnemonic

# Class: Mnemonic

## Hierarchy

- [`MnemonicBIP39`](MnemonicBIP39.md)

  ↳ **`Mnemonic`**

## Table of contents

### Constructors

- [constructor](Mnemonic.md#constructor)

### Accessors

- [words](Mnemonic.md#words)
- [seed](Mnemonic.md#seed)
- [keys](Mnemonic.md#keys)

### Methods

- [genereteWords](Mnemonic.md#generetewords)
- [generateKeyPair](Mnemonic.md#generatekeypair)
- [genereteSeed](Mnemonic.md#genereteseed)
- [genereteSeedAsync](Mnemonic.md#genereteseedasync)

## Constructors

### constructor

• **new Mnemonic**(`mnemonic?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `mnemonic` | `string`[] | `[]` |

#### Overrides

[MnemonicBIP39](MnemonicBIP39.md).[constructor](MnemonicBIP39.md#constructor)

## Accessors

### words

• `get` **words**(): `string`[]

#### Returns

`string`[]

#### Inherited from

MnemonicBIP39.words

___

### seed

• `get` **seed**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

MnemonicBIP39.seed

___

### keys

• `get` **keys**(): [`KeyPair`](../interfaces/KeyPair.md)

#### Returns

[`KeyPair`](../interfaces/KeyPair.md)

#### Inherited from

MnemonicBIP39.keys

## Methods

### genereteWords

▸ `Static` **genereteWords**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[MnemonicBIP39](MnemonicBIP39.md).[genereteWords](MnemonicBIP39.md#generetewords)

___

### generateKeyPair

▸ `Static` **generateKeyPair**(`seed`): [`KeyPair`](../interfaces/KeyPair.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `seed` | `Uint8Array` |

#### Returns

[`KeyPair`](../interfaces/KeyPair.md)

#### Inherited from

[MnemonicBIP39](MnemonicBIP39.md).[generateKeyPair](MnemonicBIP39.md#generatekeypair)

___

### genereteSeed

▸ `Static` **genereteSeed**(`mnemonic`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mnemonic` | `string`[] |

#### Returns

`Uint8Array`

#### Overrides

[MnemonicBIP39](MnemonicBIP39.md).[genereteSeed](MnemonicBIP39.md#genereteseed)

___

### genereteSeedAsync

▸ `Static` **genereteSeedAsync**(`mnemonic`): `Promise`<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `mnemonic` | `string`[] |

#### Returns

`Promise`<`Uint8Array`\>

#### Overrides

[MnemonicBIP39](MnemonicBIP39.md).[genereteSeedAsync](MnemonicBIP39.md#genereteseedasync)
