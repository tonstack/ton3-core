[ton3-core](../README.md) / Address

# Class: Address

Smart contract address

## Table of contents

### Constructors

- [constructor](Address.md#constructor)

### Accessors

- [hash](Address.md#hash)
- [workchain](Address.md#workchain)
- [bounceable](Address.md#bounceable)
- [testOnly](Address.md#testonly)

### Methods

- [eq](Address.md#eq)
- [toString](Address.md#tostring)
- [isValid](Address.md#isvalid)

### Properties

- [NONE](Address.md#none)

## Constructors

### constructor

• **new Address**(`address`, `options?`)

Creates an instance of [Address](Address.md)

Next formats can be used as constructor argument:
- Raw
- Base64
- Address

**`example`**
```ts
import { Address } from 'ton3-core'

const address = new Address('kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny')
const rewrite = { workchain: 0, bounceable: true, testOnly: true }

new Address('-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260')
new Address('-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260', rewrite)
new Address('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')
new Address(address)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` \| [`Address`](Address.md) |
| `options?` | [`AddressRewriteOptions`](../interfaces/AddressRewriteOptions.md) |

## Accessors

### hash

• `get` **hash**(): `Uint8Array`

Get parsed [Address](Address.md) hash part

**`example`**
```ts
import { Address, Utils } from 'ton3-core'

const address = new Address('-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260')
const hash = address.hash // Uint8Array

console.log(Utils.Helpers.bytesToHex(hash))
// fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260
```

#### Returns

`Uint8Array`

___

### workchain

• `get` **workchain**(): `number`

Get parsed [Address](Address.md) workchain

**`example`**
```ts
import { Address } from 'ton3-core'

const address = new Address('-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260')

console.log(address.workchain)
// -1
```

#### Returns

`number`

___

### bounceable

• `get` **bounceable**(): `boolean`

Get parsed [Address](Address.md) bounceable flag

**`example`**
```ts
import { Address } from 'ton3-core'

const address = new Address('-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260')

console.log(address.bounceable)
// false
```

#### Returns

`boolean`

___

### testOnly

• `get` **testOnly**(): `boolean`

Get parsed [Address](Address.md) testOnly flag

**`example`**
```ts
import { Address } from 'ton3-core'

const address = new Address('-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260')

console.log(address.testOnly)
// false
```

#### Returns

`boolean`

## Methods

### eq

▸ **eq**(`address`): `boolean`

Compare instances of [Address](Address.md) for hash and workchain equality

**`example`**
```ts
import { Address } from 'ton3-core'

const address1 = new Address('-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260')
const address2 = new Address('kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny')

console.log(address1.eq(address2))
// true
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](Address.md) | Instance of another [Address](Address.md) |

#### Returns

`boolean`

___

### toString

▸ **toString**(`type?`, `options?`): `string`

Get raw or base64 representation of [Address](Address.md)

**`example`**
```ts
import { Address } from 'ton3-core'

const raw = '-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260'
const address = new Address(raw, { bounceable: true, testOnly: true })

console.log(address.toString('base64'))
// kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny

console.log(address.toString('base64', { urlSafe: false }))
// kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny

console.log(address.toString('raw', { workchain: 0 }))
// 0:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `type` | [`AddressType`](../README.md#addresstype) | `'base64'` |
| `options?` | [`AddressStringifyOptions`](../interfaces/AddressStringifyOptions.md) | `undefined` |

#### Returns

`string`

___

### isValid

▸ `Static` **isValid**(`address`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `any` |

#### Returns

`boolean`

## Properties

### NONE

▪ `Static` `Readonly` **NONE**: `any` = `null`

Helper method for writing null addresses to [Builder](Builder.md)

**`static`**
