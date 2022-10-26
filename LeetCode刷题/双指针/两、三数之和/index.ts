// 三个数的和为零
function threeNumSum(array: number[]) {
  const target: Array<[number, number, number]> = []
  const len = array.length;
  // 按小到大排序
  array.sort((a, b) => a >= b ? 1 : -1);
  for(let i=0; i<len-2; i++) {
    let j = i + 1, k = len - 1;
    while(j < k) {
      let sum = array[j] + array[k] + array[i]
      if(sum === 0) {
        target.push([i, j, k])
        j += 1;
        k -= 1;
      }
      if(sum > 0) k -= 1;
      if(sum < 0) j += 1;
    }
  }

  // 这里其实还需要去重一次
  return target.map(item => item.map(index => array[index]))
}

module.exports = {
  threeNumSum
}