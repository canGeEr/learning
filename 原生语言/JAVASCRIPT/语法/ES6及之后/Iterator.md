## 迭代器
> **迭代器**：是一个对象，它能对某个集合的值通过某些操作（next）进行遍历，并保持任何必要的状态，以便能够跟踪到当前的位置。

```javascript
//在权威指南中，提到的迭代器还是1.7版本，距离今天已经太久远了，ES6的iterator已经改变了很多规则，建议直接看ES6的Iterator
function iterator() {
  let count = 0
  return {
    next: function() {
      return count++
    }
  }
}
const myIterator = iterator()
 
console.log(myIterator.next())
```
根据以上介绍，如果
1. 当迭代器用于有限值集合时，遍历完没有值时抛出StopIteration错误对象（如果想要更细致了解看 权威指南）
2. 迭代的值的集合不一定要是本身，但是为了方便，及维护，现在一般直接使用**可迭代对象**（在ES6中，是一个包含以Symbol.iterator为属性名的迭代器生成函数的对象），而不选择用迭代器生产函数获取对象。
3. 基于2代码
```javascript
const myCanIterateObj = {
  '0': 1,
  '1': 2,
  '2': 3,
  length: 3,
  [Symbol.iterator]: function() {
    let fackArrLength = this.length
    let thisIndex = 0
    let that = this
    return {
      next: function() {
        if(thisIndex < fackArrLength) {
          return {
            value: that[thisIndex++],
            done: false
          }
          // return that[thisIndex++] 不一定要是对象格式
        }else {
          return {
            value: undefined,
            done: true
          }
        }
      }
    }
  }
}

//默认会调用迭代器生成函数进行迭代
for(let index of myCanIterateObj) {
  console.log(index)
}
```


```javascript
const iterator = myCanIterateObj[Symbol.iterator]()
console.log(iterator.next())
//{value: 1, done: false}
console.log(iterator.next())
//{value: 2, done: false}
console.log(iterator.next())
//{value: 3, done: false}
console.log(iterator.next())
//{value: undefined, done: true}
```

## iterator && ES6
iterator 是 ES6 引入的一种新的遍历机制，迭代器有两个核心概念：

迭代器是一个统一的接口，它的作用是使各种数据结构可被便捷的访问，它是通过一个键为Symbol.iterator 的方法来实现。
迭代器是用于遍历数据结构元素的指针（如数据库中的游标）

### 迭代过程
迭代的过程如下：

通过 Symbol.iterator 创建一个迭代器，指向当前数据结构的起始位置     
随后通过 next 方法进行向下迭代指向下一个位置， next 方法会返回当前位置的对象，对象包含了 value 和 done 两个属性， value 是当前属性的值， done 用于判断是否遍历结束      
当 done 为 true 时则遍历结束




### 配套的for of 循环
for...of 是 ES6 新引入的循环，用于替代 for..in 和 forEach() ，并且支持**新的迭代协议**。它可用于迭代常规的数据类型，如 Array 、 String 、 Map 和 Set 等等。专门用于迭代

常有 ： Array | String | Map | Set | NodeList | Html.....



### 使用场景
(1) 解构赋值        
对数组和 Set 结构进行解构赋值时，会默认调用Symbol.iterator方法。        

(2) 扩展运算符      
扩展运算符（...）也会调用默认的 Iterator 接口。   

(3) yield*      
yield*后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。

(4) 其他场合

由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。下面是一些例子。

for...of        
Array.from()        
Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）    
Promise.all()
Promise.race()