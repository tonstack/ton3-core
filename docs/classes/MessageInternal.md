[@tonstack/ton3-core](../README.md) / MessageInternal

# Class: MessageInternal

## Hierarchy

- `Message`

  ↳ **`MessageInternal`**

## Table of contents

### Constructors

- [constructor](MessageInternal.md#constructor)

### Methods

- [sign](MessageInternal.md#sign)
- [cell](MessageInternal.md#cell)

## Constructors

### constructor

• **new MessageInternal**(`options`, `body?`, `state?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `MessageInternalOptions` |
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
