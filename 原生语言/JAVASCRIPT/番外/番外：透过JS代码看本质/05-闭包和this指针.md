# 闭包和this指针
> 参考
- [延迟解析：V8是如何实现闭包的？](https://time.geekbang.org/column/article/223168)
## 一、闭包
当在一个函数A内定义一个函数B，真正不是完全的不管这个函数B，因为函数B能够访问函数A的变量和对象，这是一旦定义完函数B就确定的事情

### (1) 拆解闭包——JavaScript 的三个特性

- JavaScript 语言允许在函数内部定义新的函数
- 可以在内部函数中访问父函数中定义的变量
- 因为函数是一等公民，所以函数可以作为返回值（不一定要作为返回值，只要能够向外暴露就行）

### (2) 分析
```javascript
function foo() { 
    var d = 20 
    return function inner() { 
        console.log(d)
    }
}
var f = foo()
```
如果当函数foo执行完毕，那么函数环境就要被丢弃销毁，因此，栈内存的变量d肯定消失无法访问，但是        

内部函数inner被返回，又由于内部函数的作用域是确定的，就能访问到上层函数的变量，即d，这使得矛盾

### (3) V8的延迟解析实现闭包
V8 引入预解析器，比如当解析顶层代码的时候，遇到了一个函数，那么预解析器并不会直接跳过该函数，而是对该函数做一次快速的预解析，其主要目的有两个

- 判断当前函数是不是存在一些语法上的错误

- 检查函数内部是否引用了外部变量，如果引用了外部的变量，预解析器会将栈中的变量复制到堆中，在下次执行到该函数的时候，直接使用堆中的引用，这样就解决了闭包所带来的问题

## 二、this指针

### (1) 确定this值
其实就三点
- 谁调用的函数，this就谁
- 如果函数自己调用，那么this就是window（不考虑严格模式和其它环境，比如Node）
- new 一个函数，this指向要返回对象

### (2) 改变this指向
- call(thisTarget, [...arguments])  直接将第一个参数作为载体，调用对象的函数来实现最终函数的this指向第一个参数

- apply(thisTarget, [arguments]) 和call一样，但是第二个参数是一个数组，这个数组将被apply拆解之后再传入 原函数

- bind(thisTarget, [...arguments]) 效果几乎和call一致，唯一的不同点就是返回的是一个函数，这个函数执行时会调用原函数并指定this为thisTarget


### (3) 手写个bind
```javascript
function bind() {
    var carrier = arguments[0]
    var thatArgs = []
    var callback = this
    var password = 'aaabbbccc' // 假设独一无二，其实最好用symbol
    for(var i=1; i<arguments.length; i++) {
        thatArgs.push(arguments[i])
    }
    Object.defineProperty(carrier, password, {
        configurable: true, //允许被删除
        value: callback,
        writable: false,
        enumerable: false // 防止原函数访问this遍历到它
    })
    return function() {
        var result//保存结果
        var arg = []
        for(var i=1; i<arguments.length; i++) {
            arg.push(arguments[i])
        }
        //传参没有啥好办法
        result = carrier[password](...(thatArgs.concat(arg)))
        delete carrier[password] //删除属性
        return result //注意返回值
    }
}

var obj = {a: '1'}

function doFun(a, b, c) {
    return a+b+c+this.a
}

doFun.bind = bind//Function.prototype.bind = bind 也行
doFun.bind(obj, 1,2,3)() // '61'
```
这里的实现避开了call和apply的调用，不过传参没办法使用了 ... 解构运算符