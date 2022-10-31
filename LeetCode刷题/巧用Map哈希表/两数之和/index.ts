enum CollectionOperate {
  // 交集
  Intersection = 0,
  // 并集
  Union = 1,
  // 补集
  Complement = 2,
  // 差集
  Difference = 3,
}

function operateArrayCollection<T = any>(array1: T[], array2: T [], operate: CollectionOperate) {
  if(operate === CollectionOperate.Difference) {
    return operateArrayCollectionByDifference(array1, array2)
  }
  
  // 遍历所有数组，存储每个元素的出现次数
  const map = new Map<T, number>()
  for(const array of [array1, array2]) {
    for(let i=0; i < array.length; i++) {
      const value = array[i]
      const lastTimes = map.get(value)
      map.set(value, (lastTimes || 0) + 1)
    }
  }
  // 交集就是找到value出现次数为2次以上
  if(operate === CollectionOperate.Intersection) {
    const target: T [] = []
    for(const [value, lastTimes] of map.entries()) {
      if(lastTimes >= 2) target.push(value)
    }
    return target
  }
  // 并集就是所有出现的value
  if(operate === CollectionOperate.Union) {
    return Array.from(map.keys())
  }
  // 补集就是value只出现一次，这个也是求出在A不在B U 在B不在A
  if(operate === CollectionOperate.Complement) {
    const target: T [] = []
    for(const [value, lastTimes] of map.entries()) {
      if(lastTimes === 1) target.push(value)
    }
    return target
  }
}

function operateArrayCollectionByDifference<T>(array1: T[], array2: T []) {
  const target: T [] = []
  // 遍历所有数组，存储每个元素的出现次数
  const map = new Map<T, boolean>()
  for(let i=0; i < array2.length; i++) {
    map.set(array2[i], true)
  }
  for(let i=0; i < array1.length; i++) {
    const value = array1[i]
    if(!map.has(value)) {
      target.push(value)
    }
  }
  return target
}

module.exports = {
  operateArrayCollectionByDifference,
  operateArrayCollection,
  CollectionOperate
}