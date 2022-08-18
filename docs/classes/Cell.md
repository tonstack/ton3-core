[ton3-core](../README.md) / Cell

# Class: Cell

## Table of contents

### Accessors

- [bits](Cell.md#bits)
- [refs](Cell.md#refs)
- [type](Cell.md#type)
- [exotic](Cell.md#exotic)

### Constructors

- [constructor](Cell.md#constructor)

### Methods

- [getRefsDescriptor](Cell.md#getrefsdescriptor)
- [getBitsDescriptor](Cell.md#getbitsdescriptor)
- [getDepthDescriptor](Cell.md#getdepthdescriptor)
- [getAugmentedBits](Cell.md#getaugmentedbits)
- [print](Cell.md#print)
- [hash](Cell.md#hash)
- [depth](Cell.md#depth)
- [eq](Cell.md#eq)

## Accessors

### bits

• `get` **bits**(): [`Bit`](../README.md#bit)[]

#### Returns

[`Bit`](../README.md#bit)[]

___

### refs

• `get` **refs**(): [`Cell`](Cell.md)[]

#### Returns

[`Cell`](Cell.md)[]

___

### type

• `get` **type**(): [`CellType`](../enums/CellType.md)

#### Returns

[`CellType`](../enums/CellType.md)

___

### exotic

• `get` **exotic**(): `boolean`

#### Returns

`boolean`

## Constructors

### constructor

• **new Cell**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`CellOptions`](../interfaces/CellOptions.md) |

## Methods

### getRefsDescriptor

▸ **getRefsDescriptor**(`mask?`): [`Bit`](../README.md#bit)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `mask?` | [`Mask`](Mask.md) |

#### Returns

[`Bit`](../README.md#bit)[]

___

### getBitsDescriptor

▸ **getBitsDescriptor**(): [`Bit`](../README.md#bit)[]

#### Returns

[`Bit`](../README.md#bit)[]

___

### getDepthDescriptor

▸ **getDepthDescriptor**(`depth`): [`Bit`](../README.md#bit)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `depth` | `number` |

#### Returns

[`Bit`](../README.md#bit)[]

___

### getAugmentedBits

▸ **getAugmentedBits**(): [`Bit`](../README.md#bit)[]

#### Returns

[`Bit`](../README.md#bit)[]

___

### print

▸ **print**(`indent?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `indent` | `number` | `0` |

#### Returns

`string`

___

### hash

▸ **hash**(`level?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `level` | `number` | `3` |

#### Returns

`string`

___

### depth

▸ **depth**(`level?`): `number`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `level` | `number` | `3` |

#### Returns

`number`

___

### eq

▸ **eq**(`cell`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cell` | [`Cell`](Cell.md) |

#### Returns

`boolean`
