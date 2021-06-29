# 01 初探 JavaScript 和概述

## 一、聊一下 JavaScript 的历史

### **(1) 产生背景和原因**

早期的 Html 是什么样的呢？
[现在收藏的最早的网页](http://en.0430.com/web/TheProject.html)

那个时候还没有 JavaScript 呢！Css 也还在整合当中，当初网页要实现一个表单的提交，可没有 Html5 这么简单轻松。以前的 input 可没有验证属性之类的验证方法，只有每次提交经有服务器验证确认才能确定自己是否有**正确填写格式**。

对的也许你已经能够想到当时网民的痛苦，即使只是数据格式错误，还不是其它错误都需要 30s 的等待回复时间，这是一个相当漫长的过程。直到 1995 年，终于有人站出来解决了这个问题。

> 以下涉及到的时间仅供参考

网景（Netscape Navigator）这家公司希望通过 "**JavaScript**" （当时还不叫 JavaScript）解决这个问题。

- 1995 年 2 月，网景计划发布的 **Netscape Navigator 2** 命名为 **LiveScript** ，它是一门脚本语言，用于浏览器和服务器使用（服务器叫 LiveWire），即**JavaScript 1.0**
- 1995 年 12 月 5 日，为了有热度，**正式发布前夕**，决定蹭一波 Java 的热度，改名叫**JavaScript**
- 1996 你 8 月，**Netscape Navigator 3**发布了**JavaScript 1.1**，同时微软注意到网景，开始投入资源到 Internet Explorer，并在其发布不久后，在**Netscape Navigator 3**加入一些实现（技术）并称其为**JScript**。**至此，JavaScript 的实现开始出现不同版本，为后续的指定标准和统一埋下伏笔。**
- 1997 年，以**JavaScript 1.1**为蓝本被提交给**ECMA**（欧洲计算机制造商协会），希望能够实现通用的，标准的脚本语言的语法和语义。经过数月=> ECMA-262， 并命名为 ECMAScript。**（后面讲到 ECMAScript 的版本问题）**

### **(2) ECMAScript 究竟如何去描述**

1. **ECMAScript**规定了一门语言的基础语法标准，比如 **数据类型，语法，语句，关键字，保留字，操作符，对象**。大家可能都会说 **语言是相通的，通的是什么？** 其实就是基础语法的很大一部分都极其相似（语句，关键字，保留字，操作符）
2. 平时大家说的 JavaScript 的 DOM 和 BOM 相当于**基于 ECMAScript 的基础语法**和**调用一些 C++底层接口（V8 浏览器 JS 引擎）**去实现的一个复杂的函数，只是经过层层封装，最后只是需要调用一个对象的方法属性，看起来好像就是语法的一部分，**但注意，它本质上仍然是一个功能方法**
3. 其实说到**ECMAScript**更多的你应该想起"**浏览器引擎**"，比如 Google 的著名的 V8 引擎，它才是真正解析高级 API，最终翻译执行一条条最基础的语法。

### **(3) 停下，聊聊 ECMAScript 和 JavaScript 和 NodeJs 的关系**

1. JavaScript 现在广义上就是客户端的 JavaScript 脚本语言，**以浏览器作为其宿主环境**；而 NodeJs 则是服务端的 JavaScript 语言，加入大量的**Node API**
2. ECMAScript 只是对"JavaScript"（广义上的 JavaScript）的核心语法的实现，说的像人话一点就是：我们所学的 JavaScript 的基本语法，包括数据类型，语法，语句，关键字，保留字，操作符，对象等等，平时用的各种 API 都是通过基础语法去实现的。因此 ECMAScript 也常被贴上**JavaScript 的核心**，如果没有它，一切 API 的调度都没有了意义。

3. JavaScript 和 NodeJs 差别就是 ECMAScript 运行在不同的平台，拥有不同的 API 进行调度。

### **(4) ECMAScript 故事的后续**

1. 请注意，其实到了 ECMAScript，各大浏览器开始都并不买账，最后还是**Netscape**最先实现 ECMAScript 发布的是**JavaScript 1.3**，后来大家大家基本都以 ECMAScript 标准去实现，但是注意，只是 ECMAScript 实现完成了标准，在浏览器这个宿主环境，或者说平台，由于多年的历史积累，以及不知道有多少**DOM API**和**BOM API**有不同的实现，从而产生兼容性问题。
2. ECMAScript 版本问题：在 ECMAScript 前期，都是以 **ECMA-262 + 第 N 版** 结束命名，比如 ECMA-262 第二版（简称**ECMAScript 2**），ECMA-262 第三版，直到 ECMA-262 第五版（**ECMAScript 5**）
3. 2011 年，ECMAScript 5.1 版发布后，就开始制定 6.0 版了。因为这个版本引入的语法功能太多，而且制定过程当中，还有很多组织和个人不断提交新功能，于是希望 ECMAScript 能够快速更新，希望每年 6 月份发布一次，因为是每年发布一次，所以 ECMA-262 的版本号改为 **ECMA-262 + 年份**
4. **ECMAScript 2015** （如果按照以前的版本命名为**ECMAScript 6**）是一个 ECMAScript 划时代的版本，引入了非常多的东西，之后的 2016、2017 变化相对较小，于是在人们口中**ES6**慢慢泛指**ECMAScipt 2015 及其以后版本**

## 二、聊一下 JavaScript 的 DOM 和 BOM

### **(1) DOM (Document Object Model) 文档对象模型**

1. DOM 是什么？
   - DOM 是针对 XML 经过但扩展用于 HTML 的应用编程接口 API
   - 其实从它的名字不难看出，是**文档对象**的模型，说明和文档的内容有关，文档其实就是 HTML，因此可以理解为和 HTML 有关的所以 API 接口，都被集中到抽象到 **Document Object Model** 上
2. DOM 的发展史：
   - **Netscape Navigator 3** 和 **Internet Explorer 4**分别支持不同的 DHTML(Dynamic HTML)，开发人员不需要刷新就能重新加载网页，修改内容和外观，DOM 开始产生兼容性问题，只编写一个 HTML 就能在任何浏览器运行的时代结束
   - **(World Web Consortium) W3C** 开始着手规划 DOM 的标准
   - DOM 一级、二级、三级分别出现。其中 DOM 一级主要是两个部分：DOM 核心（如何映射基于 XML 的文档结构）和 DOM HTML（针对 HTML 的对象和方法），后两级一直增加新的模块，比如视图、事件、样式等等。
3. 浏览器对 DOM 的支持情况
   - 其实每个技术都这样，各各浏览器并不会完全按照标准实现，即使是，也需要相当长的一段事件

### **(2) BOM (Brower Object Model) 浏览器对象模型**

大致是和 DOM 差不多意思就可，应该很容易理解

1. BOM 是什么？
   - 支持可以访问和操作浏览器的应用编程接口 API。
2. BOM 的发展史：
   - BOM 在之前一部分一直没有相关的标准出现，直到 HTML5，致力于把很多 BOM 功能写入正式规范。
3. 功能大致包括：
   - 弹出新的浏览器窗口
   - 移动、缩放和关闭浏览器
   - 提供浏览器详细的信息的 navigator 对象
   - 提供加载页面详细信息的 location 对象
   - screen 对象
   - 对 cookie 支持
   - XMLHttpRequest 和 IE 的 ActiveXObject
4. 兼容，一言难尽。
