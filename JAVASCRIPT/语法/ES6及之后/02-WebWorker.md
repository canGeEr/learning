# 02-WebWorker
Web应用程序可以在独立于主线程的后台线程中，可以在独立线程中执行费时的处理任务，从而允许主线程（通常是UI线程）不会因此被阻塞/放慢


## 对比Iframe
Worker和Iframe很像，Iframe一层套一层，主页面一般叫Top页面，其它Iframe又可以嵌套Ifrmae，在父亲的页面中，通过获取iframe元素的contentWindow（或者document.frames）获取iframe的对应页面的全局执行上下文：
Worker同样是这样
- 对上层保留 worker对象，可以访问Worker的全局执行上下文的方法
- 对下层是代码执行
- worker 和 worker之间、iframe和iframe之间，不是直接通信的，而是先获取子级的引用window或者全局对象（对于worker来说就是实例），父级的脚本的数据，能被 子级引用调用 postMessage 到 子级的脚本域中，因此MessageChannel是封装在全局对象上，自己监听/通知自己发送的消息

不同的是：
- 创建Worker实例有限制：同源的URL（Iframe非同源也能暂时，只是不能访问而已）
- iframe是src属性标签，需要主线程下载、解析、执行
## 初始化
```javascript
//1. 网络脚本：必须同源 
const worker = new Worker('https://~.js')
//2. ObjectURL
const javascriptStr = 
`
  console.log('javascriptStr 在 worker 中执行')
`
const blob = new Blob([javascriptStr], {type: 'text/javascript'})
const worker = new Worker(window.URL.createObjectURL(blob))
```
返回的worker能够：
- 方法
  - postMessage(data, transferList) 说明使用的是MessageChannel的接口（内部封装的）
  - terminate 终止 worker

- 事件
  - onmessage (self.postMessage)
  - onmessageerror
  - onerror

## worker 脚本内
- worker没有window对象，取而代之的是 **self** / **WorkerGlobalScope** 标识符 访问全局变量，因此可以访问self.onmessage监听（worker.postMessage）等


- importScripts => 加载其它脚本，importScripts('http~.js','http~2.js')，下载顺序不固定，但是执行顺序固定


> 可以看出来，在主线程的worker对象上存在MessageChannel的一个端口，在worker脚本内部的 self / WorkerGlobalScope 上存在另外的一个端口，使得主线程能够 和 子线程通信，这其实和iframe和父亲window一个样子


## worker之间如何通信

- worker外层引用 <=====> worker内层脚本，实质实现的是父级线程和子线程的通信

  ```javascript
  function initWorkerByScript(scriptStr) {
    const url =  window.URL.createObjectURL(new Blob([scriptStr], {type: 'text/javascript'}))
    return new Worker(url)
  }

  const worker1 = initWorkerByScript(`
    console.log('worker1')  
    self.addEventListener('message', function(e){
      console.log(e, 'worker1收到消息')
    })  
  `)

  worker1.postMessage('外层worker1引用给worker1内部脚本传递的消息')

  const worker2 = initWorkerByScript(`
    console.log('worker2')
    self.addEventListener('message', function(e){
      console.log(e, 'worker2收到消息')
    })
  `)

  worker2.postMessage('外层worker2引用给worker2内部脚本传递的消息')
  ```

- worker 线程之间如何通信（添加MessageChannel）
  ```javascript
  function initWorkerByScript(scriptStr) {
    const url =  window.URL.createObjectURL(new Blob([scriptStr], {type: 'text/javascript'}))
    return new Worker(url)
  }

  const channel = new MessageChannel()

  const worker1 = initWorkerByScript(`
    console.log('worker1')
    self.addEventListener('message', function(e){
      console.log(e, 'worker1收到消息')
      e.ports[0].onmessage = function(e) {
        console.log('worker1的port1接受到了消息', e)
      }
    })
  `)
  // 移交 port1 给 worker1 脚本
  worker1.postMessage('外层worker1引用给worker1内部脚本传递的消息', [channel.port1])

  const worker2 = initWorkerByScript(`
    console.log('worker2')
    self.addEventListener('message', function(e){
      console.log(e, 'worker2收到消息')
      e.ports[0].postMessage('wroker2通过port2向port1发送的消息')
    })
  `)

  // 移交 port2 给 worker2 脚本
  worker2.postMessage('外层worker2引用给worker2内部脚本传递的消息', [channel.port2])
  ```