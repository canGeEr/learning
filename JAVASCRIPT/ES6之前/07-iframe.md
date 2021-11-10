# iframe

> iframe 是一个令人头疼的标签，但是利用的好，这将是一个非常有用的功能。

每个嵌入的浏览上下文（embedded browsing context）都有自己的会话历史记录(session history)和 DOM 树。包含嵌入内容的浏览上下文称为父级浏览上下文。顶级浏览上下文（没有父级）通常是由 Window 对象表示的浏览器窗口。

## 常用属性

- width、height 宽高（注意可以使用 object-fit、object-position）
- src 指定嵌入的文档的地址
- name 用于定位嵌入的浏览上下文的名称

## 示例

```html
<iframe src="https://www.baidu.com" width="400" height="300">
  <!-- 如果不支持iframe则会显示iframe的内容 -->
  <p>Your browser does not support iframes.</p>
</iframe>
```

## iframe 通信

> 获取 iframe 的 DOM 只是 Iframe DOM 而已，那么如何访问 iframe 内部的的 window 呢? **iframe.contentWindow**

我们可以在当前页面通过 window.frames 包含所有子 iframe 的 window （**contentWindow**）对象的数组引用，两种访问具体 iframe 的方式

- window.frames[index]
- window.frames[iframeName] 通过框架名称获取

有没有直接的表示关系的获取方式？

> 除非最高层窗口是通过 window.open()打开的，否则其 window 对象
> 的 name 属性不会包含任何值

- top 最顶层的 iframe，无论嵌套多少层，一直向上找到最顶层的 iframe 对象
- parent 父亲 iframe 对象
- self 确定当前位置

### 通信示例

**index.js**文件下

```html
<iframe src="./iframe.html" width="400" height="300" name="test">
  <p>Your browser does not support iframes.</p>
</iframe>
```

**同 index.js 目录下的 iframe.html**

```html
<div class="container">
  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus quas,
  eligendi praesentium a aliquid unde soluta temporibus. Eveniet dolor, iure
  architecto quisquam, accusamus rerum saepe aliquam officia, corporis qui
  beatae?
</div>
<script>
  console.log(window.top, window.self === window, window.name);
  //上一层window对象、true、test
</script>
```

### 报错

iframe.html:14 Uncaught DOMException: Blocked a frame with origin "null" from accessing a cross-origin frame.  
因为用文件系统打开，跨域了，这个时候就需要启动服务，用 http 请求的方式挂载页面，并且不要跨域

## iframe 解决跨域问题

> 这里说的问题，是不能沟通，不能相互访问，或者说：
> iframe 如何跨域通信，并不是广义上的发起跨域请求

三种办法，本质上都是通过设置全局变量的数据传递数据

- hashchange 监听 location.hash 传递数据
- window.name 保持交流
- iframe + postMessage

## **location.hash 传递数据**

> location.hash 改变页面不会重载（iframe 也是）

先说下大致的流程，在域 A（shepiji.top）有页面 index.html，在该页面存在一个 iframe，iframe 的地址 src 指向一个域 B（wczix.top）的 index.html

```html
<!-- shepiji.top/index.html -->
<iframe src="wczix.top/index.html"> </iframe>
```

那么 A 的 index.html 先向 B 的 index.html（iframe）传递信息，通过修改 iframe 的哈希值比如：

```html
<!-- shepiji.top/index.html -->
<iframe src="wczix.top/index.html"> </iframe>
<script>
  const iframe = document.frames[0]
  iframe.src = 'wczix.top/index.html#message=newDate"
</script>
```

这个时候，ifrmae 指定的页面的 hash 发生变化且不重载，该页面根据新的 hash 值做一些数据获取，再想办法传递回给 shepiji.top/index.html

```html
<!-- wczix.top/index.html -->
<script>
  window.addEventListener("hashchange", function (url) {
    //根据新的hash值做一些数据获取
    //再想办法传递回给wczix.top/index.html
  });
</script>
```

**关键点：wczix.top/index.html 传递数据回给 shepiji.top/index.html**
可以在 wczix.top/index.html 创建一个 iframe，src 指向 shepiji.top 的任意页面，假设为 shepiji.top/temp.html（叫做代理 iframe）。将数据作为 src 地址的哈希值

```html
<!-- wczix.top/index.html -->
<script>
  window.addEventListener("hashchange", function (url) {
    //根据新的hash值做一些数据获取
    //再想办法传递回给wczix.top/index.html
    //假设获取到数据data
    let data = "数据";
    var iframerProxy = document.createElement("iframe");
    iframerProxy.style.display = "none";
    iframerProxy.src = "shepiji.top/temp.html" + "#data=" + data;
    document.body.appendChild(iframerProxy);
  });
</script>
```

将数据给 shepiji.top/temp.html 是因为它和 shepiji.top/index.html 同源，可以相互传递数据或者直接访问：

```html
<!-- shepiji.top/temp.html -->
<!-- parent.parent 就是访问到了shepiji.top/index.html，同源 -->
parent.parent.location.hash = self.location.hash.substring(1);
```

**当然**，shepiji.top/index.html 要接受响应的话也要监听 hash 值的变化，记得添加上

## **window.name 传递数据**

> iframe 的 src 发生非 hash 的变化或重置，但是由于 iframe 标签的 name 属性存在，因此即使页面刷新，name 属性都不会变化，而且 window.name 可以访问

大致步骤：

- 顶级页面插入 iframe，设置 src 为跨域路径
- 跨域路径 iframe 对应的 html 根据当前页面的 url 自动发送目标请求，获取数据保存在 window.name 的属性中
- 当跨域 html 获取数据完成时，在顶级页面控制 iframe 的 src 转换为同源路径
- 顶级页面获取同源 iframe 的 window.name，并触发回调函数

```javascript
function getData(url, fn) {
  var oIframe = document.createElement("iframe"),
    firstBtn = true,
    loadFn = function () {
      if (firstBtn) {
        //导航回同一域下的air.html，以便获取到name值
        oIframe.contentWindow.location = "http://www.a.com/air.html";
        firstBtn = false;
      } else {
        fn(oIframe.contentWindow.name);
        oIframe.contentWindow.document.write("");
        oIframe.contentWindow.close();
        document.body.removeChild(oIframe);
        oIframe.src = "";
        oIframe = null;
      }
    };

  oIframe.src = url;

  //1.第一次iframe加载完毕触发事件，执行loadFn函数，会将iframe导航回air.html
  //2.air.html加载完毕后又会触发事件，再次执行loadFn函数，此时会走else
  if (oIframe.attachEvent) {
    oIframe.attachEvent("onload", loadFn);
  } else {
    oIframe.onload = loadFn;
  }

  document.body.appendChild(oIframe);
}
```

## iframe + postMessage

> window.postMessage 方法提供了一种受控机制来规避此限制，只要正确的使用，这种方法就很安全

> 一个窗口可以获得对另一个窗口的引用（比如 targetWindow = window.opener），然后在窗口上调用 **targetWindow**.postMessage() 方法分发一个 MessageEvent 消息（一定要注意是在获取的窗口对象上调用）

语法：

```javascript
otherWindow.postMessage(message, targetOrigin, [transfer]);
```

- otherWindow 其他窗口的一个引用，比如 iframe 的 contentWindow 属性、执行 window.open 返回的窗口对象、或者是命名过或数值索引的 window.frames

- message 将要发送到其他 window 的数据。它将会被结构化克隆算法序列化。这意味着你可以不受什么限制的将数据对象安全的传送给目标窗口而无需自己序列化（**可以使用这个进行深拷贝**）

- targetOrigin
  通过窗口的 origin 属性来指定哪些窗口能接收到消息事件，其值可以是字符串"\*"（表示无限制）或者一个 URI。在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配 targetOrigin 提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。这个机制用来控制消息可以发送到哪些窗口；例如，当用 postMessage 传送密码时，这个参数就显得尤为重要，必须保证它的值与这条包含密码的信息的预期接受者的 origin 属性完全一致，来防止密码被恶意的第三方截获。如果你明确的知道消息应该发送到哪个窗口，那么请始终提供一个有确切值的 targetOrigin，而不是\*。不提供确切的目标将导致数据泄露到任何对数据感兴趣的恶意站点

- transfer **可选**
  是一串和 message 同时传递的 Transferable 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。

但是一旦发出这个**事件**，接收方怎么接受呢？

```javascript
//绑定message监听各个源origin传递（postMessage）来的消息
window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  // For Chrome, the origin property is in the event.originalEvent
  // object.
  // 这里不准确，chrome没有这个属性
  // var origin = event.origin || event.originalEvent.origin;
  var origin = event.origin;
  if (origin !== "http://example.org:8080") return;

  // ...
}
```

注意：绑定的回调函数中的 event 和普通事件对象不同：

- data
  从其他 window 中传递过来的对象。
- origin
  调用 postMessage 时消息发送方窗口的 origin . 这个字符串由 协议、“://“、域名、“ : 端口号”拼接而成。例如 “https://example.org (隐含端口 443)”、“http://example.net (隐含端口 80)”、“http://example.com:8080”。请注意，这个origin不能保证是该窗口的当前或未来origin，因为postMessage被调用后可能被导航到不同的位置。
- source
  对发送消息的窗口对象的引用; 您可以使用此来在具有不同 origin 的两个窗口之间建立双向通信

每一个属性都极为有用：source 可以回调原来的窗口的函数来实现请求数据回调效果

```javascript
/*
 * A窗口的域名是<http://example.com:8080>，以下是A窗口的script标签下的代码：
 */

var popup = window.open(...popup details...);

// 如果弹出框没有被阻止且加载完成

// 这行语句没有发送信息出去，即使假设当前页面没有改变location（因为targetOrigin设置不对）
popup.postMessage("The user is 'bob' and the password is 'secret'",
                  "https://secure.example.net");

// 假设当前页面没有改变location，这条语句会成功添加message到发送队列中去（targetOrigin设置对了）
popup.postMessage("hello there!", "http://example.org");

function receiveMessage(event)
{
  // 我们能相信信息的发送者吗?  (也许这个发送者和我们最初打开的不是同一个页面).
  if (event.origin !== "http://example.org")
    return;

  // event.source 是我们通过window.open打开的弹出页面 popup
  // event.data 是 popup发送给当前页面的消息 "hi there yourself!  the secret response is: rheeeeet!"
}
window.addEventListener("message", receiveMessage, false);
```

```javascript
/*
 * 弹出页 popup 域名是<http://example.org>，以下是script标签中的代码:
 */

//当A页面postMessage被调用后，这个function被addEventListener调用
function receiveMessage(event) {
  // 我们能信任信息来源吗？
  if (event.origin !== "http://example.com:8080") return;

  // event.source 就当前弹出页的来源页面
  // event.data 是 "hello there!"

  // 假设你已经验证了所受到信息的origin (任何时候你都应该这样做), 一个很方便的方式就是把event.source
  // 作为回信的对象，并且把event.origin作为targetOrigin
  event.source.postMessage(
    "hi there yourself!  the secret response " + "is: rheeeeet!",
    event.origin
  );
}

window.addEventListener("message", receiveMessage, false);
```


## 关于iframe使用postMessage踩坑
- 永远不要在本window上调用postMessage，那只会触发本window的onmessage，并且还会报错（MDN上有注明：otherWindow.postMessage）
- iframe.contentWindow.postMessage 等先等待 iframe 加载完成，即
  ```javascript
  iframe.onload = function() { // 先等其加载完成
    iframe.contentWindow.postMessage....
  }
  ```



一个合理的demo：    
http://localhost:8000/page.html

> （如果你是webpack开的项目，避免使用index.html，因为被webpack监听了（Dev Server）)

```html
<iframe src="http://localhost:8001/page.html"></iframe>
<script>
  iframe = document.getElementsByTagName('iframe')[0]
  iframe.onload = function() {
    iframe.contentWindow.postMessage(..., 'localhost:8001')
  }
  window.addEventListener('message', function(e) {
    console.log('8000接受到的消息', e.data)
  })
</script>
```

http://localhost:8001/page.html

```html
<script>
  window.addEventListener('message', function(e) {
    console.log('8001接受到的消息', e.data)
    e.source.postMessage(..., 'localhost:8001')
  })
</script>
```