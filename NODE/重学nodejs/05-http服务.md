# 05-http服务
nodejs作为一个本身为了设计成高性能web服务器，那肯定离不开服务器这个核心的功能，
至少有接受请求、处理请求、返回响应，还有发送请求

## 创建http服务
- 创建http服务器
- 绑定接受请求处理的回调函数
- 挂载到监听本机对应的hostname和端口

对应的代码如下
```javascript
//引入需要的模块
const http = require('http')
//创建一个服务
const server = http.createServer()
//绑定的监听请求的处理函数
server.on('request', function (httpRequst, httpResponse) {
    console.log(httpRequst.url)
    httpResponse.end('Hello, node!')
})
//挂载到对应的端口和hostname
server.listen(3000, '127.0.0.1', function () {
    console.log('服务挂载的回调函数')
})
```
**注意**：server.on绑定的事件回调函数，其实可以直接在http.createServer传入，如果看到不要觉得写法陌生

## 处理请求
> 请求或者响应时，请求体和响应体都是流式传输的

当node服务server一旦接受到请求，就会触发一次监听事件的回调，并且把请求报文处理成httpRequest对象，并且创建一个httpResponse对象用于生成对应的响应报文进行响应

### 处理函数
根据上面说的，在处理函数中的主要的两个参数，httpRequest、httpResponse我们通过对两个对象的一些列操作，返回请求方满意的数据
- 第一步读取httpRequest，对可用字段进行过滤
    - url属性 是请求时的请求路径，以'/'开头（因为我们已经设置了挂载的端口号和hostname）
    - method 请求方式
    - httpVersion：http版本、headers：访问请求头、protocol：协议

- 设置响应状态码
    - httpResponse.statusCode = 200
    - httpResponse.writeHead(statusCode, ....)第一次参数

- 设置响应头
    - httpResponse.setHeader(headerName, headerValue)
    - httpResponse.writeHead(statusCode, headerObj = {
        'Content-Type', 'text/plain; charset=utf-8'
    })  [Content-Type详解](https://blog.csdn.net/qq_14869093/article/details/86307084)

- 写入响应体
    - httpResponse.write(data) 单纯写入
    - httpResponse.end(data)，写入，并结束

### 流式响应体传输
node在响应阶段的时候，可以先把响应头发送给请求方，然后剩余的请求体作为流式的数据进行传输 
- response.writeHead会触发上面的规则，发送响应头发送给请求方
- response.write和response.writeHead一样，但是它能比之更多的带上这一次的数据
- response.end结束流的传输，node服务完成请求处理结束这次服务，请求方也不再等待数据

### setHeader和writeHead
- writeHead方法只能在消息上**调用一次**，并且必须在调用 response.end() 之前调用（end之后参考上一段，响应已经结束了）
- response.writeHead 的优先
- writeHead 默认不被本地缓存直接发送，无法被getHeader获取

### 处理post请求
前面提过，请求体和响应体的传输都是流式的，响应体需要慢慢发送，请求体也要慢慢接受。因此，请求时这样的：      
**请求头先到，请求体流式传输**      
代码这样写
```javascript
//处理函数
function dealRequest(httpRequst, httpResponse) {
    let resurce = ''
    if(httpResponse.method === 'post') {//post处理
        httpResponse.on('data', function (data) {
            resurce+=data
        })
        httpResponse.on('end', function () {
            httpResponse.setHeader('Content-Type', 'text/html; charset=utf-8')
            httpResponse.end(resurce)
        })
    }
}
```

## 发送请求
http.get、http.post、http.request       
用法和jq的ajax类似，传入回调函数，成功的时候回调