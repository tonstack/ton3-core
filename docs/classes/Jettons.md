[ton3-core](../README.md) / Jettons

# Class: Jettons

## Hierarchy

- **`Jettons`**

  ↳ [`Coins`](Coins.md)

## Table of contents

### Methods

- [add](Jettons.md#add)
- [sub](Jettons.md#sub)
- [mul](Jettons.md#mul)
- [div](Jettons.md#div)
- [eq](Jettons.md#eq)
- [gt](Jettons.md#gt)
- [gte](Jettons.md#gte)
- [lt](Jettons.md#lt)
- [lte](Jettons.md#lte)
- [isNegative](Jettons.md#isnegative)
- [isPositive](Jettons.md#ispositive)
- [isZero](Jettons.md#iszero)
- [toString](Jettons.md#tostring)
- [toNano](Jettons.md#tonano)
- [fromNano](Jettons.md#fromnano)

### Constructors

- [constructor](Jettons.md#constructor)

## Methods

### add

▸ **add**(`value`): [`Jettons`](Jettons.md)

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
| `value` | `string` \| `number` \| `bigint` \| [`Jettons`](Jettons.md) |

#### Returns

[`Jettons`](Jettons.md)

- Current instance reference

___

### sub

▸ **sub**(`value`): [`Jettons`](Jettons.md)

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
| `value` | `string` \| `number` \| `bigint` \| [`Jettons`](Jettons.md) |

#### Returns

[`Jettons`](Jettons.md)

- Current instance reference

___

### mul

▸ **mul**(`value`): [`Jettons`](Jettons.md)

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
| `value` | `string` \| `number` \| `bigint` \| [`Jettons`](Jettons.md) |

#### Returns

[`Jettons`](Jettons.md)

- Current instance reference

___

### div

▸ **div**(`value`): [`Jettons`](Jettons.md)

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
| `value` | `string` \| `number` \| `bigint` \| [`Jettons`](Jettons.md) |

#### Returns

[`Jettons`](Jettons.md)

- Current instance reference

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

console.log(equal.eq(coins), notEqual.eq(coins)) // true, false
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Jettons`](Jettons.md) |

#### Returns

`boolean`

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

console.log(equal.gt(coins), greater.gt(coins)) // false, true
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Jettons`](Jettons.md) |

#### Returns

`boolean`

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

console.log(equal.gte(coins), greater.gte(coins)) // true, true
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Jettons`](Jettons.md) |

#### Returns

`boolean`

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

console.log(equal.lt(coins), lesser.lt(coins)) // false, true
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Jettons`](Jettons.md) |

#### Returns

`boolean`

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

console.log(equal.lte(coins), lesser.lte(coins)) // true, true
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Jettons`](Jettons.md) |

#### Returns

`boolean`

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

___

### toString

▸ **toString**(): `string`

Returns string representation of instance in coins

**`example`**
```ts
import { Jettons } from 'ton3-core'

const jettons = new Jettons('100')

console.log(jettons.toString()) // '100'
```

#### Returns

`string`

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

___

### fromNano

▸ `Static` **fromNano**(`value`, `decimals?`): [`Jettons`](Jettons.md)

Creates instance of Jettons from value in nano

**`static`**

**`example`**
```ts
import { Jettons } from 'ton3-core'

const jettons = Jettons.fromNano('100000000000', 9)

console.log(jettons.toString()) // 100 coins
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `value` | `string` \| `number` \| `bigint` | `undefined` | Value in nanojettons |
| `decimals` | `number` | `9` | - |

#### Returns

[`Jettons`](Jettons.md)

## Constructors

### constructor

• **new Jettons**(`value`, `options?`)

Creates an instance of [Jettons](Jettons.md)

**`example`**
```ts
import { Jettons } from 'ton3-core'

const jettons = new Jettons('100')

new Jettons(coins)
new Jettons(BigInt('100'))
new Jettons(100)
new Jettons('100')
new Jettons('100000', { isNano: true, decimals: 3 })
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` \| `bigint` \| [`Jettons`](Jettons.md) |
| `options?` | [`JettonsOptions`](../interfaces/JettonsOptions.md) |
