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

## node的模块
- 系统模块，比如：http、fs、path等等
- 包模块
    - 规范包（下载的npm的别人发布的包）
    - 自定义包（自己在node_modules里写的包）
- 自定义文件模块

我们都是通过require函数去引入需要的模块，但是它由一些规则
引入模块时，需要传入路径参数，路径可以是**相对路径**和**绝对路径**

- 相对路径 代表着自己写的单独的文件模块
- 只有包名  
    - 会自动在该目录下查找node_modules下的包名为文件夹名，找到包下的package.json文件的入口字段，并解析对应文件，如果没有则默认找index.js
    - 找不到就到该目录的上层目录一样查找