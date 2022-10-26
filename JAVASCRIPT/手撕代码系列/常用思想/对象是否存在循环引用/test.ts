const IndexModule = require('./index')

const a: any = { b: undefined} 
const b: any = { a: undefined}
const c = {c: 'c'}
a.b = b
b.a = c


const pathCollection: any [] = []

console.log(
  IndexModule.circleLink(a),
  IndexModule.circleLink(b),
  IndexModule.circleLink({ property: { circle: a } }, pathCollection),
  IndexModule.circleLink({ 
    a: c,
    b: c
  }),
  pathCollection
)

// 怎么判断两个对象是否循环引用， A， B
const aPathCollection: any [] = [];
const bPathCollection: any [] = [];

console.log(
  IndexModule.circleLink(a, aPathCollection),
  IndexModule.circleLink(b, bPathCollection),
  aPathCollection.some(linkPath => linkPath.includes(b)),
  bPathCollection.some(linkPath => linkPath.includes(a)),
)
