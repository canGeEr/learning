# 02-WebWorker
Web应用程序可以在独立于主线程的后台线程中，可以在独立线程中执行费时的处理任务，从而允许主线程（通常是UI线程）不会因此被阻塞/放慢


## 对比Iframe
Worker和Iframe很像，Iframe一层套一层，主页面一般叫Top页面，其它Iframe又可以嵌套Ifrmae，在父亲的页面中，通过获取iframe元素的contentWindow（或者document.frames）获取iframe的对应页面的全局执行上下文：
Worker同样是这样
- 对上层保留 worker对象，可以访问Worker的全局执行上下文的方法
- 对下层是代码执行

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