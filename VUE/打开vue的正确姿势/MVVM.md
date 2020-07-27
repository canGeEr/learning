# MVVM
> Vue.js等前端框架，通过MVVM，解放了双手渲染更新DOM。以前的Jq或者原生的JS都是获取DOM和操作    

> 本文主要基于掘金的一篇 MVVM模式介绍 加之自己的理解
## **M-V-MV**

### **M** (数据模型)
包含业务和验证逻辑的数据模型

### **V** (UI视图)
定义屏幕中视图结构，布局，外观

### **VM** (VievModel)
M <==> V 之间的使者，帮忙处理View的全部业务逻辑

## **MVC**
1. view 在 controller的顶端，而model在controller的底部
2. controller同时关注view 和 controller
3. view 只能知道 model 存在并能在 model 值变化更新时收到通知

## MVC VS MVVM
1. 用ViewModel代替了Controller层
2. 如果说MVC的M代表的就是全部的数据
那么组件option对象其实就是一个Model
3. MVC里的C在初看MVVM的时候以为是option的各种声明周期，但细想option整个就是一个数据模型（严格一点可以把data属性去掉，它更像一个数据库），包括了数据解析和方法，数据模型的生命周期（其实也是一个方法数据，只不过VM会控制自动调用），注意这个全部包括了template
4. 那C呢？自然是new Vue，从解析模板，到model数据和方法到View的映射，都是这一步做成的。
5. 注意MVVM和MVC最大的区别就在于交流是双向的（但如果要说的话，我认为MVC其实也是双向的），只是MVVM可以直接通过页面事件通知ViewModel，ViemModel再改变“数据库”（通过代理方式在Vue中，改变data）；而MVC是通过资源路径访问Controller....。