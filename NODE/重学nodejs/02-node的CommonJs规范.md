# 02-node的CommonJs规范
每个文件完成特定的功能并且相互独立，实现模块化。当需要该功能时，只需要引入该文件即可

## 基本使用
- 导出模块内容
    - exports[pro] = value
    ```javascript
    exports.name = 'wczix'
    ```
    - module.exports = {}
    ```javascript
    module.exports = {
        name:'wczix'
    }
    ```
- 导入模块 
    ```javascript
    const fs = require('fs')//内置模块、核心模块
    const axios = require('axios')//npm包模块，存在于node_modules里
    const author = require('./author.js')//自定义模块，相对路径引入
    ```

## 分析
- 为什么说每个文件有自己独立的函数作用域，和其它文件模块独立
- 被导出的究竟是什么，是否可修改，exports和module.exports有什么联系
- 怎么证明

关键的是，每一个文件相当于套了一层函数再去执行一样，这样每个文件就和外部隔绝了，有自己的独立作用域

## 证明
写一个main.js
```javascript
//这是我们自己的代码开始
console.log(arguments.callee.toString())
//这是我们自己的代码结束
```
执行结果出人意料，也在意料之中
```javascript
function (exports, require, module, __filename, __dirname) {
//这是我们自己的代码开始
console.log(arguments.callee.toString())
//这是我们自己的代码结束
}
```
做的事情真的就是把我们文件的代码，套上一层函数。除此之外，注意函数的参数    

exports, require, module, __filename, __dirname     

这不就是我们在文件中可以直接使用的**变量**嘛，我们可能以为它是一些关键字，其实它就是函数的形参，这也是我们为什么可以访问或者调用这些变量的原因

接下来分析exports和module.exports有什么联系
```javascript
module.exports === exports // true
/*
exports = {}; module.exports === exports//false

module.exports = {}; module.exports === exports//false
*/
```
说明exports和module.exports指向同一个引用，但是真正模块化的时候，有效的是module.exports上的值

## node的底层模块
- 内建模块：优势就是速度快、性能高（由**纯**C/C++编写）
- 核心模块:JavaSCript编写，比如buffer，crypto等等（一部分C/C++）

对于文件模块 <= 核心模块 <= 内建模块        
因为文件模块依赖于核心模块的一些JS功能

## node应用级别的模块

- 核心模块，比如：http、fs、path等等
- 自定义模块（其实就是包）
    - 规范包（下载的npm的别人发布的包）
    - 自定义包（自己在node_modules里写的包）
- 自定义**文件模块**，一般以路径标识符开头
    - 相对路径 ./或者../开头
    - 绝对路径以/开头

如果引入的不是文件模块，那么查询
- 从包缓存找，是否曾经被引入过
- 在当前目录下找到node_modules目录下的包，找到包下的package.json文件的入口字段，并解析对应文件，如果没有则默认找index.js
- 找不到就通过module.paths一层一层往上找

```javascript
//e:\\nodeDemo下执行代码
console.log(module.paths)
//[ 'e:\\nodeDemo\\node_modules', 'e:\\node_modules' ]
```

## CommonJs规范在前端的发展
由于nodejs基于ECMAScript，那么node就比其它编程语言多一项优势，一些模块可以在前后端共用，但是由于实际情况下，宿主环境不用，实现上需要注意一些事情

- 浏览器主要的性能在于异步请求网络，瓶颈在于带宽
- 服务器在于CPU和内存资源

CommonJS在node上都是**同步加载**的模块，如果把CommonJS照搬到浏览器上，几乎性能有致命的问题

因此，慢慢的提出了一些前端的模块化规范，比如AMD，CMD。它们的特点都包含**异步加载模块**

### AMD
> CommonJS的一个延伸
```javascript
// moduleA.js
define(['moduleB', 'moduleC'], function (moduleB, moduleC) {
    var name = 'weiqinl',
    function foo() {}
    return {
        name,
        foo
    }
})

// index.js
require(['moduleA'], function (moduleA) {
    moduleA.name === 'weiqinl' // true
    moduleA.foo() // 执行A模块中的foo函数
    // do sth...
})
```

### CMD
> 国内的玉伯提出，更接近CommonJS
```javascript
// moduleA.js
// 定义模块
define(function (require, exports, module) {
    var func = function () {
        var a = require('./a') // 到此才会加载a模块
        a.func()
        if (false) {
            var b = require('./b') // 到此才会加载b模块
            b.func()
        }
    }
    // do sth...
    exports.func = func;
})
// index.js
// 加载使用模块
seajs.use('moduleA.js', function (ma) {
    var ma = math.func()
})
```
AMD和CMD最大的区别是：      
对依赖模块的执行时机处理不同，而不是加载的时机或者方式不同，二者皆为异步加载模块。
AMD依赖前置，js可以方便知道依赖模块是谁，立即加载；而CMD就近依赖，需要使用把模块变为字符串解析一遍才知道依赖了那些模块