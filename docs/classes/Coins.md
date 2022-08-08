[ton3-core](../README.md) / Coins

# Class: Coins

## Hierarchy

- [`Jettons`](Jettons.md)

  ↳ **`Coins`**

## Table of contents

### Methods

- [add](Coins.md#add)
- [fromNano](Coins.md#fromnano)
- [sub](Coins.md#sub)
- [mul](Coins.md#mul)
- [div](Coins.md#div)
- [eq](Coins.md#eq)
- [gt](Coins.md#gt)
- [gte](Coins.md#gte)
- [lt](Coins.md#lt)
- [lte](Coins.md#lte)
- [isNegative](Coins.md#isnegative)
- [isPositive](Coins.md#ispositive)
- [isZero](Coins.md#iszero)
- [toString](Coins.md#tostring)
- [toNano](Coins.md#tonano)

### Constructors

- [constructor](Coins.md#constructor)

## Methods

### add

▸ **add**(`value`): [`Coins`](Coins.md)

Add value to instance value

**`example`**
```ts
import { Jettons } from 'ton3-core'

const jettons = new Jettons('10').add(9)

console.log(jettons.toString()) // '19'
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` \| `bigint` \| [`Coins`](Coins.md) |

#### Returns

[`Coins`](Coins.md)

- Current instance reference

#### Inherited from

[Jettons](Jettons.md).[add](Jettons.md#add)

___

### fromNano

▸ `Static` **fromNano**(`value`): [`Coins`](Coins.md)

Creates instance of Coins from value in nano

**`static`**

**`example`**
```ts
import { Coins } from 'ton3-core'

const coins = Coins.fromNano('100000000000')

console.log(coins.toString()) // 100 coins
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `bigint` | Value in nanocoins |

#### Returns

[`Coins`](Coins.md)

#### Overrides

[Jettons](Jettons.md).[fromNano](Jettons.md#fromnano)

___

### sub

▸ **sub**(`value`): [`Coins`](Coins.md)

Subtract value from instance value

**`example`**
```ts
import { Jettons } from 'ton3-core'

const jettons = new Jettons('10').sub(9)

console.log(jettons.toString()) // '1'
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` \| `bigint` \| [`Coins`](Coins.md) |

#### Returns

[`Coins`](Coins.md)

- Current instance reference

#### Inherited from

[Jettons](Jettons.md).[sub](Jettons.md#sub)

___

### mul

▸ **mul**(`value`): [`Coins`](Coins.md)

Multiplies instance value by value

**`example`**
```ts
import { Jettons } from 'ton3-core'

const jettons = new Jettons('10').mul(2)

console.log(jettons.toString()) // '20'
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` \| `bigint` \| [`Coins`](Coins.md) |

#### Returns

[`Coins`](Coins.md)

- Current instance reference

#### Inherited from

[Jettons](Jettons.md).[mul](Jettons.md#mul)

___

### div

▸ **div**(`value`): [`Coins`](Coins.md)

Divides instance value by value

**`example`**
```ts
import { Jettons } from 'ton3-core'

const jettons = new Jettons('10').div(2)

console.log(jettons.toString()) // '5'
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` \| `bigint` \| [`Coins`](Coins.md) |

#### Returns

[`Coins`](Coins.md)

- Current instance reference

#### Inherited from

[Jettons](Jettons.md).[div](Jettons.md#div)

___

### eq

▸ **eq**(`value`): `boolean`

Checks if instance value equal another [Jettons](Jettons.md) instance value

**`example`**
```ts
import { Jettons } from 'ton3-core'

const jettons = new Jettons('10')
const equal = new Jettons('10')
const notEqual = new Jettons('11')

console.log(equal.eq(jettons), notEqual.eq(jettons)) // true, false
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Coins`](Coins.md) |

#### Returns

`boolean`

#### Inherited from

[Jettons](Jettons.md).[eq](Jettons.md#eq)

___

### gt

▸ **gt**(`value`): `boolean`

Checks if instance value greater than another [Jettons](Jettons.md) instance value

**`example`**
```ts
import { Jettons } from 'ton3-core'

const jettons = new Jettons('10')
const equal = new Jettons('10')
const greater = new Jettons('11')

console.log(equal.gt(jettons), greater.gt(jettons)) // false, true
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Coins`](Coins.md) |

#### Returns

`boolean`

#### Inherited from

[Jettons](Jettons.md).[gt](Jettons.md#gt)

___

### gte

▸ **gte**(`value`): `boolean`

Checks if instance value greater than or equal another [Jettons](Jettons.md) instance value

**`example`**
```ts
import { Jettons } from 'ton3-core'

const jettons = new Jettons('10')
const equal = new Jettons('10')
const greater = new Jettons('11')

console.log(equal.gte(jettons), greater.gte(jettons)) // true, true
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Coins`](Coins.md) |

#### Returns

`boolean`

#### Inherited from

[Jettons](Jettons.md).[gte](Jettons.md#gte)

___

### lt

▸ **lt**(`value`): `boolean`

Checks if instance value lesser than another [Jettons](Jettons.md) instance value

**`example`**
```ts
import { Jettons } from 'ton3-core'

const jettons = new Jettons('10')
const equal = new Jettons('10')
const lesser = new Jettons('9')

console.log(equal.lt(jettons), lesser.lt(jettons)) // false, true
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Coins`](Coins.md) |

#### Returns

`boolean`

#### Inherited from

[Jettons](Jettons.md).[lt](Jettons.md#lt)

___

### lte

▸ **lte**(`value`): `boolean`

Checks if instance value lesser than or equal another [Jettons](Jettons.md) instance value

**`example`**
```ts
import { Jettons } from 'ton3-core'

const jettons = new Jettons('10')
const equal = new Jettons('10')
const lesser = new Jettons('9')

console.log(equal.lte(jettons), lesser.lte(jettons)) // true, true
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Coins`](Coins.md) |

#### Returns

`boolean`

#### Inherited from

[Jettons](Jettons.md).[lte](Jettons.md#lte)

___

### isNegative

▸ **isNegative**(): `boolean`

Checks if instance value is negative

**`example`**
```ts
import { Jettons } from 'ton3-core'

const zero = new Jettons('0')
const negative = new Jettons('-1')

console.log(zero.isNegative(), negative.isNegative()) // false, true
```

#### Returns

`boolean`

#### Inherited from

[Jettons](Jettons.md).[isNegative](Jettons.md#isnegative)

___

### isPositive

▸ **isPositive**(): `boolean`

Checks if instance value is positive

**`example`**
```ts
import { Jettons } from 'ton3-core'

const zero = new Jettons('0')
const positive = new Jettons('1')

console.log(zero.isPositive(), positive.isPositive()) // true, true
```

#### Returns

`boolean`

#### Inherited from

[Jettons](Jettons.md).[isPositive](Jettons.md#ispositive)

___

### isZero

▸ **isZero**(): `boolean`

Checks if instance value equals zero

**`example`**
```ts
import { Jettons } from 'ton3-core'

const zero = new Jettons('0')

console.log(zero.isZero()) // true
```

#### Returns

`boolean`

#### Inherited from

[Jettons](Jettons.md).[isZero](Jettons.md#iszero)

___

### toString

▸ **toString**(): `string`

Returns string representation of instance in jettons

**`example`**
```ts
import { Jettons } from 'ton3-core'

const jettons = new Jettons('100')

console.log(jettons.toString()) // '100'
```

#### Returns

`string`

#### Inherited from

[Jettons](Jettons.md).[toString](Jettons.md#tostring)

___

### toNano

▸ **toNano**(): `string`

Returns string representation of instance in nanojettons

**`example`**
```ts
import { Jettons } from 'ton3-core'

const jettons = new Jettons('100')

console.log(jettons.toNano()) // '100000000000'
```

#### Returns

`string`

#### Inherited from

[Jettons](Jettons.md).[toNano](Jettons.md#tonano)

## Constructors

### constructor

• **new Coins**(`value`, `isNano?`)

Creates an instance of [Coins](Coins.md)

**`example`**
```ts
import { Coins } from 'ton3-core'

const coins = new Coins('100')

new Coins(coins)
new Coins(BigInt('100'))
new Coins(100)
new Coins('100')
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `bigint` \| [`Coins`](Coins.md) | `undefined` |
| `isNano` | `boolean` | `false` |

#### Overrides

[Jettons](Jettons.md).[constructor](Jettons.md#constructor)
