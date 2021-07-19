# 01-MessageChannel（消息管道）
为什么需要 MessageChannel，不同的worker进程或者跨页面（iframe）之间需要通信（**MessageChannel天然的允许跨域发送消息**），需要借助“电话”进行通信，MessageChannel就是这个“电话”

既然不同worker或者页面能够交流，那么通信方式肯定是“全双工”：两边同时发送和同时接受 => 两条管道

JavaScript并没有抽象管道，而是管道两端的端口（就像终端在管道两端一样），每个端口管理着内容的发送 postMessage 和 内容的接受 onmessage

```javascript
const messageChannel = new MessageChannel()
// 端口1
messageChannel.port1
// 端口2
messageChannel.port2
// port1 <=====> port2
```

## MessagePort
> 它继承于 **EventTarget** 可以绑定监听方法、移除方法

MessageChannel实例对象的port1和port2是 MessagePort 的实例，主要有一下常用属性：
- 方法
  - postMessage(data, transferList) 发送 data 数据到对端端口，对端端口接受到的数据是深拷贝的，不过无法处理不能序列化的函数对象；将 transferList （**可移交权限对象**，不同上下文对象之间能共享的东西，相对于data，data是深拷贝！）发送给对端端口
  - start 开始发送该端口中的消息队列
  - close 关闭端口

- 事件
  - message 接受事件
  - messageerror 接受事件，但是发送解析错误（对端端口发送的data无法序列化）

MessageChannel 确实可以用于深拷贝，但是依然无法处理序列化，不过能解决循环引用和undefined问题

## MessageChannel 页面通信使用示例
localhost:3000/page_one.html
```html
<html>
  <body>
    <p></p>
  </body>
  <script>
    var channel = new MessageChannel();
    var para = document.querySelector('p');

    var ifr = document.querySelector('iframe');
    var otherWindow = ifr.contentWindow;

    // iframe 加载之后发送消息
    ifr.addEventListener("load", function iframeLoaded() {
      otherWindow.postMessage('Hello from the main page!', '*', [channel.port2]);
    }, false);

    // 端口1收到消息更新 p 标签内容
    channel.port1.onmessage = handleMessage(e) {
      para.innerHTML = e.data;
    }
  </script>  
</html>

```
localhost:8000/page_two.html
```html
<html>
  <body>
    <p></p>
  </body>
  <script>
    let messagePort;
    var para = document.querySelector('p');

    window.addEventListener('message', function(e) {
      const data = e.data
      para.innerHTML = data;
      messagePort = e.ports[0] // 不同上下文共享 port
      messagePort.postMessage('Message back from the IFrame');
    })
  </script>  
</html>
```

## MessageChannel worker之间通信

```javascript
var work1 = new Worker("worker1.js");
var work2 = new Worker("worker2.js");
var ch = new MessageChannel();
work1.postMessage("port1", [ch.port1]);
work2.postMessage("port2", [ch.port2]);

// work1 可以通过 port1 postMessage发送消息给 work2 的 port2（通过onmessage接受）
// work2 可以通过 port2 postMessage发送消息给 work1 的 port1（通过onmessage接受）
```