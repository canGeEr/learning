// 合并有序数组
export function mergeOrderlyArray<T>(array1: T[], array2: T[]) {
  const m = array1.length, n = array2.length;
  let i1 = m - 1, i2 = n-1, i3 = m + n -1;
  while(i2 >= 0 && i1 >= 0) {
    if(array1[i1] >= array2[i2]) {
      array1[i3] = array1[i1]
      i1 -= 1
    } else {
      array1[i3] = array2[i2]
      i2 -= 1
    }
    i3 -= 1
  }

  while(i2 >= 0) {
    array1[i3] = array2[i2]
    i2 -= 1
    i3 -= 1
  }

  return array1
}

module.exports = {
  mergeOrderlyArray
}