# 生成器 Generator

## 特征
1. function后有一个*
2. 函数内部有yield

## Generator()
返回一个iterator迭代器
可以看成是代码段的迭代器，每次调用iterator.next方法执行一段代码，直到含有yield的那行代码

### yield 有值
调用iterator.next(params) 参数的值将赋值给yield

### return 打断迭代
Generator().return 外部执行return 可以传参，参数的值为最后一次迭代返回的对象的value => {value: params, done: true}


### throw 抛出异常

Generator().throw 方法可以再 Generator 函数体外面抛出异常，再函数体内部捕获。

## yield*
yield* 表达式表示 yield 返回一个遍历器对象，用于在 Generator 函数内部，调用另一个 Generator 函数。
> 这个例子如果不使用yield*只用yield那么就会按照原来的逻辑执行，
```javascript
function* callee() {
    console.log('callee: ' + (yield));
}
function* caller() {
    while (true) {
        yield* callee();
    }
}
const callerObj = caller();
callerObj.next();
// {value: undefined, done: false}
callerObj.next("a");
// callee: a
// {value: undefined, done: false}
callerObj.next("b");
// callee: b
// {value: undefined, done: false}
 
// 等同于
function* caller() {
    while (true) {
        for (var value of callee) {
          yield value;
        }
    }
}
```

> 相当于暂时进入另一个迭代器迭代，或者说当前迭代器将迭代权转交给了內部的另一个迭代器，并且其它的形式完全按照该迭代器处理(传参，返回的对象value等)。当然要注意的是done的值，只有当所有的迭代完成才能done: true


## 实现异步调用
```javascript
var iteratorObj =  (function* () {
    yield wait();
    console.log('b')
})()

function wait() {
    setTimeout(function() {
        console.log('aa')
        iteratorObj.next()
    },1000)
}

iteratorObj.next()
```