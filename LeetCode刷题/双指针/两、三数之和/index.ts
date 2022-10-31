// 三个数的和为零
function threeNumSum(array: number[]) {
  const target: Array<[number, number, number]> = []
  const len = array.length;
  // 按小到大排序
  array.sort((a, b) => a >= b ? 1 : -1);
  for(let i=0; i<len-2; i++) {
    let j = i + 1, k = len - 1;
    // 排好序之后，第一个只大于0肯定不可能
    // 前后数值相同直接跳过前一次
    if(array[i] > 0 || (i > 0 && array[i - 1] === array[i])) {
      continue
    }

    while(j < k) {
      let sum = array[j] + array[k] + array[i]
      // 确认该数字没用之后，才能去重
      if(sum === 0) {
        target.push([i, j, k])
        j += 1;
        k -= 1;
        while(j < k && array[j] === array[j - 1]) j += 1
        while(j < k && array[k] === array[k + 1]) k -= 1
      }
      if(sum > 0) {
        k -= 1;
        while(j < k && array[k] === array[k + 1]) k -= 1
      }
      if(sum < 0) {
        j += 1;
        while(j < k && array[j] === array[j - 1]) j += 1
      }
    }
  }

  // 这里其实还需要去重一次
  return target.map(item => item.map(index => array[index]))
}

module.exports = {
  threeNumSum
}