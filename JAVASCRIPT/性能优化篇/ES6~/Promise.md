# Promise 

## 概述
是异步编程的一种解决方案。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。

## 三态，且**无退路**
Promise 异步操作有三种状态：pending（进行中）、fulfilled（已成功）和 rejected（已失败）。除了异步操作的结果，任何其他操作都无法改变这个状态。

## 创建一个Promise

```javascript
const promiseReturnValue =new Promise(function(resolve, reject) {
    .....resolve([值，可被外界then参数接收到])
    .....reject([同上])
})
promiseReturnValue.then(([success])=>{

}, ([err])=> {

}))
.catch(error => console.log(error));
//防止出错
.then....
//实质还是回调
```