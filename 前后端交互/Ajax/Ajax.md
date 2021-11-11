# Ajax理解和使用

> 资料和文档

- [MDN Ajax ](https://developer.mozilla.org/zh-CN/docs/Web/Guide/AJAX)

还是那句话，推荐MDN，菜鸟教程对于新手或者急着使用的同学比较好，但是这也同样意味着失去了很多重要的细节

## 一、Ajax简介

### (1) 什么是Ajax

AJAX是异步的JavaScript和XML（**A**synchronous **J**avaScript **A**nd **X**ML）。简单点说，就是使用 `XMLHttpRequest` 对象与服务器通信。 它可以使用JSON，XML，HTML和text文本等格式发送和接收数据。

### (2) 为什么要Ajax

1. 传统的数据网页都是通过SSR服务端渲染，来展示大量的数据（例如Php的模板引擎，Java的JSONP），但是有一个问题就是，每次在页面上要做一些增删改查都需要重新刷新页面 或者 跳转访问服务端对外暴露的资源路径再进行重定向，以获取最新的数据，这对于用户来说交互体验是非常差的（以现在的角度来看）

2. Ajax 最吸引人的就是它的**“异步”**特性，也就是说它可以在不重新刷新页面的情况下与服务器通信，交换数据，或更新页面。你可以使用AJAX最主要的两个特性做下列事：
- 在不重新加载页面的情况下发送请求给服务器
- 接受并使用从服务器发来的数据，通过返回的结果和用户进行交互
### (3) 怎么使用Ajax

> Ajax也是事件响应机制，类比DOM的事件响应：获取DOM对象，绑定响应函数，触发事件，回调响应函数获取事件信息

Ajax的核心是 XMLHttpRequest 类，它内部（原型）包含了发送Ajax的能力

1. 创建一个中间对象， XMLHttpRequest 的实例

```javascript
    const httpRequest = new XMLHttpRequest();
```

2. 在真正发送请求之前，需要绑定响应函数 onreadystatechange ，也相当于监听事件 "readystatechange"，能够知道请求是否成功或者失败

```javascript
httpRequest.onreadystatechange = function () {
    ...//请求的响应情况
}
```

3. 接下来要真正的发出Ajax请求阶段，先指定发出请求的配置信息，再发出请求：	

```javascript
httpRequest.open('GET', 'http://www.example.org/some.file', true);
httpRequest.send();
```
参数类的就不细讲了，具体可以参考 **文档最先声明的资料** ，就将一些容易出错的：
- open的第一个参数表示请求方法，一定要注意大写；第二个参数是资源路径要注意同源策略；第三个表示发送的请求是否开启异步，如果同步 false的话，请求一旦发出，下面的代码停止执行，但是主线程仍然在执行JS只是被阻塞了，因此页面也被阻塞了无法进行操作，除非是测试需要，不然极其不建议使用 false （关闭异步）

- send函数是真正触发发送请求的函数，它可接受一个参数作为请求数据传输也叫请求体，需要注意的是，"GET"方式的数据需要在open的URL中拼接，没有请求体

- 举一个发送POST，PUT，DELETE方法请求的例子

```javascript
httpRequest.open('POST', 'http://www.example.org/user', true);
httpRequest.send('username=zix&email=220974511@qq.com&password=123456');
```
注意需要序列化参数

4. 处理响应
在响应函数，它是会多次触发的，因此我们需要判断到底什么时候成功请求，什么时候失败，请求的结果是什么：
请求有多个状态，每个状态表示请求当前的进度：		
		
- 0 (未初始化) or (请求还未初始化)
- 1 (正在加载) or (已建立服务器链接)
- 2 (加载成功) or (请求已接受)
- 3 (交互) or (正在处理请求)
- 4 (完成) or (请求已完成并且响应已准备好)

	它被保存在 httpRequest.readyState 里，上面这些状态只有4才算成功接受并返回。还有一个HTTP响应码保存在 httpRequest.status 里，只有当 其为 200 表示完美的返回数据，没有任何问题。

```javascript
httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
    // Everything is good, the response was received.
    	if (httpRequest.status === 200) {
    		const { responseText ,  responseXML } = httpRequest
            // Perfect!
        } else {
            // There was a problem with the request.
            // For example, the response may have a 404 (Not Found)
            // or 500 (Internal Server Error) response code.
        }
    } else {
        // Not ready yet.
    }
}
```
接下来处理返回结果：
- httpRequest.responseText – 服务器以文本字符的形式返回
- httpRequest.responseXML – 以 XMLDocument 对象方式返回，之后就可以使用JavaScript来处理

5. 如果你希望终止这次请求可以：

```javascript
httpRequest.abort() //会中断这次请求
```


## 二、实践使用

> 上面只是简单的入门级别使用，但是如果你只想了解这么多的话，到这一段就可以了

### (1) setRequestHeader  设置HTTP请求头部的方法

- 此方法必须在  [`open()`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/open) 方法和 [`send()`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/send)  之间调用。如果多次对同一个请求头赋值，只会生成一个合并了多个值的请求头

- 如果没有设置 [`Accept`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept) 属性，则此发送出[`send()`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/send) 的值为此属性的默认值`*/*` 

- HTTP请求头的属性太多，我们只讲

  1. Content-Type => WEB浏览器告诉服务器**自己响应的请求体数据的类型**（这也意味着GET方式不需要），常用有

  - **表单** application/x-www-form-urlencoded 适合POST，PUT，DELETE等包含请求体方法类型

  - **文件** multipart/form-data

  - **JSON** application/json

    其后也可以加上编码格式如`` multipart/form-data;charset:UTF-8``
  
  2. cookie => 默认会自动的把cookie加上（不跨域的前提下），也可手动设置

```javascript
httpRequest.setRequestHeader(header, value); //header属性的名称, value属性的值
```

### (2) 几个 XMLHttpRequest 的实例的重要属性

- **httpRequest.upload** 上传进度
- **httpRequest.timeout** 请求建立链接并返回成功的最大时候，如果超时就舍弃这个请求
- **httpRequest.withCredentials** 是否允许跨域 `Access-Control` 请求带有授权信息，如 cookie 或授权 header 头，这个请求只有在跨域的时候才有效，在同源请求中无效，无论设置什么值
- **httpRequest.responseType** 属性是一个枚举类型的属性，返回响应数据的类型。它允许我们手动的设置返回数据的类型。如果我们将它设置为一个空字符串，它将使用默认的"text"类型
  - **""** `responseType` 为空字符串时，采用默认类型 [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString)，与设置为 `text` 相同
  - **arraybuffer** response 是一个包含二进制数据的 JavaScript ArrayBuffer
  - **blob**  包含二进制数据的的 Blob 对象
  - **document** HTML Document 或者 XML XML Documnet
  - **json** 返回JSON对象，就不需要和什么都没设置一样需要JSON.parse处理
  - **text** DOMString 对象表示的文本
  - **ms-stream** 是下载流的一部分；此响应类型仅允许下载请求，并且仅受 Internet Explorer 支持

### (3) 上传文件案例

```javascript
const inputEle = document.get.... //获取input file 类型元素
inputEle.addEventListener('change', function(event){ //绑定选择文件之后的方法
	const files  = this.files //注意files是从this上拿，也就是 inputEle 上，并不是event
    const formdata = new FormData() //新创建一个FormData实例
    formdata.append('file', files[0]) //添加文件信息，默认上传单个文件
    formdata.append('...', ...) //添加其它信息
    const httpRequest = new XMLHttpRequest()
    httpRequest.onreadystatechange = function () {
        ...//请求的响应情况
    }
	httpRequest.open('POST', 'http://www.example.org/file', true)
	httpRequest.send(formdata) // formdata 直接传入，浏览器自动会处理FormData类型数据，并且设置对应的 Content-Type ，因此不要在手动设置Content-Type；如果你设置了 Content-Type为 multipart/form-data，那么请求就会被降级为普通的表单上传也就是application/x-www-form-urlencoded，后台无法获取到文件资源
})
```

