# 08-了解Express框架
Express是一个基于node封装的比较底层的一个框架：
- 快速
- 简洁（优秀的设计模式，清晰的逻辑处理）
- 开放 

但是功能确实非常强大，并且middleware中间件的设计，使得Express非常容易扩展
## Express
主要是对几个东西做了封装：
- 静态资源对外暴露
- 对httpRequest进行封装，对各种数据进行处理
- 对httpResponse进行封装，挂载各种更加简洁的方法，能够使用模板引擎，完成模板渲染
- 启用app函数对象，省去很多代码，简化开发，并且暴露注册路由方法：get、post、put等等
- app.use使用中间件，能够拓展跟多的功能

## 简单的demo
```javascript
const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)

server.listen(3000,function () {
    console.log('服务挂载了')
})
//app.listen(port)
```
这里需要解释以下这个app，app是调用express方法创建的一个函数对象，它既可以作为http.createServer去创建对应的server实例，也可以直接调用app.listen(port)去创建（至于到底怎么创建的，那就是listen方法的内部实现）
```javascript
const app = express()
const server = app.listen(3000, hostname,  function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at http://%s:%s', host, port);
})
```

## 挂载路由
```javascript
app.get('/', function (httpRequest, httpResponse) {
    console.log('get请求')
    httpResponse.send('Hello Express!')
})

app.post('/login', function (httpRequest, httpResponse) {
    console.log('登入')
    httpResponse.send('登入成功')
})
```

## 核心概念middleware
> 它几乎贯穿整个express为什么是这样使用的，你要是搞清楚了，那么你就对express的执行过程非常清晰

中间件其实就是请求响应中的一环，它就像普通的处理请求函数一样，但是它一般不像路由一样会设置路径，这样在每个请求到来时，都先经过一遍中间件的处理。

因此它有以下特点
- 一般不设置对应的路径限制，就是为了对经过的请求做一层封装
- app.use注册对应的中间件，传入的参数包含一个函数，等待请求到来触发回调
- 如果中间件函数内部调用了res.send之类就会提前结束，这也证实了它是处理请求的一环
- 中间件函数还有一个next函数，如果当前中间件没有res.send，不会自动的进入下一个路由环节或者下一个中间件，请求方会处于一直等待状态

### 中间件分类
- 应用级中间件
    - 内置中间件
    - 第三方中间件
    - 错误处理中间件
- 路由级中间件

## 几个常用的中间件

### express.static()
配置静态服务
```javascript
express.static('static')
```

### art-template
配置模板引擎做动态渲染
```javascript
npm install --save art-template
npm install --save express-art-template
//文件内
//通过engine方法注册中间件（内部实现），模板引擎名称，以及模板引擎后缀
app.engine('art', require('express-art-template'));//app.engine('html',....
//设置扫描匹配的模板引擎的文件目录
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎使用哪一个，第二个参数就是app.engine第一个参数的对应值，考虑到一个项目可能切换模板引擎
app.set('view engine', 'art');
```

### 常用的其它
cookie-parse（处理cookie）、body-parse（处理body）、express-session、multer（接收文件）

## 路由模块化
```javascript
//router/index.js里面
const express = require('express')
const router = express.Router()
router.get('/', function(req, res) {
    //...处理
})
module.exports = router


//app.js里
const index =require('./router/index.js')
app.use('/', index)
```

## express-cli
```bush
npm install express-generator -g

//cmd中
express 路径（指定你需要安装到文件夹的路径）
```

## Koa
- 相对express更小，比之express拆分出了更多的中间件
- 更加简洁（利用async、await）解决回调地狱问题
- 中间件变成洋葱模型，是由于async引入才能这也写
