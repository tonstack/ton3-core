[@tonstack/ton3-core](../README.md) / MessageExternalIn

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

• **new MessageExternalIn**(`options`, `body?`, `state?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `MessageExternalInOptions` |
| `body?` | [`Cell`](Cell.md) |
| `state?` | [`Cell`](Cell.md) |

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
