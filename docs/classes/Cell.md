[ton3-core](../README.md) / Cell

# Class: Cell

## Table of contents

### Constructors

- [constructor](Cell.md#constructor)

### Accessors

- [bits](Cell.md#bits)
- [refs](Cell.md#refs)
- [mask](Cell.md#mask)
- [type](Cell.md#type)
- [exotic](Cell.md#exotic)

### Methods

- [hash](Cell.md#hash)
- [depth](Cell.md#depth)
- [slice](Cell.md#slice)
- [print](Cell.md#print)
- [eq](Cell.md#eq)

## Constructors

### constructor

• **new Cell**(`options?`)

Creates an instance of [Cell](Cell.md)
- You should avoid creating [Cell](Cell.md) manually
- Use [Builder](Builder.md) to construct your [Cell](Cell.md)

**`example`**
```ts
import { Cell, CellType } from 'ton3-core'

const ref = new Cell()
const cell = new Cell({
    type: CellType.Ordinary,
    bits: [ 1, 0, 1 ],
    refs: [ ref ]
})
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`CellOptions`](../interfaces/CellOptions.md) |

## Accessors

### bits

• `get` **bits**(): [`Bit`](../README.md#bit)[]

Get current [Cell](Cell.md) instance bits

**`example`**
```ts
import { Builder } from 'ton3-core'

const cell = new Builder().storeBits([ 1, 0 ])

console.log(cell.bits) // [ 1, 0 ]
```

#### Returns

[`Bit`](../README.md#bit)[]

___

### refs

• `get` **refs**(): [`Cell`](Cell.md)[]

Get current [Cell](Cell.md) instance refs

**`example`**
```ts
import { Builder } from 'ton3-core'

const ref = new Builder().cell()
const cell = new Builder().storeRef(ref)

console.log(cell.refs) // [ ref ]
```

#### Returns

[`Cell`](Cell.md)[]

___

### mask

• `get` **mask**(): [`Mask`](Mask.md)

Get current [Cell](Cell.md) instance [Mask](Mask.md) (that includes level, hashes count, etc...)

**`example`**
```ts
import { Builder } from 'ton3-core'

const cell = new Builder().cell()

console.log(cell.mask.level) // 0
console.log(cell.mask.hashCount) // 1
```

#### Returns

[`Mask`](Mask.md)

___

### type

• `get` **type**(): [`CellType`](../enums/CellType.md)

Get current [Cell](Cell.md) instance [CellType](../enums/CellType.md)

**`example`**
```ts
import { CellType, Builder } from 'ton3-core'

const cell = new Builder().cell()

console.log(cell.type === CellType.Ordinary) // true
```

#### Returns

[`CellType`](../enums/CellType.md)

___

### exotic

• `get` **exotic**(): `boolean`

Check if current [Cell](Cell.md) instance is exotic type

**`example`**
```ts
import { CellType, Builder, Bit } from 'ton3-core'

const zeroes = Array.from({ length: 8 + 256}).fill(0) as Bit[]
const cell1 = new Builder().cell(CellType.Ordinary)
const cell2 = new Builder().storeBits(zeroes).cell(CellType.LibraryReference)

console.log(cell1.exotic) // false
console.log(cell2.exotic) // true
```

#### Returns

`boolean`

## Methods

### hash

▸ **hash**(`level?`): `string`

Get cell's hash in hex (max level by default)

**`example`**
```ts
import { Builder } from 'ton3-core'

const cell = new Builder().cell()

console.log(cell.hash()) // 96a296d224f285c67bee93c30f8a309157f0daa35dc5b87e410b78630a09cfc7
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `level` | `number` | `3` |

#### Returns

`string`

___

### depth

▸ **depth**(`level?`): `number`

Get cell's depth (max level by default)

**`example`**
```ts
import { Builder } from 'ton3-core'

const cell1 = new Builder().cell()
const cell2 = new Builder().storeRef(cell1).cell()

console.log(cell2.depth()) // 1
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `level` | `number` | `3` |

#### Returns

`number`

___

### slice

▸ **slice**(): [`Slice`](Slice.md)

Get [Slice](Slice.md) from current instance
- Same as `Slice.parse(cell)`

**`example`**
```ts
import { Builder } from 'ton3-core'

const cell = new Builder()
    .storeBits([ 1, 0 ])
    .cell()

const slice = cell.slice()

console.log(slice.loadBits(2)) // [ 1, 0 ]
console.log(cell.bits) // [ 1, 0 ]
```

#### Returns

[`Slice`](Slice.md)

___

### print

▸ **print**(`indent?`, `size?`): `string`

Print cell as fift-hex

**`example`**
```ts
import { Builder } from 'ton3-core'

const cell = new Builder().cell()

console.log(cell.print()) // x{_}
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `indent` | `number` | `1` |
| `size` | `number` | `0` |

#### Returns

`string`

___

### eq

▸ **eq**(`cell`): `boolean`

Checks [Cell](Cell.md) equality by comparing cell hashes

**`example`**
```ts
import { Builder } from 'ton3-core'

const cell = new Builder().storeBits([ 1, 0 ]).cell()
const equal = new Builder().storeBits([ 1, 0 ]).cell()
const notEqual = new Builder().storeBits([ 0, 1 ]).cell()

console.log(equal.eq(cell), notEqual.eq(cell)) // true, false
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `cell` | [`Cell`](Cell.md) |

#### Returns

`boolean`
