type OBJECT = Record<string | symbol, any>

// 判断一个对象是否循环引用
function circleLink(judgeObject: OBJECT, pathCollection: OBJECT [] = [], parentObjectPaths: OBJECT [] = []) {
  const addPathCollection = () => {
    pathCollection.push([...parentObjectPaths, judgeObject])
  }

  const valueTypeof = typeof judgeObject
  // 非object类型肯定不是循环引用
  if(!(judgeObject !== null && valueTypeof === 'object' || valueTypeof === 'function')) {
    addPathCollection()
    return false
  }
  // 如果当前value和父级值相同，说明递归回去了
  if(parentObjectPaths.includes(judgeObject)) {
    addPathCollection()
    return true
  }
  const objectKeys = Reflect.ownKeys(judgeObject)

  let isCircleLink = false
  for(const key of objectKeys) {
    const value = judgeObject[key]
    if(circleLink(value, pathCollection, [...parentObjectPaths, judgeObject])) {
      isCircleLink = true
    }
  }
  // 叶子节点
  if(objectKeys.length === 0) {
    addPathCollection()
  }
  return isCircleLink
}

module.exports = {
  circleLink
}
