# RESTful
> 几句比较简练的话概括 --- **来自知乎**

-  URL定位资源，用HTTP动词（GET,POST,DELETE,PUT,PATCH）描述操作
-  看Url就知道要什么    
   看http method就知道干什么   
   看http status code就知道结果如何
- 就是用URL定位资源，用HTTP描述操作。
## 先说为什么需要
前后端分离之后，就出现各种各样的事情，其中最为麻烦的就是接口的冲突，**对接**一直是
前后端分离的 难点之处      
对接由于没有统一规范，在人们慢慢的摸索中先有了经验    
- 先电脑的3层协议是否连通（能否ping通），代表电脑已经在同一网段下，可以相互访问资源
- 拿到后端暴露的资源路径URL，通常称之为API接口（后端也会写接口文档规范开发）
- 前端请求接口，获取数据

在这三步中，第二、三步一直难以规范开发。举个例子：    

1. 某司一个团队开发两个项目，第一个项目的注册url为API/addUser，而第二个为API/register，如果开发的项目越来越多，处理起来感觉头大，都可能忘了到底访问那个接口，或者每次前端请求数据，都要查询接口文档，非常的不便。
2. 如果一个资源路径要获取大于6岁的用户列表，它可能是这样API/getUserLargerNub，那要小于6岁呢？ API/getUserSmallNub，取名取者自己都乱了。
3. 前端做什么资源请求都是直接post，最后感觉怎么做的单调，很不雅，比如获取用户信息，应该是get动作，但是前端用post方式访问了API/getUser Url 。


基于此RESTful诞生了。
## RESTful是什么
> 百度百科

**RESTFUL是一种网络应用程序的设计风格和开发方式**，基于HTTP，可以使用XML格式定义或JSON格式定义。RESTFUL适用于移动互联网厂商作为业务使能接口的场景，实现第三方OTT调用移动网络资源的功能，动作类型为新增、变更、删除所调用资源。

怎么理解：
1. RESTful只是一种架构方式的约束，给出一种约定的标准，完全严格遵守RESTful标准并不是很多，也没有必要。但是在实际运用中，有RESTful标准可以参考，是十分有必要的

2. REST：Representational State Transfer（表象层状态转变），
   - 每一个URI代表一种资源
   - 客户端和服务器之间，传递这种资源的某种表现层
   - 客户端通过HTTP动词，对服务器端资源进行操作，实现”表现层状态转化”

## RESTful对什么进行了约束呢？
回到最开始 *看Url就知道要什么、看http method就知道干什么、看http status code就知道结果如何*
- 资源路径做出限制
- http请求方式+资源名称，决定了要访问的资源
- 返回结果要符合规范（但不限于规范返回结果，实际还是根据贵司的情况做调整）

**具体的其实各种说法，大家只要注意这三点，并形成风格，那么你的接口设计就是RESTful风格**
      

## RESTful具体约束
CSDN一位： [面试官：你连RESTful都不知道我怎么敢要你？](https://blog.csdn.net/kebi007/article/details/102927209)      
B乎：[怎样用通俗的语言解释REST，以及RESTful？](https://www.zhihu.com/question/28557115/answer/48094438)     
阮一峰的网络日志: [RESTful API 设计指南](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)