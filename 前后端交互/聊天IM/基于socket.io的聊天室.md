# 基于socket.io的简易聊天室
> 聊天室这篇博客不讲解聊天系统（带数据库），只是简单的讲一下在线实时聊天室，但是它是一个聊天系统的基础。相信你很快就学会Socket.Io


> 英文官网：    
[Socket.Io](https://socket.io/) （导航栏的getStart或者demo学习）    
中文文档（W3C)：    
[Socket.Io中文文档](https://www.w3cschool.cn/socket/) （更推荐吧，当然也不是特别好）

## 基本工作机制
- **它会自动根据浏览器从WebSocket、AJAX长轮询、Iframe流等等各种方式中选择最佳的方式来实现网络实时应用**

- WebSocket它是一个完整的 应用层协议，包含一套标准的 API 。，基于Tcp，Socket.Io是其上层的封装更加易用。从第一点也说明包含WebSocket

- WebSocket API 是 HTML5 标准的一部分， **但这并不代表 WebSocket 一定要用在 HTML 中，或者只能在基于浏览器的应用程序中使用**。实际上，许多语言、框架和服务器都提供了 WebSocket 支持

- **通讯技术IM一般都是基于P2P模式**（这句话可能不是特别严谨，理解意思就好），所以应该吧客户端js和WebSocket分开理解，js只是间接的调用WebSocket的一个接口层次。**你至少应该把WebSocket理解为一个进程**。

- 当一个主机开启WebSocket进程服务，那么要连接另外的一个主机开启WebSocket进程服务，建立连接自然就可以通信了。通信自然就要有接口去 =》 发送 和 接受 ，由于一直是等待监听所以编写起来和DOM时间监听非常像。发送用emit，接受用on。拿自然也涉及到自定义事件

- 一对一的建立连接只能两个人通信，如何进行多人通信呢。只需要再加一台服务器，帮助传达消息即可。（就好比，你传纸条都传给一个人（暂时叫代理人），由于纸条带有接受者名字，代理人会自动的传达给接受者（并且中间还可以做一些列的事情，比如存储）。


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
var app = require('express')();
var http = require('http').createServer(app);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

http.listen(3000, () => {
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
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

//挂载路线访问 localhost:3000/ 就能获取该文件
app.get('/', (req, res) => {
  //读取根目录下的index.html
  res.sendFile(__dirname + '/index.html');
});

// 启动socket.io服务，开启了通信进程，等待其它主机进程连接
io.on('connection', (socket) => {
  //监听连接，连接成功 执行回调函数
  console.log('a user connected');
});

//挂载nodejs服务在3000端口，回调函数
http.listen(3000, () => {
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
注意，是客户端连接服务端，所以必须先开启服务端，等待连接，然后开启客户端（访问地址localhost:3000）才能建立连接，**必须有个先后顺序 => 服务端的socket.io开启的是探讨等待模式，而客户端只是一次性的请求连接**。注意打印输出，第一阶段就完成了。

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
<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
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

> 相信上面的代码已经让你对socket.io的机制有所了解下面，开始真正的多人聊天室开发案例（部分）

## 多人聊天室
### 功能
- 在线成员列表展示（实时的）
- 多人在线聊天
- 选择在线成员单聊


### 后端实现
```javascript
var userList = []
io.on('connection', function (socket) {
  console.log('a user connected');

  //上线
  socket.on('login', (user) => {
    //user包括姓名，头像等，为了通知其他人也能看到
    user.id = socket.id //自动分配不重复的id
    userList.push(user)
    
    io.emit('userList', userList); //所有用户更新在线用户列表
    socket.broadcast.emit('loginInfo', user.name + '上线了') //除了该客户端，广播其它
    socket.emit('userInfo', user) //返回自己的信息
  });

  //单聊
  socket.on('toOne', {id, name, avatarUrl, toId, msg}) {
    // id 自身id，toId向谁发，msg内容
    var toSocket = io.sockets.sockets.findOne((sockets)=>{
      return sockets.id == toId
    })
    toSocket.emit('toOne', {id, name, avatarUrl, msg})
  }

  //群发
  socket.on('toAll', {id, name, avatarUrl, msg}) {
    toSocket.emit('toAll', {id, name, avatarUrl, msg})
  }



  //下线
  socket.on('outLogin', function ({id}) {
    return userIndex = userList.findIndex((user)=>{
      return user.id = id
    })
    userList.splice(userIndex, 1)
    //后续还是要关闭对于的socket
  });
});
```

前端实现 => js部分 + 思路
- 进入页面先登入，用户名，头像
```js
$(function () {

  var groupMsgList = [];
  var userList = []

  var socket = io();
  //登入事件 => 向服务端说明在线
  $('login').click(()=>{
    socket.emit('login', {name, avatarUrl})
  })

  // 实时更新在线列表
  socket.on('userList', (userList)=>{
    // 接受到服务器的返回的单播
    //更新视图的userList
  })

  //其它用户上线了
  socket.on('loginInfo', ({id})=>{
    // 通知用户上线
  })

  socket.on('userInfo', ({id})=>{
    // 接受到服务器的返回的单播，包含id，用于日后的发送消息
  })

  //群聊发消息
  $('toAll').click(()=>{
    socket.emit('toAll', {id, name, avatarUrl, msg});
    
  })

  //单聊
  $('toOne').click(()=>{
    socket.emit('toOne', {id, name, avatarUrl, msg});
  })

  //页面卸载
  window.onunload(()=>{
    socket.emit('outLogin', {id});
  })
});
```
注意的几个点
- 用户群聊发消息，自己是不需要收到服务器广播，页面更新可以前端直接处理
- 用户点击在线其它成员头像进行单聊，创建一个新的弹窗进行交流，和数据列表数组。

## 总结
前端页面就不带码了，没啥好码的，主要是大家要把这个前后端交互逻辑理清楚了，剩余的就是怎么渲染数据的问题。