# 初识socket.io

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

## 基于"事件监听"的socket
比如现在有两个服务器，怎么聊天呢，你说一句，我听一句，就像DOM事件监听一样，
1. 监听动作和说话动作：一个服务监听着服务器是否说了话 **socket.on**，另外一个服务说一句话 **emit** 发送给的后端
2. DOM事件有事件名，为了区分不同的事件，那自然聊天话题可能也是不一样的，自然也要分类
```javascript
// 某一个服务
const eventType = 'chat'
const eventContent = 'Hi, are you ok!'
socket.emit(eventType, eventContent)
//它向另一个服务器说了一句“话”，话的类型是chat，内容是'Hi, are you ok!'


//另外一个服务
const eventType = 'chat'
socket.on(eventType, function(eventContent){
  console.log(eventContent) //如果已经建立连接，监听别的服务发送的消息
})
```

3. 上面只是说了，**如果服务连通**，如何处理，可是怎么连通呢，那我们先看看DOM怎么绑定事件
```javascript
elemnet.addEventListener('eventType', eventFunction)
```
它们是通过指定元素暴露的接口addEventListener连接，那socket服务也是如此
```javascript
//先指定一位服务，做主服务，它暴露和他通信的接口 (类似的"addEventListener")
const express = require('express')()
const server require('http').createServer(express) //创建的服务器
const socketIo = require('socket.io') //引入socket.io文件
const io = socketIo(server)//挂载socket.io到后端服务上，实现socket.io的接口挂载开启



//另一位服务自然是连接上即可 ES6
import io from 'socket.io-client'
const socket = io(url) //根据url连接服务 注意,url就是上一个服务器的部署地址，url有默认值
``` 