const IndexModule = require('./index')

const array1 = [1, 2, 3, 6, 7, 9, 12]

const array2 = [-1, 0, 1, 2, 4, 5, 8, 10, 11, 13, 14, 15]

console.log(
  IndexModule.mergeOrderlyArray(
    array1,
    array2
  )
)