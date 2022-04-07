import { Builder, Cell, BOC, Slice } from '../src/boc'
import { Hashmap } from '../src/boc/hashmap'

const cell = BOC.fromStandard('B5EE9C72410107010025000202C8010202016203040007BEFDF21802016E05060007A08090C00005500A980005400AA879452081')
const cell2 = BOC.fromStandard('B5EE9C7241010501001D0002012001020201CF03040009BC0068054C0007B91012180007BEFDF218CFA830D9')

const serializers = {
    key: (k: number): Bit[] => new Builder().storeUint(k, 16).bits,
    value: (v: number): Cell => new Builder().storeUint(v, 16).cell()
}

const deserializers = {
    key: (k: Bit[]): number => Slice.parse(new Builder().storeBits(k).cell()).loadUint(16),
    value: (v: Cell): number => Slice.parse(v).loadUint(16)
}

const dict = new Hashmap<number, number>(16, { serializers })

dict.set(13, 169)
dict.set(17, 289)
// dict.set(14, 170)
dict.set(239, 57121)

const result = dict.cell()

const dict2 = new Hashmap<number, number>(16, { serializers })

dict2.set(17, 289)
dict2.set(239, 57121)
dict2.set(32781, 169)

const result2 = dict2.cell()

const result3 = Hashmap.parse(Slice.parse(result2), 16, { serializers, deserializers })

console.log('----- simple - by fift')
console.log(cell.hash())
console.log(cell.print())
console.log('----- simple - by tontools')
console.log(result.hash())
console.log(result.print())
console.log('----- both-edges - by fift')
console.log(cell2.hash())
console.log(cell2.print())
console.log('----- both-edges - by tontools')
console.log(result2.hash())
console.log(result2.print())
console.log([ ...result3 ])
