> 聊天室这篇博客不讲解聊天系统（带数据库），只是简单的讲一下在线实时聊天室，但是它是一个聊天系统的基础。相信你很快就学会Socket.Io

> 如果你希望更快的了解，直接git下面的代码链接，配合看
[chat-room](https://gitee.com/cangeer/chat-room-demo)

## 流程
1. 后端搭建服务器，安装socket.io服务依赖，通过代码挂载服务。
2. 前端链接服务
3. 前端实现监听和发送
4. 服务端实现监听和发送

## 开始安装

> 后端基于nodejs讲解，而且为了方便直接用express框架，只是为了更快，用原生的也可。
接下来，在编写代码时，我会加上注释解释作用，希望你先看完 **基本工作机制**

1. 新建一个文件chat-room，进入cmd命令行，
```bush
npm init -y
npm install express -S //局部安装express框架
//
```

2. 在根目录下（chat-room）新建一个index.js作为入口文件
```javascript
var express = require('express')();
var server = require('http').createServer(express);

express.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
```
cmd运行
```bush
node index.js
```
至此，搭建了一个nodejs服务。挂载在3000端口访问，说明搭建服务成功

3. 开始正式搭建环境
```
npm install socket.io -S // 安装socket.io模块
```

在根目录下新建一个**index.html**文件
```html
<!doctype html>
<html>
  <head>
    <title>Socket.IO chat</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font: 13px Helvetica, Arial; }
      form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
      form input { border: 0; padding: 10px; width: 90%; margin-right: 0.5%; }
      form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages li { padding: 5px 10px; }
      #messages li:nth-child(odd) { background: #eee; }
    </style>
  </head>
  <body>
    <ul id="messages"></ul>
    <form action="">
      <input id="m" autocomplete="off" /><button>Send</button>
    </form>
  </body>
</html>
```

**index.js** 文件修改为
```javascript
var express = require('express')();
var server = require('http').createServer(express);
var io = require('socket.io')(server);

//挂载路线访问 localhost:3000/ 就能获取该文件
server.get('/', (req, res) => {
  //读取根目录下的index.html
  res.sendFile(__dirname + '/index.html');
});

// 启动socket.io服务，开启了通信进程，等待其它主机进程连接
io.on('connection', (socket) => {
  //监听连接，连接成功 执行回调函数
  console.log('a user connected');
});

//挂载nodejs服务在3000端口，回调函数
server.listen(3000, () => {
  console.log('listening on *:3000');
});
```

至此，后端开启服务，客户端（如果访问localhost:3000，那么它的浏览器就是客户端了），还没有连接，接下来添加 **index.html** 的socket.io逻辑代码
```html
<!-- 注意这个socket.io.js的引入，它是框架內部实现的暴露在服务的根路径之下的js，你
能比较疑惑它是哪里来的 -->
<script src="/socket.io/socket.io.js"></script>
<script>
  //这一段简单的代码其实已经开启服务了，注意io没有任何参数时，没人连接的是提供该文件服务的服务（即挂载该文件的nodejs服务）
  var socket = io();
  //你也可以这样使用 
  /*
    var socket = io('http://localhost:3000');不填端口默认是80
  */
</script>
```
至此，nodejs的socket.io就已经联通了？错，开启nodejs服务
```bush
node index.js
```
注意，是客户端连接服务端，所以必须先开启服务端，等待连接，然后开启客户端（访问地址localhost:3000）才能建立连接，**必须有个先后顺序 => 服务端的socket.io开启的是探讨等待模式，而客户端只是一次性的请求连接（后来发现，socket.io自动实现心跳机制。。。。，客户端一直尝试连接）**。注意打印输出，第一阶段就完成了。

4. 为了深入了解需要做更多的事，让你体验到，他们到底是如何交互的   
**在index.js对于io部分的代码进行修改，添加**
```javascript
io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('a user disconnect');
  });
});
```
```bush
node index.js
```
访问localhost:3000，客户端一起懂，执行js的io()，服务端控制台打印“a user connected“，关闭localhost:3000页面，服务端控制台打印“a user disconnect“。
得到结论，页面卸载与之关联的socket.io自动关闭连接。（注意，其实是自动的向服务端发送了一个事件信息，事件名称就叫做disconnect，只不过对开发人员是透明的）。

5. 现在进入第二阶段，发送和接受消息，如果你仔细的看了上面的代码，并且你学过前端，你肯定已经懂了个大概。接下里就了解一下消息传递机制。   
- 先完善index.html页面
```html
<!-- 依然是JS部分 -->
<script src="/socket.io/socket.io.js"></script>
<!-- 请注意这里的jq链接，官网的可能加载失败，这个成功 -->
<script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
<script>
  $(function () {
    var socket = io();
    $('form').submit(function(e) {
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
  });
  /*
  1. 匿名函数执行，避免污染全局
  2.启动socket.io服务，并连接服务器
  3. 绑定button点击事件
  4. 事件回调触发 socket.emit
</script>
```
socket.emit 时客户端向服务器（所连接的）发送消息的API，第一个参数是事件名，
第二个是值（字符串），那么客户端在点击发送消息时，向后端发送了一个名为chat message的事件，值为框的值
-  后端如何接收呢？ index.js
```javascript
io.on('connection', function (socket) {
  console.log('a user connected');
  // + 
  socket.on('chat message', (msg) => {
    console.log('clint send message: ' + msg);
  });
  // +

  socket.on('disconnect', function () {
    console.log('a user disconnect');
  });
});
```

- 哪后端怎么回消息呢
```javascript
io.on('connection', function (socket) {
  console.log('a user connected');

  socket.on('chat message', (msg) => {
    console.log('clint send message: ' + msg);
    // + 
    var value = 'server 已经接受到了消息，这是个单播'
    socket.emit('chat message', value)
    // +
    //注意，你可能发现这和文档写的不一样啊，那我先告诉你这是一个单发的消息
    //服务器连接着多个客户端，怎么确定是向那个服务器发送消息呢，一种就是上面的：在客户端发送消息的接口处，socket.emit 发送的就是单播
  });

  socket.on('disconnect', function () {
    console.log('a user disconnect');
  });
});
```
前端接收 **index.html**
```js
$(function () {
  var socket = io();
  //+
  socket.on('chat message', (msg)=>{
    console.log('server reply message: ' + msg)
  })
  //+
  $('form').submit(function(e) {
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
});
```

- 那怎么向**非发送消息的客户端**，发送通知，说该客户端发送了消息，并显示呢。
你可以开起两个页面进程，就形成两个客户端socket.io
主要是后端逻辑，修改index.js
```js
  socket.on('chat message', (msg) => {
    console.log('clint send message: ' + msg);
    // + 
    var value = 'server 已经接受到了消息，这是send a message to everyone except for a certain emitting socket'
    socket.broadcast.emit('chat message', value)
    // +
    //注意是socket.broadcast
  });
```

- 后端向所有的在线客户，发送广播

```javascript
  socket.on('chat message', (msg) => {
    console.log('clint send message: ' + msg);
    // + 
    var value = 'server 已经接受到了消息，这是一个广播'
    io.emit('chat message', value)
    // +
    //注意是socket.broadcast
  });
```

## 心跳机制
缘由：  
想一下，虽然在客户端关闭页面的时候会自动的通知服务器emit，但是有些时候是不可预知的原因，比如断网，电脑直接死机等，
但是无法自动通知后端，后端服务器如果仍然以为客户端socket存在的话，那么将浪费一个资源

解决：    
如果客户端成功连接后， 一直向服务器端在指定的时间内发送消息，服务端如果在指定间隔回答消息，那么说明网络一定仍然连通。但是如果关闭网络，客户端仍然向服务端发送消息，但是服务端接受不到，如果在指定的时间内仍然无法接受带，服务端自动关闭和该客户端连接的socket

具体：    
假设客户端轮询的时间（定时向后端请求）为 **pingInterval**，假设上一个请求应答（ping & pong）成功，再过 pingInterval 时间，客户端再次发送消息，可是由于网络原因，服务端无法接收到ping通知，服务器将最多等待 **pingTimeout** 时间，如果客户端在该时间内仍未再次发送ping，服务端任务通信结束，自动关闭等待连接的socket。

## options 的 path 解释
```javascript
<script src="/socket.io/socket.io.js"></script>
```
你可能会疑惑于：    
socket.io是如何找到这个文件的，如果你了解node服务，你自然应该想到，所有的资源需要被暴露出来才能被连接，即当在localhost:3000访问时，你虽然访问到了html页面，但是所有的html的链接的资源都是相对localhost:3000来寻找的，如果没有暴露出来，自然找不到。当然也可以用网络连接，不过并不影响前面的理论。   

解释：    
 当挂载服务时，socket.io自动运行，将客户端需要的socket.io文件暴露出去，并暴露链接服务端的接口路径（如果你看过socket在前端的network的请求，你会发现一个通信都是作用在一个请求上，请求的路径默认时localhost:port/socket.io?），socket也相当于一个资源接口，所以，前端发送请求也是需要路径的。

**重点**：path就是配置这个资源路径的参数，配置的时候，前后端要一起配置
```js
// 后端
var io = require('socket.io')(server, {path: '/my'});

//前端
//由于后端暴露的静态资源时'/my'，所有前端拿到socket.io的路径变化 /my/socket.io.js
//但是此时请求仍然会有问题，你一看请求路径仍然时local..../socket.io。怎么半？
const socket = io('/', {
  path: '/my' //设置请求的路径
})

```



## API 小结（使用到的）

### 服务端

```bush
const IoServer = require('socket.io');
const io = new IoServer();
```
1.  IoServer 可传参：     
- httpServer （http.Server）要绑定的服务器。
- options （选项）
    - path （String）：捕获路径的名称（/socket.io,你在前端获取的socket.io的文件和发送请求的路径 ）
    - pingInterval: 默认10000ms， 
    - pingTimeout: 默认5000ms

2. socket.emit | socket.on

3. socket.id 作为一个通信的随机str值，唯一，一遍服务端区分不同的连接
```js
//后端获取 socket.id
//前端获取
socket.on('connect', ()=>{
  console.log(socket.id) //注意，连接成功之后才会返回，并且前后端的id一致
})
```

4. io.emit | socket.boradcast.emit | socket.emit