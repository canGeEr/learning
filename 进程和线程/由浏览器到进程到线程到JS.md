# 由浏览器到进程到线程到JS
<font color="#6c6c6c" size="2" style="font-style: italic" >
本人学习喜欢刨根问底,但是越来越发现底层东西涉及范围广，而且网上的答复都不为统一，不过看到一些外网的文章还不错，不要想我一样英语没学好，学个编程都难搞,太难了。
</font><br/><br/>

该文(参考，借鉴了大量的博客文章),希望能够从中找到自己的一些东西,该文并为完,待续...    
以下为文章连接

> https://www.cnblogs.com/dailc/p/8325991.html **力顶支持**(比较全面当然多,难理解)
> https://www.jianshu.com/p/adef1523aa76    
> https://www.zhihu.com/question/42962803
> https://juejin.im/post/5a7bf0acf265da4e9449a4b1
> https://juejin.im/post/5e143104e51d45414a4715f7
> https://juejin.im/entry/58abed228d6d810058bee22f
> https://www.zhihu.com/question/31982417
> https://www.zhihu.com/question/35905242


## JAVASCRIPT是语言



## 什么是JS环境

## 什么是JS引擎




## javascript语言本身没有线程的机制和概念
javascript语言本身没有线程的机制和概念，但是Javascript的运行(程序的执行)是单线程的或者说像单线程一样工作的，那么当前代码执行的时候，是会阻塞其他代码执行的。浏览器本身是多线程执行的，包括javascript引擎线程，界面渲染线程，浏览器事件触发线程，Http请求线程等。浏览器是事件驱动的，当一个异步事件执行的时候，浏览器将这些事件放入一个事件队列里，浏览器会轮询这个事件队列，Event Loop，然后执行这个事件队列。举个栗子：当你频繁处理click事件的时候，此时又有一个mouseover，那么此事件就被放入队列里等待处理；ajax请求是浏览器新开线程执行的，但是回调函数是放入Event Loop里等待执行的，setTimeout也一样，回调事件也是放入Event Loop等待执行，主事件执行完了，才执行Event Loop里的事件。