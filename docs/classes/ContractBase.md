[ton3-core](../README.md) / ContractBase

# Class: ContractBase

## Table of contents

### Constructors

- [constructor](ContractBase.md#constructor)

### Properties

- [EMPTY\_CODE](ContractBase.md#empty_code)

### Accessors

- [workchain](ContractBase.md#workchain)
- [address](ContractBase.md#address)
- [state](ContractBase.md#state)

## Constructors

### constructor

• **new ContractBase**(`workchain`, `code`, `storage?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `workchain` | `number` |
| `code` | [`Cell`](Cell.md) |
| `storage?` | [`Cell`](Cell.md) |

## Properties

### EMPTY\_CODE

▪ `Static` **EMPTY\_CODE**: [`Cell`](Cell.md)

## Accessors

### workchain

• `get` **workchain**(): `number`

#### Returns

`number`

___

### address

• `get` **address**(): [`Address`](Address.md)

#### Returns

[`Address`](Address.md)

___

### state

• `get` **state**(): [`Cell`](Cell.md)

#### Returns

[`Cell`](Cell.md)
