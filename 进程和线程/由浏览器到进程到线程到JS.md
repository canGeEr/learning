# 由浏览器到进程到线程到JS
<font color="#6c6c6c" size="2" style="font-style: italic" >
本人学习喜欢刨根问底,但是越来越发现底层东西涉及范围广，而且网上的答复都不为统一，不过看到一些外网的文章还不错，不要想我一样英语没学好，学个编程都难搞,太难了。
</font><br/><br/>

该文(参考，借鉴了大量的博客文章),希望能够从中找到自己的一些东西,该文并为完,待续...    
以下为文章连接

> https://www.cnblogs.com/dailc/p/8325991.html **力顶支持**(比较全面当然多,难理解)  
> https://www.zhihu.com/question/42962803  
> https://juejin.im/post/5a7bf0acf265da4e9449a4b1  
> https://juejin.im/post/5e143104e51d45414a4715f7  
> https://juejin.im/entry/58abed228d6d810058bee22f  
> https://www.zhihu.com/question/31982417  
> https://www.zhihu.com/question/35905242  


## JAVASCRIPT是语言
JavaScript（简称“JS”） 是一种具有函数优先的轻量级，解释型或即时编译型的编程语言。虽然它是作为开发Web页面的脚本语言而出名的，但是它也被用到了很多非浏览器环境中，JavaScript 基于原型编程、多范式的动态脚本语言，并且支持面向对象、命令式和声明式（如函数式编程）风格。


## 什么是JS环境
ECMAScript(基于javascript的规范)  
运行环境有两种 : node 和  浏览器(例如V8引擎)

### 什么是node
Node.js 是一个让 JavaScript 运行在服务端的开发平台，它让 JavaScript 成为与PHP、Python、Perl、Ruby等服务端语言平起平坐的脚本语言。实质是对Chrome V8引擎进行了封装。  

Node.js是一个基于Chrome JavaScript运行时建立的平台， 用于方便地搭建响应速度快、易于扩展的网络应用。Node.js 使用事件驱动， 非阻塞I/O模型而得以轻量和高效，非常适合在分布式设备上运行数据密集型的实时应用。

## 什么是JS引擎
JavaScript引擎是一个专门处理JavaScript脚本的虚拟机

## javascript语言本身没有线程的机制和概念
javascript语言本身没有线程的机制和概念，但是Javascript的运行(程序的执行)是单线程的或者说像单线程一样工作的，那么当前代码执行的时候，是会阻塞其他代码执行的。浏览器本身是多线程执行的，包括javascript引擎线程，界面渲染线程，浏览器事件触发线程，Http请求线程等。浏览器是事件驱动的，当一个异步事件执行的时候，浏览器将这些事件放入一个事件队列里，浏览器会轮询这个事件队列，Event Loop，然后执行这个事件队列。举个栗子：当你频繁处理click事件的时候，此时又有一个mouseover，那么此事件就被放入队列里等待处理；ajax请求是浏览器新开线程执行的，但是回调函数是放入Event Loop里等待执行的，setTimeout也一样，回调事件也是放入Event Loop等待执行，主事件执行完了，才执行Event Loop里的事件。