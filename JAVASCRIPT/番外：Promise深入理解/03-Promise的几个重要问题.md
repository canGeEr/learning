# Promise的几个重要问题

## 一、 Promise什么时候发生状态改变？什么时候获取值？
前面说过Promise的excutor是同步执行的回调函数，但是可以触发异步任务，因此有两种情况：
- 在excutor执行器中立即同步执行调用敲定函数，于是同步的实例改变状态并且获取到结果

- 在excutor执行器中异步的执行调用敲定函数，比如setTimeout，于是异步的改变实例状态并获取结果


## 二、Promise的实例什么一定要改变状态前指定回调函数吗？
不！Promise的实例可以在任何时候指定或者说绑定回调函数
- 改变前：

    ```javascript
    const promise = new Promise((fulfill, reject) => {
        setTimeout(()=>{
            fulfill(true)
        }, 1000)
    })
    promise.then(onFulfilled, onRejected)
    ```

- 改变后：
    同步的改变状态
    ```javascript
    const promise = new Promise((fulfill, reject) => {
        fulfill(true)
    })
    promise.then(onFulfilled, onRejected)
    ```
    或者，异步的绑定回调
    ```javascript
    const promise = new Promise((fulfill, reject) => {
        setTimeout(()=>{
            fulfill(true)
        }, 1000)
    })
    setTimeout(()=>{
        promise.then(onFulfilled, onRejected)
    }, 2000)
    ```

## 三、 Promise的实例可以绑定多个then还是只能绑定最后一个？
可以绑定多个，一旦promise实例的状态发生转变，按照绑定顺序依次调用

```javascript
const promise = new Promise((fulfill, reject) => {
    setTimeout(()=>{
        fulfill(true)
    }, 1000)
})
promise.then(onFulfilled1, onRejected1)
promise.then(onFulfilled2, onRejected2)
```
最终 onFulfilled1 和 onFulfilled2 依次执行


## 四、 excutor 执行器 和 then 的回调函数的关系
我们先整理一下，什么操作能产生Promise实例
- new Prmoise(excutor)
- Prmoise.resolve
- Prmoise.reject
- Prmoise的实例调用then等方法
- promise.all、any等静态方法 这个单独考虑
<!-- 
其中promise.all、any和Prmoise.reject、Prmoise.resolve类似 -->
我们对齐分类：
- promise.all、any，对多个promise进行处理，并发或者竞争

- 使用 excutor ，能够实现从0到有，即new Prmoise(excutor)，Prmoise.resolve和Prmoise.reject只不过是对其的简写，特别是thenable对象的then几乎和 excutor 一模一样

- then等方法，它显得极为特殊，是在原有的promise新生成一个promise（注意原来的Promise实例每调用生成的新的Promise实例都是不同的）


但是如果你对then的结构、行为、效果仔细分析，它其实也是某种意义上的 excutor，我们假设一个场景：
```javascript
const promise = new Promise((fulfill, reject) => {
    setTimeout(()=>{
        fulfill(true)
    }, 1000)
})
promise.then(onFulfilled, onRejected)
```
根据promise.then的效果写一些伪代码：
```javascript
/*
当事件轮询到执行Promise回调时

if 当前的Promise实例状态发生了改变 {
    if(改变的状态为 fulfilled) {
        执行onFulfilled函数
    }else if(改变的状态为 rejected) {
        执行onRejected函数
    }
    根据状态处理函数结果返回 新的 Promise实例
}
*/
```

功能上，then的两个处理函数 是对 excutor 的分解，onFulfilled的执行不仅仅是处理当前Promise实例的值，更是由其返回的值敲定新的Promise的状态并保存结果，onRejected也是如此。
对于返回的新的Promise实例其内部就像执行如下函数      
- fullfill(onFulfilledResult)
- reject(onRejectedResult)

看下面这段代码
```javascript
let promise = new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve(new Promise((resolve, reject) => {
            setTimeout(()=>{
                resolve(1)
                console.log('内层promise')
            }, 1000)
        }))
        console.log('外层promise')
    }, 1000)
}).then((value)=>{
    console.log(value)
})
```
这里的resolve接受参数返回的新的Promise实例和then的onFulfilled调用返回值决定的新的Promise实例是一致的


## 五、串联多个Promise任务
只要在excutor执行器上敲定函数的实参 或者 then的回调函数返回值 指定的需要串联的Promise实例，返回的新的Promise就会"跟随"传入该实例

## 六、异常穿透 => catch
```javascript
let onFulfilled1 = function(value) {
    console.log(value)
}
let onFulfilled2 = onFulfilled1
let onFulfilled3 = onFulfilled2


let onRejected = function(error) {
    console.log(error, '错误获取')
    console.log(promise2 === promise1)
}

const promise = new Promise((fulfill, reject) => {
    setTimeout(()=>{
        reject(true)
    }, 1000)
})

const promise1 = promise.then()
const promise2 = promise1.then()

promise2.then(onFulfilled3)
.catch(onRejected)
```
如果当前调用then方法的Promise实例已经发生状态变化，并返回结果，但是找不到then传入的处理对应的处理函数，并不会丢失，而是交给新返回的Promise实例使得新的实例的then能够处理到上一个实例的结果。        
或者说，如果then函数没有传入当前Promise实例对应状态的处理函数，那么默认返回一个和当前Promise实例状态相同，结果相同的**新的Promise**

## 七、中断Promise链
只要Promise的实例状态不敲定，那么then的回调不会执行


```javascript
let promise
promise = new Promise((fulfill, reject) => {
    setTimeout(()=>{
        reject(true)
    }, 1000)
})
promise.then(
    value => {
        return new Promise((fulfill, reject) => {})//返回未敲定的Promise实例
    },
    errorReason => {
        return new Promise((fulfill, reject) => {})//返回未敲定的Promise实例
    }
)

//或者

promise = new Promise((fulfill, reject) => {
    setTimeout(()=>{
        reject(true)
    }, 1000)
})
promise.finally(()=>{
    return new Promise((fulfill, reject) => {})//返回未敲定的Promise实例
})
```