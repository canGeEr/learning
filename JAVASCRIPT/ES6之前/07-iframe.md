# iframe
> iframe是一个令人头疼的标签，但是利用的好，这将是一个非常有用的功能。

每个嵌入的浏览上下文（embedded browsing context）都有自己的会话历史记录(session history)和DOM树。包含嵌入内容的浏览上下文称为父级浏览上下文。顶级浏览上下文（没有父级）通常是由 Window 对象表示的浏览器窗口。
## 常用属性
- width、height宽高（注意可以使用object-fit、object-position）
- src 指定嵌入的文档的地址
- name 用于定位嵌入的浏览上下文的名称

## 示例
```html
<iframe src="https://www.baidu.com" width="400" height="300">
<!-- 如果不支持iframe则会显示iframe的内容 -->
    <p>Your browser does not support iframes.</p>
</iframe>
```

## iframe通信
我们可以在当前页面通过window.iframes包含所有子iframe的window对象的数组引用，两种访问具体iframe的方式
- window.iframes[index]
- window.iframes[iframeName] 通过框架名称获取

有没有直接的表示关系的获取方式？
> 除非最高层窗口是通过 window.open()打开的，否则其 window 对象
的 name 属性不会包含任何值
- top 最顶层的iframe，无论嵌套多少层，一直向上找到最顶层的iframe对象
- parent 父亲iframe对象
- self 确定当前位置

### 通信示例
**index.js**文件下
```html
<iframe src="./iframe.html" width="400" height="300" name="test">
    <p>Your browser does not support iframes.</p>
</iframe>
```
**同index.js目录下的iframe.html**
```html
<div class="container">
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus quas, eligendi praesentium a aliquid unde soluta temporibus. Eveniet dolor, iure architecto quisquam, accusamus rerum saepe aliquam officia, corporis qui beatae?
</div>
<script>
    console.log(window.top, window.self === window, window.name)
    //上一层window对象、true、test
</script>
```
### 报错
iframe.html:14 Uncaught DOMException: Blocked a frame with origin "null" from accessing a cross-origin frame.       
因为用文件系统打开，跨域了，这个时候就需要启动服务，用http请求的方式挂载页面，并且不要跨域

## iframe解决跨域问题
