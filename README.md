## 💎 ton3-core

[![npm](https://img.shields.io/npm/v/ton3-core)](https://www.npmjs.com/package/ton3-core) 
![GitHub top language](https://img.shields.io/github/languages/top/tonstack/ton3-core) 
[![Coverage Status](https://coveralls.io/repos/github/tonstack/ton3-core/badge.svg?branch=main)](https://coveralls.io/github/tonstack/ton3-core?branch=main) 
[![TON](https://img.shields.io/badge/based%20on-The%20Open%20Network-blue)](https://ton.org/)

ton3-core is a core package of ton3 inspired by [tonweb](https://github.com/toncenter/tonweb) to work with [TON blockchain](https://ton.org).\
Visit [documentation](./docs/) to see API reference.
> :warning: Work in progress, API can (and most likely will) be changed! This is not production ready version yet.

## How to install
```
npm i ton3-core
```

## Simple usage
```typescript
import { BOC, Builder, Mnemonic } from 'ton3-core'

const mnemonic = new Mnemonic()

console.log(mnemonic.words) // prints mnemonic phrase
console.log(mnemonic.keys.private) // prints private key
console.log(mnemonic.keys.public) // prints public key

const text = 'Hello, World!'
const cell = new Builder()
    .storeString(text)
    .cell()

const boc = BOC.toBytesStandard(cell)
const result = BOC.fromStandard(boc)
    .parse()
    .loadString()

console.log(text === result) // true
```

## Features and status

| Feature                                     | Status  |
|---------------------------------------------|-------- |
| Ordinary BOC (de)serialization              | ✅      |
| Builder, Cell, Slice                        | ✅      |
| Hashmap (dictionary) (de)serialization      | ✅      |
| Mnemonic/keypair with bip39 + ed25519       | ✅      |
| Coins (class for Toncoin, Nanocoin e.t.c.)  | ✅      |
| Address (class for TON address)             | ✅      |
| Message layouts (such as MessageX e.t.c.)   | ✅      |
| Old "tonweb" style mnemonic support         | ❌      |
| ~100% tests coverage                        | ❌      |
| Pre-release code review                     | ❌      |

## License

MIT License
