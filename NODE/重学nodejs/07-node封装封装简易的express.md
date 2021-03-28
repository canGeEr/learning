# 07-node封装封装简易的express

## 静态资源
可以参考06的静态服务搭建

## 封装路由
首先看express如何使用路由
```javascript
app.get(path, callback)
app.post(path, callback)


//express.js封装
let app = {}

(function() {
    let DMS = {
        get: {},
        post: {}
    }

})()

module.exports = app
```