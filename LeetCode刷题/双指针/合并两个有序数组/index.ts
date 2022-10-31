// 合并有序数组
export function mergeOrderlyArray<T>(array1: T[], array2: T[]) {
  const m = array1.length, n = array2.length;
  let i1 = m - 1, i2 = n-1, i3 = m + n -1;
  // array1 和 array2长度不确定，不知道谁先遍历完
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
/**
 * 有的时候不知道循环或者遍历的边界在哪里，尝试找到当前循环下标什么时候越界
 */