# 命名空间和room

## 命名空间
> 名称空间是一个通信通道，它允许您在一个共享连接上分割应用程序的逻辑

<image src="https://socket.io/images/namespaces.png" />

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
const adminSocket = io.of('/admin');
//其它的也一样的

```