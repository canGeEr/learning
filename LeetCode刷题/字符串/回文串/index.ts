// 判断是否回文
function isPalindrome(str: string, left: number = 0, right: number = str.length - 1) {
  // const len = str.length
  // 边界问题可以考虑碰撞
  // for(let i=0; i * 2 < len - 1; i++) {
  //   if(str[i] !== str[len - i - 1]) {
  //     return false
  //   }
  // }
  while(left < right) {
    if(str[left] !== str[right]) {
      return false
    }
    left += 1;
    right -= 1;
  }
  return true
}


// 删除一个字符是否可以是回文字符串
function deleteOneSsPalindrome(str: string) {
  const len = str.length
  // 边界问题可以考虑碰撞
  let left = 0, right = len - 1;
  while(left < right) {
    if(str[left] !== str[right]) {
      return isPalindrome(str, left + 1, right) || isPalindrome(str, left, right + 1)
    } else {
      left += 1;
      right -= 1;
    }
  }
  return true
}


module.exports = {
  isPalindrome,
  deleteOneSsPalindrome
}