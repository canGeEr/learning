# Promise状态和执行过程
> 参考资料
- [Promise描述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise#Promise%E7%9A%84%E9%93%BE%E5%BC%8F%E8%B0%83%E7%94%A8) MDN
- [Promise使用](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises) MDN
- [Promise前端进阶必学](https://www.bilibili.com/video/BV1MJ41197Eu?from=search&seid=7158930679990241157) 尚硅谷

> 如果你自己阅读 MDN，并且对一些晦涩词汇准确理解，可能没有太大的必要看这篇文章；如果你还是想看一下的话并且上从第一篇文章进来的话，这篇文章将重新介绍 Promise

## 一、Promise的描述
Promise是一个构造函数，是一个类 => 承诺类（我个人喜欢这么叫）；     
Promise的实例对象代表一个在这个 promise 被创建出来时不一定已知的值，它让您能够把异步操作最终的成功返回值或者失败原因和相应的处理程序关联起来（通过then）。 这样使得异步方法可以像同步方法那样返回值：异步方法并不会立即返回最终的值，而是会返回一个promise，以便在未来某个时候把值交给使用者

## 二、Promise的状态
上面说了每个Promise实例都像一个承诺，       
一旦你立下一个承诺 => new Promise；     
立下承诺的时候说好什么时候 兑现，或者拒绝 => 触发异步任务，回调完成执行 fulfill，reject；     
当然如果你任性的话可以当场兑现或者拒绝，即new Promise立下承诺就立即兑现fulfill 或者拒绝reject；     
```javascript
let promise
promise = new Promise((fulfill, reject)=>{
    //触发异步
    $.ajax(Object.assign(config, {
        success: res =>{
            fulfill(res)
        },
        fail: errorReason =>{
            reject(res)
        }
    }))
})
//或者
promise = new Promise((fulfill, reject)=>{ //直接变更状态
    fulfill(res)
    // reject(res)
})
```
无论调用哪个敲定（settle）函数，都会变更当前Promise实例的状态
- 变更只有两种过程
    - pending => fulfilled
    - pending => rejected
- 由于上面的只有两种过程，这也意味这，该实例的状态变更是不可逆的，变更之后是不可改的，也就是敲定状态（settled）


## 三、Promise的构造函数参数 => excutor构造器
excutor是明显一个回调函数，理所应当的接受参数，规定有两个函数参数作为回调函数 => fulfill，reject（敲定函数）        
上面是最基础的，下面比较难懂
- excutor 是同步回调，但是可以触发异步任务，即决定什么时候调用敲定函数
- 一旦改变状态之后即调用敲定函数之后，立即将结果保存给promise实例，再次调用任何敲定函数是无效的，即使是抛出异常

    ```javascript
    let thenProm = new Promise((fulfill, reject)=>{
        setTimeout(()=>{
            fulfill(33) //当即保存结果，并锁定
            fulfill(44)
        },2000)
    }).then((value)=>{ // 33
        console.log(value)
    })
    ```
- 抛出异常的效果就和 reject 敲定函数类似，只是传入的错误原因是错误对象，并且会阻止下面代码继续执行（excutor代码）
- 如果在抛出异常之前就敲定了Promise实例的状态，抛出异常只是有阻止代码先下执行（excutor代码）的效果
## 四、Promise流程图
![Promise流程图](https://img-blog.csdnimg.cn/20210102095107546.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3d1Y2FuMTEx,size_16,color_FFFFFF,t_70#pic_center)

## 五、Promise.resolve 和 Promise.reject
> Promise.resolve 和 Promise.reject 是 new Promise(excotor) 的 "语法糖"

如果你只是需要一个同步敲定状态的的promise，你如果还要写一个excotor就显得麻烦，比较你的目标已经明确 => 一个已经敲定的promise 非 fulfilled 即 rejected        

- Promise.resolve直接传入参数，对于参数，如果这个值是一个 promise ，那么将***直接返回这个 promise*** ；如果这个值是thenable（即带有"then" 方法），返回的promise会“跟随”这个thenable的对象，采用它的最终状态（then里面可能又fulfill其它promise）；否则返回的promise将以此值完成。此函数将类promise对象的多层嵌套展平。

    ```javascript
    const thenable = {
        then: function(fulfill, reject) { 
            fulfill("fulfilled!")
        }
    }
    var p1 = Promise.resolve(thenable);
    console.log(p1 instanceof Promise) // true, 这是一个Promise对象
    ```
    thenable的then其实就是一个excutor，如果这样写就和new Promise(excutor) 没有太大区别了        
    > 这些都是基于没有在内部抛出异常的情况下，考虑抛出异常参考 **第三段**

- Promise.reject 就显得很直接，直接生成一个新的敲定状态为rejected的Promise实例, 传入的参数都会成为新的Promise实例的返回值即错误原因

## 六、说一下then、catch和finally方法
我们可以用 promise.then()，promise.catch() 和 promise.finally() 这些方法将进一步的操作与一个变为已敲定状态的 promise 关联起来。这些方法还会返回一个新生成的 promise 对象，这个对象可以被非强制性的用来做链式调用，看下面例子：

### (1) Promise.prototype.then
1. 当一个 Promise 完成（fulfilled）或者失败（rejected）时，返回函数将被异步调用（由当前的线程循环来调度完成）。具体的返回值依据以下规则返回。

    ```javascript
    const myPromise = new Promise(myExecutorFunc)
    myPromise
    .then(handleFulfilledA,handleRejectedA)
    .then(handleFulfilledB,handleRejectedB)
    .then(handleFulfilledC,handleRejectedC);
    ```

2. then函数支持传入两个函数作为参数：

    - 第一个作为当前Promise实例状态变更为fulfilled的异步回调函数 一般称之为 **onFulfilled**，onFulfilled 在被回调时传入一个参数，是该实例异步返回的结果 一般称之为 **value**
    - 第二个作为当前Promise实例状态变更为rejected的异步回调函数 一般称之为 **onRejected**，onRejected 在被回调时传入一个参数，是该实例异步失败的错误原因 一般称之为 **reason**，也有人称 **error**，我个人就喜欢叫errorReason

3. 如果 then 中的回调函数：

    - **返回了一个值**，那么 then 返回的 Promise 将会成为接受状态，并且将返回的值作为接受状态的回调函数的参数值。
    - **没有返回任何值**，那么 then 返回的 Promise 将会成为接受状态，并且该接受状态的回调函数的参数值为 undefined。
    - **抛出一个错误**，那么 then 返回的 Promise 将会成为拒绝状态，并且将抛出的错误作为拒绝状态的回调函数的参数值。
    - **返回一个已经是接受状态的 Promise**，那么 then 返回的 Promise 也会成为接受状态，并且将那个 Promise 的接受状态的回调函数的参数值作为该被返回的Promise的接受状态回调函数的参数值。
    - **返回一个已经是拒绝状态的 Promise**，那么 then 返回的 Promise 也会成为拒绝状态，并且将那个 Promise 的拒绝状态的回调函数的参数值作为该被返回的Promise的拒绝状态回调函数的参数值。
    - **返回一个未定状态（pending）的 Promise**，那么 then 返回 Promise 的状态也是未定的，并且它的终态与那个 Promise 的终态相同；同时，它变为终态时调用的回调函数参数与那个 Promise 变为终态时的回调函数的参数是相同的。        

    其实对于后面三点，可以用一点总结：
    假设then返回的Promise实例叫 thenPromise，then的回调函数的返回结果叫returnPromise，那么 thenPromise 的值将对 returnPromise 产生依赖性：returnPromise 的状态和返回结果都将**实时**的传递给 thenPromise（returnPromise变更之后通知thenPromise变更）

    ```javascript
    const resolvedProm = Promise.resolve(33);

    let thenProm = resolvedProm.then(value => {
        const returnPromise = new Promise((fulfill, reject)=>{
            setTimeout(()=>{
                console.log(thenProm)
                fulfill(33)
                console.log(thenProm)
                setTimeout(()=>{
                    console.log(thenProm === returnPromise)
                })
            },2000)
        });
        return returnPromise
    });
    console.log(thenProm);
    ```


### (2) Promise.prototype.catch

catch函数相当于：
```javascript
.then(undefined, handleRejected) <=> .catch(handleRejected)
```

### (3) Promise.prototype.finally
你可能在发送ajax的时候开启了等待动画，你希望在ajax回调之后取消动画，无论其是否成功还是失败；有两种写法：
```javascript
try {
    loading = true //开始等待动画
    //执行逻辑，等待异步完成
    await ...
}catch(e) {

}finally {
    loading = false //关闭动画
}
```

这种写法是async和await的，并且也有不好的一点就是需要每个请求都要开启和结束，我们把这一步骤封装到axios里面：
```javascript
const httpRequest = function (config) {
    loading = true //开始等待动画
     return new Promise((fulfill, reject)=>{
        axios(config)
        .then(
            value => {
                
            },
            errorReason => {

            }
        )
        .finally(()=>{
            loading = false //关闭动画
            console.log('无论是否成功都会执行')
        })
    })
}
```

finally 上面讲解了其应用场景之一，下面说说它的效果：
- *调用内联函数时，不需要多次声明该函数或为该函数创建一个变量保存它。* => 说的是只需要一个函数
- *由于无法知道promise的最终状态，所以finally的回调函数中不接收任何参数，它仅用于无论最终结果如何都要执行的情况。* => finally不需要知道调用它的promise的状态，因此它的回调函数也不需要参数
- 与Promise.resolve(2).then(() => {}, () => {}) （resolved的结果为undefined）不同，Promise.resolve(2).finally(() => {}) resolved的结果为 2。
- 同样，Promise.reject(3).then(() => {}, () => {}) (resolved 的结果为undefined), Promise.reject(3).finally(() => {}) rejected 的结果为 3。


后面两点都是说：在finally回调中 throw（或返回被拒绝的promise）将以 throw() 指定的原因拒绝新的promise；或者处理函数onFinallyed返回一个状态未敲定的Promise实例将指定finally返回的新的Promise也为敲定状态

```javascript
let promise
promise = new Promise((fulfill, reject) => {
    setTimeout(()=>{
        reject(true)
    }, 1000)
})
promise.finally(()=>{
    return new Promise((fulfill, reject) => {})//返回未敲定的Promise实例
}).then((value)=>{
    console.log(value)
}, (value)=>{
    console.log(value)
})
```