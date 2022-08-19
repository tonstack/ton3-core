[ton3-core](../README.md) / Coins

# Class: Coins

Coins/Jettons

## Table of contents

### Constructors

- [constructor](Coins.md#constructor)

### Methods

- [add](Coins.md#add)
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
- [fromNano](Coins.md#fromnano)

## Constructors

### constructor

• **new Coins**(`value`, `options?`)

Creates an instance of [Coins](Coins.md)

**`example`**
```ts
import { Coins } from 'ton3-core'

const coins = new Coins('100')

new Coins(coins)
new Coins(BigInt('100'))
new Coins(100)
new Coins('100')
new Coins('100000', { isNano: true, decimals: 3 })
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` \| `bigint` \| [`Coins`](Coins.md) |
| `options?` | [`CoinsOptions`](../interfaces/CoinsOptions.md) |

## Methods

### add

▸ **add**(`coins`): [`Coins`](Coins.md)

Add value to instance value

**`example`**
```ts
import { Coins } from 'ton3-core'

const coinsA = new Coins('10')
const coinsB = new Coins('9')

coinsA.add(coinsB)

console.log(coinsA.toString()) // '19'
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `coins` | [`Coins`](Coins.md) |

#### Returns

[`Coins`](Coins.md)

- Current instance reference

___

### sub

▸ **sub**(`coins`): [`Coins`](Coins.md)

Subtract value from instance value

**`example`**
```ts
import { Coins } from 'ton3-core'

const coinsA = new Coins('10')
const coinsB = new Coins('9')

coinsA.sub(coinsB)

console.log(coinsA.toString()) // '1'
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `coins` | [`Coins`](Coins.md) |

#### Returns

[`Coins`](Coins.md)

- Current instance reference

___

### mul

▸ **mul**(`value`): [`Coins`](Coins.md)

Multiplies instance value by value

**`example`**
```ts
import { Coins } from 'ton3-core'

const coins = new Coins('10').mul(2)

console.log(coins.toString()) // '20'
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` \| `bigint` |

#### Returns

[`Coins`](Coins.md)

- Current instance reference

___

### div

▸ **div**(`value`): [`Coins`](Coins.md)

Divides instance value by value

**`example`**
```ts
import { Coins } from 'ton3-core'

const coins = new Coins('10').div(2)

console.log(coins.toString()) // '5'
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` \| `bigint` |

#### Returns

[`Coins`](Coins.md)

- Current instance reference

___

### eq

▸ **eq**(`coins`): `boolean`

Checks if instance value equal another [Coins](Coins.md) instance value

**`example`**
```ts
import { Coins } from 'ton3-core'

const coins = new Coins('10')
const equal = new Coins('10')
const notEqual = new Coins('11')

console.log(equal.eq(coins), notEqual.eq(coins)) // true, false
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `coins` | [`Coins`](Coins.md) |

#### Returns

`boolean`

___

### gt

▸ **gt**(`coins`): `boolean`

Checks if instance value greater than another [Coins](Coins.md) instance value

**`example`**
```ts
import { Coins } from 'ton3-core'

const coins = new Coins('10')
const equal = new Coins('10')
const greater = new Coins('11')

console.log(equal.gt(coins), greater.gt(coins)) // false, true
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `coins` | [`Coins`](Coins.md) |

#### Returns

`boolean`

___

### gte

▸ **gte**(`coins`): `boolean`

Checks if instance value greater than or equal another [Coins](Coins.md) instance value

**`example`**
```ts
import { Coins } from 'ton3-core'

const coins = new Coins('10')
const equal = new Coins('10')
const greater = new Coins('11')

console.log(equal.gte(coins), greater.gte(coins)) // true, true
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `coins` | [`Coins`](Coins.md) |

#### Returns

`boolean`

___

### lt

▸ **lt**(`coins`): `boolean`

Checks if instance value lesser than another [Coins](Coins.md) instance value

**`example`**
```ts
import { Coins } from 'ton3-core'

const coins = new Coins('10')
const equal = new Coins('10')
const lesser = new Coins('9')

console.log(equal.lt(coins), lesser.lt(coins)) // false, true
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `coins` | [`Coins`](Coins.md) |

#### Returns

`boolean`

___

### lte

▸ **lte**(`coins`): `boolean`

Checks if instance value lesser than or equal another [Coins](Coins.md) instance value

**`example`**
```ts
import { Coins } from 'ton3-core'

const coins = new Coins('10')
const equal = new Coins('10')
const lesser = new Coins('9')

console.log(equal.lte(coins), lesser.lte(coins)) // true, true
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `coins` | [`Coins`](Coins.md) |

#### Returns

`boolean`

___

### isNegative

▸ **isNegative**(): `boolean`

Checks if instance value is negative

**`example`**
```ts
import { Coins } from 'ton3-core'

const zero = new Coins('0')
const negative = new Coins('-1')

console.log(zero.isNegative(), negative.isNegative()) // false, true
```

#### Returns

`boolean`

___

### isPositive

▸ **isPositive**(): `boolean`

Checks if instance value is positive

**`example`**
```ts
import { Coins } from 'ton3-core'

const zero = new Coins('0')
const positive = new Coins('1')

console.log(zero.isPositive(), positive.isPositive()) // true, true
```

#### Returns

`boolean`

___

### isZero

▸ **isZero**(): `boolean`

Checks if instance value equals zero

**`example`**
```ts
import { Coins } from 'ton3-core'

const zero = new Coins('0')

console.log(zero.isZero()) // true
```

#### Returns

`boolean`

___

### toString

▸ **toString**(): `string`

Returns string representation of instance in coins

**`example`**
```ts
import { Coins } from 'ton3-core'

const coins = new Coins('100')

console.log(coins.toString()) // '100'
```

#### Returns

`string`

___

### toNano

▸ **toNano**(): `string`

Returns string representation of instance in nanocoins

**`example`**
```ts
import { Coins } from 'ton3-core'

const coins = new Coins('100')

console.log(coins.toNano()) // '100000000000'
```

#### Returns

`string`

___

### fromNano

▸ `Static` **fromNano**(`value`, `decimals?`): [`Coins`](Coins.md)

Creates instance of Coins from value in nano

**`static`**

**`example`**
```ts
import { Coins } from 'ton3-core'

const coins = Coins.fromNano('100000000000', 9)

console.log(coins.toString()) // 100 coins
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `value` | `string` \| `number` \| `bigint` | `undefined` | Value in nanocoins |
| `decimals` | `number` | `9` | - |

#### Returns

[`Coins`](Coins.md)
