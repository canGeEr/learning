# namespace & room

##  namespace
> 名称空间是一个通信通道，它允许您在一个共享连接上分割应用程序的逻辑

![namespace图](https://socket.io/images/namespaces.png)

**缘由：**    
虽然只有一个后服务器，但是如果分割建立多个小的服务呢，并且该服务下和其它服务不冲突也不相联，即分割用户的技术，根据socket的命名空间。


**情况case：**    
您希望创建一个只有授权用户才能访问的admin名称空间，因此与这些用户相关的逻辑与应用程序的其余部分是分离的

**如何使用use：**   
```javascript
//后端
const adminNamespace = io.of('/admin');

adminNamespace.use((socket, next) => {
  // ensure the user has sufficient rights
  next();
});

adminNamespace.on('connection', socket => {
  socket.on('delete user', () => {
    // ...
  });
});

//前端呢
const adminSocket = io('/admin'); //注意url本来默认时挂载该服务的地址localhost:port，有命名空间 + namespace
//其它的也一样的
```

**默认的命名空间default：**   

```javascript
//默认就是直接使用io对象

//向所有的用户发送消息
io.sockets.emit('hi', 'everyone');
io.emit('hi', 'everyone'); // short form 简洁模式，上面可替换
```

## room

> 在每个名称空间中，您可以定义称为“Rooms”的任意通道，任何一个socket可以加入或离开这些通道（房子）。
>
> 它可以用于广播数据到socket组合成的子集


![room图](https://socket.io/images/rooms.png) 

**缘由：** 		

命名空间虽然划分了子服务区域，确认了**连接路径**，但是各各子服务的人是无法连接交流的，room不仅能再次划分层级服务，还能在room级别的socket能够交流，控制。举个栗子：把整个服务看成一个大的区域，namespace根据某种特性划分一级子区域（比如财富差距），在一级区域的不能相互踏入（特性不同），room就像是房子一样，把一级区域內部细分群体，为二级区域，但是各各群体自己因为特性相同，所有能够相互交流（也即相互串门，room）

### join or leave

既然相当于一个群组，自然可以加入或者退出

```javascript
io.on('connection', socket => {
  if(socket.id === ...) //判断条件，条件自定义
  	socket.join('some room'); //根据条件加入，注意，可以调用多次join，意味着一个socket可以加入多个房间
});
//当断开连接时，会自动退出，当然也可以调用 socket.leave('some room')
```

### how to chat in this model

```javascript
//向某个房间所有人
io.to('some room').emit('some event'); 
//发送给同在 'game' 房间的所有客户端，包括发送者
io.in('game').emit('some event');
//向几个房间同时
io.to('some room').to('another room').to('another room').emit('some event');
// 发送给同在 'some room' 房间的所有客户端，除了发送者
socket.to('some room').emit('some event");
// 发送给同在 'room1' 或 'room2' 房间的所有客户端，除了发送者
socket.to('room1').to('room2').emit('some event');

```

和命名空间namespace一样，每个socket有个默认的room，但是不同点在于，每个socket的默认room时socket.id

default room

```javascript
io.on('connection', socket => {
  socket.on('say to someone', (id, msg) => {
    socket.to(id).emit('my message', msg);
  });
  socket.on('disconnecting', () => {
    const rooms = Object.keys(socket.rooms);
    // the rooms array contains at least the socket ID
  });
  socket.on('disconnect', () => {
    // socket.rooms === {}
  });
});

```

