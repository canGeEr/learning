const IndexModule = require('./index')

const array1 = [1, 2, 3, 4, 5]
const array2 = [1, 2, 4, 5, 6, 7, 8]

console.log(
  IndexModule.operateArrayCollection(
    array1, array2,
    IndexModule.CollectionOperate.Difference
  ),
  IndexModule.operateArrayCollection(
    array2, array1,
    IndexModule.CollectionOperate.Difference
  ),
  IndexModule.operateArrayCollection(
    array1, array2,
    IndexModule.CollectionOperate.Complement
  )
)