# 准备工作和对Promise简单理解
> 参考资料
- [Promise描述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise#Promise%E7%9A%84%E9%93%BE%E5%BC%8F%E8%B0%83%E7%94%A8) MDN
- [Promise使用](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises) MDN
- [Promise前端进阶必学](https://www.bilibili.com/video/BV1MJ41197Eu?from=search&seid=7158930679990241157) 尚硅谷

## 一、准备工作
### (1) 什么是实例对象，什么是函数对象
任何对象都是实例对象，即使是函数对象，它也是通过new Function形成的函数，它本质上是Function类的实例      
但是我们为什么要区分函数对象和实例对象呢？      
分清楚 属性 或者 方法 是属于 类 还是 类的实例

简单一点的说：
```javascript
new Promise
//当Promise被new的时候产生的对象是Promise的实例对象
const promise = new Promise(...)//
//promise.then、promise.catch 调用的是实例方法

Promise[...]
//Promise.all、Promise.race、Promise.resolve、Promise.rejected
```

=> . 的左边是对象，( ) 的左边是函数

### (2) 回调函数
三个条件：
- 回调函数是开发人员定义的
- 开发人员不亲自调用
- 最后函数执行了

两种类型：
- 异步回调：不立即执行，不会阻塞后续代码执行，放入事件循环队列，等待轮到该事件，执行回调
- 同步回调：立即执行，不放入事件队列，阻塞后续代码执行（只有同步回调完成，才能继续执行代码）


如何判断回调是什么类型：        
看是否阻塞后续代码的执行

```javascript
asyncFun(()=>{
    console.log('回调完成')
});
console.log('代码执行完成')
```
由上，只需知道两个log的顺序就能知道asyncFun传入的回调函数，是异步还是同步

### (3) 错误处理
[JavaScript 错误处理](https://blog.csdn.net/wucan111/article/details/112069196) 我的另外一篇文章

## 二、Promise的基本理解


### (1) What? 什么是Promise
> Promise 是JS解决异步编程的新的解决方案，当然不是最终方案；语法上Promise是一个构造函数，功能上可以封装异步操作，并获取结果

Promise词义是：承诺，就和它的语义一样，它能将异步操作封装成一个Promise实例，等待异步完成，并保存异步操作的结果；其内的状态表示是否完成承诺，resolve表示完成，reject表示拒绝，then表示完成承诺之后要做的事情

### (2) Why? 为什么要Promise
1. 指定回调的方式更加灵活
2. 缓解了嵌套回调编程难以编写，阅读，理解的尴尬局面
3. 对错误的处理更加方便简洁，错误透传

这些东西都会通过后面的例子或者一些讲解体现，我们一步步来
### (3) How? 怎么使用
既然Promise是一个构造函数，     
第一步，创建一个Promise实例：
```javascript
const promise = new Promise(...)
```
我们有想起来了构造函数一般要进行初始化们可以传递参数，Promise需要一个函数作为参数，这个函数通常叫做executor（构造器函数） 

第二步，new的时候传入一个executor函数，函数有两个参数 resolve, reject：
```javascript
const promise = new Promise((fufill, reject)=>{

})
```
resolve表示完成承诺，reject表示拒绝承诺；Promise实例一旦创建，它的一个属性status（假设叫做状态属性）初始状态为pendding，处于等待完成或者拒绝承诺的状态。一旦调用resolve函数表示完成承诺，Prmoise实例状态变为resolved，相反一旦reject调用，实例状态变为rejected

第三步，我们触发ajax，发动异步任务，当成功时，执行resolve函数：
```javascript
const promise = new Promise((fufill, reject)=>{
    $.ajax(Object.assign(config, {success: res=>{
        resolve(res)
    }}))
})
```
当ajax成功并返回结果时，调用resolve并传入参数，但是这个时候我们并没有处理结果，于是我们在Promise的实例上需要通过then方法进行指定异步任务

第四步，通过then方法指定异步任务回调函数，成功回调onReolved, 失败回调onRejected：
```javascript
promise.then(
    value => {//onReolved

    },
    errorReason => {//onRejected

    }   
)
```
诶这个时候可能会说，ajax并没有指定失败时候的Promise的实例状态啊，肯定不会触发 onRejected，因此我们修改代码为：
```javascript
const promise = new Promise((resolve, reject)=>{
    $.ajax(Object.assign(config, {
        success: res =>{
            resolve(res)
        },
        fail: errorReason =>{
            reject(res)
        }
    }))
})
```
这样，如果ajax失败就会触发reject函数，then的onRejected就会被触发