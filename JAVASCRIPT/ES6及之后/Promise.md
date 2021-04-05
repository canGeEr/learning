# Promise
定义：是一种异步编程的解决方案，能够将异步操作封装，并将其返回的结果或者错误原因同Promise实例的then方法传入的处理函数联系起来

## New Promise：
- 传入构造器函数，两个参数，都是敲定函数，第一个成功的敲定，第二个失败的敲定，构造器同步执行，但是可以异步的执行敲定函数
- 构造器中调用对应的敲定函数，返回的promise实例的对象状态就是那种，当然中间能会抛出异常throw，那么…状态是拒绝
- 状态的变化只有两种 pending => fulfilled，pending => rejected，一旦发生变化就不会再改变

## Promise.then返回的Promise的状态：
- 非Promise对象，直接包裹成为Promise（Promise.resolve）
- Promise对象，状态跟随，值跟随 ，通过这一点可以串联Promise（构造器函数的成功敲定函数也是这样的功能）
- 报错返回拒绝的Promise，错误对象是Promise的错误原因

## 异常穿透：
如果实例.then方法没有处理实例状态对于的回调函数，那么.then返回的promise实例状态跟随调用then方法的promise，Catch在最后进行异常的捕获

## 中断Promise链：
处理函数返回等待状态的Promise

## 实现Promise.all方法：
new Promise找准时机调用敲定函数

## 判断Promise的执行顺序
- 注意，知道前面的Promise状态发生变化时，才能放进微任务队列
- async 返回 Promise 和 promise.thne返回 Promise 都会导致中间有两个层级的微任务队列间隔
- async 每有await延后一个层次发生，如果返回promise再加两个层级
```javascript
new Promise((resolve)=>{
	resolve()
}).then(()=>{

})

Promise.resolve().then(()=>{

})
//这两个promise的then发生的层级一致
```