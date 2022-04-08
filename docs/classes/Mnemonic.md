[ton3-core](../README.md) / Mnemonic

# Class: Mnemonic

## Table of contents

### Constructors

- [constructor](Mnemonic.md#constructor)

### Accessors

- [words](Mnemonic.md#words)
- [seed](Mnemonic.md#seed)
- [keys](Mnemonic.md#keys)

## Constructors

### constructor

• **new Mnemonic**(`mnemonic?`, `salt?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `mnemonic` | `string`[] | `[]` |
| `salt` | `string` | `null` |

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
