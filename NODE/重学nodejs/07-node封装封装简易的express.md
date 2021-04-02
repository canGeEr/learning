# 07-node封装封装简易的express

## 静态资源
可以参考06的静态服务搭建

## 封装路由
首先看express如何使用路由
```javascript
app.get(path, callback)
app.post(path, callback)

//express.js封装
let DMS = {
    get: {},
    post: {},
    staticPath: ''
}

let app = function (httpRequest, httpResponse) {
    app.initStatic(httpRequest, httpResponse, DMS.staticPath)
    //匹配httpRequest的method再加上路径调用对应的方法
}

app.get = function (url, callback) {
    DMS.get[url] = callback
}

app.post = function (url, callback) {
    DMS.post[url] = callback
}

//挂载静态服务
app.initStatic = function (httpRequest, httpResponse, staticPath) {

}

app.static = function (staticPath) {
    DMS.staticPath = staticPath
}

module.exports = app
```

## 渲染页面
有些文章需要动态的渲染数据然后返回前端，这个时候就需要，模板引擎

通过对模板引擎的封装，最后直接调用res.renderSend等等