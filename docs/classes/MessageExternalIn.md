[ton3-core](../README.md) / MessageExternalIn

# Class: MessageExternalIn

## Hierarchy

- `Message`

  ↳ **`MessageExternalIn`**

## Table of contents

### Constructors

- [constructor](MessageExternalIn.md#constructor)

### Methods

- [sign](MessageExternalIn.md#sign)
- [cell](MessageExternalIn.md#cell)

## Constructors

### constructor

• **new MessageExternalIn**(`options`, `data?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `MessageExternalInOptions` |
| `data?` | `MessageData` |

#### Overrides

Message.constructor

## Methods

### sign

▸ **sign**(`key`): [`Cell`](Cell.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |

#### Returns

[`Cell`](Cell.md)

#### Inherited from

Message.sign

___

### cell

▸ **cell**(): [`Cell`](Cell.md)

#### Returns

[`Cell`](Cell.md)

#### Inherited from

Message.cell
