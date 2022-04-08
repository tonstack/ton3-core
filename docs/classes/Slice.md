[@tonstack/ton3-core](../README.md) / Slice

# Class: Slice

## Table of contents

### Accessors

- [bits](Slice.md#bits)
- [refs](Slice.md#refs)

### Methods

- [skip](Slice.md#skip)
- [skipDict](Slice.md#skipdict)
- [loadRef](Slice.md#loadref)
- [preloadRef](Slice.md#preloadref)
- [loadBit](Slice.md#loadbit)
- [preloadBit](Slice.md#preloadbit)
- [loadBits](Slice.md#loadbits)
- [preloadBits](Slice.md#preloadbits)
- [loadInt](Slice.md#loadint)
- [preloadInt](Slice.md#preloadint)
- [loadUint](Slice.md#loaduint)
- [preloadUint](Slice.md#preloaduint)
- [loadBytes](Slice.md#loadbytes)
- [preloadBytes](Slice.md#preloadbytes)
- [loadString](Slice.md#loadstring)
- [preloadString](Slice.md#preloadstring)
- [loadAddress](Slice.md#loadaddress)
- [preloadAddress](Slice.md#preloadaddress)
- [loadCoins](Slice.md#loadcoins)
- [preloadCoins](Slice.md#preloadcoins)
- [loadDict](Slice.md#loaddict)
- [preloadDict](Slice.md#preloaddict)
- [parse](Slice.md#parse)

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

## Methods

### skip

▸ **skip**(`size`): [`Slice`](Slice.md)

Skip bits from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice } from '@tonstack/tontools'

const builder = new Builder()

builder.storeBits([ 0, 1, 1, 0 ])

const slice = Slice.parse(builder.cell())

console.log(slice.skip(2).loadBits(2)) // [ 1, 0 ]
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` | Total bits should be skipped |

#### Returns

[`Slice`](Slice.md)

___

### skipDict

▸ **skipDict**(): [`Slice`](Slice.md)

Same as .loadDict() but will return instance of [Slice](Slice.md) with unloaded dict

#### Returns

[`Slice`](Slice.md)

___

### loadRef

▸ **loadRef**(): [`Cell`](Cell.md)

Read ref from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice } from '@tonstack/tontools'

const builder = new Builder()
const ref = new Builder()

builder.storeRef(ref.cell())

const slice = Slice.parse(builder.cell())

console.log(slice.loadRef()) // Cell
```

#### Returns

[`Cell`](Cell.md)

___

### preloadRef

▸ **preloadRef**(): [`Cell`](Cell.md)

Same as .loadRef() but will not mutate [Slice](Slice.md)

#### Returns

[`Cell`](Cell.md)

___

### loadBit

▸ **loadBit**(): [`Bit`](../README.md#bit)

Read bit from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice } from '@tonstack/tontools'

const builder = new Builder()

builder.storeBit(1)

const slice = Slice.parse(builder.cell())

console.log(slice.loadBit()) // 1
```

#### Returns

[`Bit`](../README.md#bit)

___

### preloadBit

▸ **preloadBit**(): [`Bit`](../README.md#bit)

Same as .loadBit() but will not mutate [Slice](Slice.md)

#### Returns

[`Bit`](../README.md#bit)

___

### loadBits

▸ **loadBits**(`size`): [`Bit`](../README.md#bit)[]

Read bits from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice } from '@tonstack/tontools'

const builder = new Builder()

builder.storeBits([ 0, 1 ])

const slice = Slice.parse(builder.cell())

console.log(slice.loadBits(2)) // [ 0, 1 ]
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` | Total bits should be readed to represent requested value |

#### Returns

[`Bit`](../README.md#bit)[]

___

### preloadBits

▸ **preloadBits**(`size`): [`Bit`](../README.md#bit)[]

Same as .loadBits() but will not mutate [Slice](Slice.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

[`Bit`](../README.md#bit)[]

___

### loadInt

▸ **loadInt**(`size`): `number`

Read int from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice } from '@tonstack/tontools'

const builder = new Builder()

builder.storeUint(-14, 15)

const slice = Slice.parse(builder.cell())

console.log(slice.loadUint(15)) // -14
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` | Total bits should be readed to represent requested value |

#### Returns

`number`

___

### preloadInt

▸ **preloadInt**(`size`): `number`

Same as .loadInt() but will not mutate [Slice](Slice.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`number`

___

### loadUint

▸ **loadUint**(`size`): `number`

Read uint from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice } from '@tonstack/tontools'

const builder = new Builder()

builder.storeUint(14, 9)

const slice = Slice.parse(builder.cell())

console.log(slice.loadUint(9)) // 14
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` | Total bits should be readed to represent requested value |

#### Returns

`number`

___

### preloadUint

▸ **preloadUint**(`size`): `number`

Same as .loadUint() but will not mutate [Slice](Slice.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`number`

___

### loadBytes

▸ **loadBytes**(`size`): `Uint8Array`

Read bytes from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice } from '@tonstack/tontools'

const builder = new Builder()

builder.storeBytes(new Uint8Array([ 255, 255 ]))

const slice = Slice.parse(builder.cell())

console.log(slice.loadBytes(16)) // [ 255, 255 ]
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`Uint8Array`

___

### preloadBytes

▸ **preloadBytes**(`size`): `Uint8Array`

Same as .loadBytes() but will not mutate [Slice](Slice.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`Uint8Array`

___

### loadString

▸ **loadString**(`size?`): `string`

Read string from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice } from '@tonstack/tontools'

const builder = new Builder()

builder.storeString('Привет, мир!')

const slice = Slice.parse(builder.cell())

console.log(slice.loadString()) // 'Привет, мир!'
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `size` | `number` | `null` |

#### Returns

`string`

___

### preloadString

▸ **preloadString**(`size?`): `string`

Same as .loadString() but will not mutate [Slice](Slice.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `size` | `number` | `null` |

#### Returns

`string`

___

### loadAddress

▸ **loadAddress**(): [`Address`](Address.md)

Read [Address](Address.md) from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Address, Slice } from '@tonstack/tontools'

const builder = new Builder()
const address = new Address('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')

builder.storeAddress(address)

const slice = Slice.parse(builder.cell())

console.log(slice.loadAddress().toString())
// 'kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny'
```

#### Returns

[`Address`](Address.md)

___

### preloadAddress

▸ **preloadAddress**(): [`Address`](Address.md)

Same as .loadAddress() but will not mutate [Slice](Slice.md)

#### Returns

[`Address`](Address.md)

___

### loadCoins

▸ **loadCoins**(): [`Coins`](Coins.md)

Read [Coins](Coins.md) from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Coins, Slice } from '@tonstack/tontools'

const builder = new Builder()
const coins = new Coins('100')

builder.storeCoins(coins)

const slice = Slice.parse(builder.cell())

console.log(slice.loadCoins().toString()) // '100'
```

#### Returns

[`Coins`](Coins.md)

___

### preloadCoins

▸ **preloadCoins**(): [`Coins`](Coins.md)

Same as .loadCoins() but will not mutate [Slice](Slice.md)

#### Returns

[`Coins`](Coins.md)

___

### loadDict

▸ **loadDict**(): [`Cell`](Cell.md)

Read [HashmapE](HashmapE.md) as [Cell](Cell.md) from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice, HashmapE } from '@tonstack/tontools'

const builder = new Builder()
const dict = new HashmapE(16)

builder.storeDict(dict)

const slice = Slice.parse(builder.cell())
const cell = slice.loadDict()
```

#### Returns

[`Cell`](Cell.md)

___

### preloadDict

▸ **preloadDict**(): [`Cell`](Cell.md)

Same as .loadDict() but will not mutate [Slice](Slice.md)

#### Returns

[`Cell`](Cell.md)

___

### parse

▸ `Static` **parse**(`cell`): [`Slice`](Slice.md)

Creates new [Slice](Slice.md) from [Cell](Cell.md)

**`example`**
```ts
import { Builder, Slice } from '@tonstack/tontools'

const builder = new Builder()
const cell = builder.cell()
const slice = Slice.parse(cell)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `cell` | [`Cell`](Cell.md) |

#### Returns

[`Slice`](Slice.md)
