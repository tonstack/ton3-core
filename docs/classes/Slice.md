[ton3-core](../README.md) / Slice

# Class: Slice

Cell Slice

## Table of contents

### Accessors

- [bits](Slice.md#bits)
- [refs](Slice.md#refs)

### Methods

- [skip](Slice.md#skip)
- [skipBits](Slice.md#skipbits)
- [skipRefs](Slice.md#skiprefs)
- [skipDict](Slice.md#skipdict)
- [loadRef](Slice.md#loadref)
- [preloadRef](Slice.md#preloadref)
- [loadMaybeRef](Slice.md#loadmayberef)
- [preloadMaybeRef](Slice.md#preloadmayberef)
- [loadBit](Slice.md#loadbit)
- [preloadBit](Slice.md#preloadbit)
- [loadBits](Slice.md#loadbits)
- [preloadBits](Slice.md#preloadbits)
- [loadInt](Slice.md#loadint)
- [preloadInt](Slice.md#preloadint)
- [loadBigInt](Slice.md#loadbigint)
- [preloadBigInt](Slice.md#preloadbigint)
- [loadUint](Slice.md#loaduint)
- [preloadUint](Slice.md#preloaduint)
- [loadBigUint](Slice.md#loadbiguint)
- [preloadBigUint](Slice.md#preloadbiguint)
- [loadVarInt](Slice.md#loadvarint)
- [preloadVarInt](Slice.md#preloadvarint)
- [loadVarBigInt](Slice.md#loadvarbigint)
- [preloadVarBigInt](Slice.md#preloadvarbigint)
- [loadVarUint](Slice.md#loadvaruint)
- [preloadVarUint](Slice.md#preloadvaruint)
- [loadVarBigUint](Slice.md#loadvarbiguint)
- [preloadVarBigUint](Slice.md#preloadvarbiguint)
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

Alias for .skipBits()

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

[`Slice`](Slice.md)

___

### skipBits

▸ **skipBits**(`size`): [`Slice`](Slice.md)

Skip bits from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice } from 'ton3-core'

const builder = new Builder()

builder.storeBits([ 0, 1, 1, 0 ])

const slice = builder.cell().slice()

console.log(slice.skipBits(2).loadBits(2)) // [ 1, 0 ]
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` | Total bits should be skipped |

#### Returns

[`Slice`](Slice.md)

___

### skipRefs

▸ **skipRefs**(`size`): [`Slice`](Slice.md)

Skip refs from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice } from 'ton3-core'

const builder = new Builder()
const cell1 = new Builder().cell()
const cell2 = new Builder().cell()

builder.storeRefs([ cell1, cell2 ])

const slice = builder.cell().slice()

console.log(slice.skipRefs(1).loadRef()) // cell2
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` | Total refs should be skipped |

#### Returns

[`Slice`](Slice.md)

___

### skipDict

▸ **skipDict**(): [`Slice`](Slice.md)

Skip dict from [Slice](Slice.md)

#### Returns

[`Slice`](Slice.md)

___

### loadRef

▸ **loadRef**(): [`Cell`](Cell.md)

Read ref from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice } from 'ton3-core'

const builder = new Builder()
const ref = new Builder()

builder.storeRef(ref.cell())

const slice = builder.cell().slice()

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

### loadMaybeRef

▸ **loadMaybeRef**(): [`Cell`](Cell.md)

Read maybe ref from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice } from 'ton3-core'

const builder1 = new Builder()
const builder2 = new Builder()
const ref = new Builder()

builder1.storeBit(0)

builder2
 .storeBit(1)
 .storeRef(ref.cell())

const slice1 = builder1.cell().slice()
const slice2 = builder2.cell().slice()

console.log(slice1.loadMaybeRef()) // null
console.log(slice2.loadMaybeRef()) // Cell
```

#### Returns

[`Cell`](Cell.md)

___

### preloadMaybeRef

▸ **preloadMaybeRef**(): [`Cell`](Cell.md)

Same as .loadMaybeRef() but will not mutate [Slice](Slice.md)

#### Returns

[`Cell`](Cell.md)

___

### loadBit

▸ **loadBit**(): [`Bit`](../README.md#bit)

Read bit from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice } from 'ton3-core'

const builder = new Builder()

builder.storeBit(1)

const slice = builder.cell().slice()

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
import { Builder, Slice } from 'ton3-core'

const builder = new Builder()

builder.storeBits([ 0, 1 ])

const slice = builder.cell().slice()

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
import { Builder, Slice } from 'ton3-core'

const builder = new Builder()

builder.storeInt(-14, 15)

const slice = builder.cell().slice()

console.log(slice.loadInt(15)) // -14
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

### loadBigInt

▸ **loadBigInt**(`size`): `bigint`

Same as .loadInt() but will return {@link BigInt}

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`bigint`

___

### preloadBigInt

▸ **preloadBigInt**(`size`): `bigint`

Same as .preloadInt() but will return {@link BigInt}

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`bigint`

___

### loadUint

▸ **loadUint**(`size`): `number`

Read uint from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice } from 'ton3-core'

const builder = new Builder()

builder.storeUint(14, 9)

const slice = builder.cell().slice()

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

### loadBigUint

▸ **loadBigUint**(`size`): `bigint`

Same as .loadUint() but will return {@link BigInt}

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`bigint`

___

### preloadBigUint

▸ **preloadBigUint**(`size`): `bigint`

Same as .preloadUint() but will return {@link BigInt}

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`bigint`

___

### loadVarInt

▸ **loadVarInt**(`length`): `number`

Read variable int from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice } from 'ton3-core'

const builder = new Builder()

builder.storeVarInt(-101101, 16)

const slice = builder.cell().slice()

console.log(slice.loadVarInt(16)) // -101101
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `length` | `number` | Maximum possible number of bits used to store value?? |

#### Returns

`number`

___

### preloadVarInt

▸ **preloadVarInt**(`length`): `number`

Same as .loadVarInt() but will not mutate [Slice](Slice.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `length` | `number` |

#### Returns

`number`

___

### loadVarBigInt

▸ **loadVarBigInt**(`length`): `bigint`

Same as .loadVarInt() but will return {@link BigInt}

#### Parameters

| Name | Type |
| :------ | :------ |
| `length` | `number` |

#### Returns

`bigint`

___

### preloadVarBigInt

▸ **preloadVarBigInt**(`length`): `bigint`

Same as .preloadVarInt() but will return {@link BigInt}

#### Parameters

| Name | Type |
| :------ | :------ |
| `length` | `number` |

#### Returns

`bigint`

___

### loadVarUint

▸ **loadVarUint**(`length`): `number`

Read variable uint from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice } from 'ton3-core'

const builder = new Builder()

builder.storeVarUint(101101, 16)

const slice = builder.cell().slice()

console.log(slice.loadVarUint(16)) // 101101
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `length` | `number` | Maximum possible number of bits used to store value?? |

#### Returns

`number`

___

### preloadVarUint

▸ **preloadVarUint**(`length`): `number`

Same as .loadVarUint() but will not mutate [Slice](Slice.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `length` | `number` |

#### Returns

`number`

___

### loadVarBigUint

▸ **loadVarBigUint**(`length`): `bigint`

Same as .loadVarUint() but will return {@link BigInt}

#### Parameters

| Name | Type |
| :------ | :------ |
| `length` | `number` |

#### Returns

`bigint`

___

### preloadVarBigUint

▸ **preloadVarBigUint**(`length`): `bigint`

Same as .preloadVarUint() but will return {@link BigInt}

#### Parameters

| Name | Type |
| :------ | :------ |
| `length` | `number` |

#### Returns

`bigint`

___

### loadBytes

▸ **loadBytes**(`size`): `Uint8Array`

Read bytes from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice } from 'ton3-core'

const builder = new Builder()

builder.storeBytes(new Uint8Array([ 255, 255 ]))

const slice = builder.cell().slice()

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
import { Builder, Slice } from 'ton3-core'

const builder = new Builder()

builder.storeString('Привет, мир!')

const slice = builder.cell().slice()

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
import { Builder, Address, Slice } from 'ton3-core'

const builder = new Builder()
const address = new Address('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')

builder.storeAddress(address)

const slice = builder.cell().slice()

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

▸ **loadCoins**(`decimals?`): [`Coins`](Coins.md)

Read [Coins](Coins.md) from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Coins, Slice } from 'ton3-core'

const builder = new Builder()
const coins = new Coins('100')

builder.storeCoins(coins)

const slice = builder.cell().slice()

console.log(slice.loadCoins().toString()) // '100'
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `decimals` | `number` | `9` |

#### Returns

[`Coins`](Coins.md)

___

### preloadCoins

▸ **preloadCoins**(`decimals?`): [`Coins`](Coins.md)

Same as .loadCoins() but will not mutate [Slice](Slice.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `decimals` | `number` | `9` |

#### Returns

[`Coins`](Coins.md)

___

### loadDict

▸ **loadDict**<`K`, `V`\>(`keySize`, `options?`): [`HashmapE`](HashmapE.md)<`K`, `V`\>

Read [HashmapE](HashmapE.md) from [Slice](Slice.md)

**`example`**
```ts
import { Builder, Slice, HashmapE } from 'ton3-core'

const builder = new Builder()
const dict = new HashmapE(16)

builder.storeDict(dict)

const slice = builder.cell().slice()
const entries = [ ...slice.loadDict() ]

console.log(entries) // []
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | [`Bit`](../README.md#bit)[] |
| `V` | [`Cell`](Cell.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `keySize` | `number` |
| `options?` | [`HashmapOptions`](../interfaces/HashmapOptions.md)<`K`, `V`\> |

#### Returns

[`HashmapE`](HashmapE.md)<`K`, `V`\>

___

### preloadDict

▸ **preloadDict**<`K`, `V`\>(`keySize`, `options?`): [`HashmapE`](HashmapE.md)<`K`, `V`\>

Same as .loadDict() but will not mutate [Slice](Slice.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | [`Bit`](../README.md#bit)[] |
| `V` | [`Cell`](Cell.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `keySize` | `number` |
| `options?` | [`HashmapOptions`](../interfaces/HashmapOptions.md)<`K`, `V`\> |

#### Returns

[`HashmapE`](HashmapE.md)<`K`, `V`\>

___

### parse

▸ `Static` **parse**(`cell`): [`Slice`](Slice.md)

Creates new [Slice](Slice.md) from [Cell](Cell.md)

**`example`**
```ts
import { Builder, Slice } from 'ton3-core'

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
