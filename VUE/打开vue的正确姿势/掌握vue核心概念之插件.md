# 插件和库(含loading插件实战)
> 插件和库几乎是开发大型Vue必备，小demo锻炼语法能力，大项目考究封装和可维护性等。集成插件和库几乎是必须的。

## 开发插件
怎么样的才叫插件开发，安装完插件表现为什么呢？    
你可以想象一些vue-router，在没有安装之前是没有$route或者$router这两个实例属性的，这其实就是注入绑定
```javascript
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或属性 添加静态的方法
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法 
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
//当方法执行，自然的会将这些属性挂载到Vue上
```

## 安装插件
```javascript
const plugin = '插件'
Vue.use(plugin)
//现在就可以使用插件了
```
> Vue.use 会自动阻止多次注册相同插件，届时即使多次调用也只会注册一次该插件。


看看Vue.use发生了什么，附带源码
```javascript
import { toArray } from '../util/index'
 
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }
 
    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
```
1. 导入工具函数 toArray ，可能是用Array,prototype.slice封装的
2. 执行函数，为Vue绑定一个方法use（注意这个方法是静态的）。那是什么方法呢？
3.  方法里要传入一个参数，参数名叫plugin，指插件
4. 注意installedPlugins变量，还有this，首先this是默认情况指的Vue，因为一旦调用一般都是Vue.use。用或符号初始化
5. 关键点 **怎么判别是否重复注册** 
```javascript
if (installedPlugins.indexOf(plugin) > -1) {
  return this
}
/**
  installedPlugins 是一个已经注册的插件队列 后面的 installedPlugins.push(plugin) 可以看出
  .indexOf(plugin) 是在查找是否有相同的插件，注意什么是相同？
*/
// 查找插件的注册函数的地址是否相同，函数亦是一个对象
```
6. 你可以看到一个有趣的是 plugin 不一定要是对象，可以是插件函数的直接值，这意味着其实可以少导出一层，但是相应多了一层判断
7. 其实到这里已经没啥看下去的了，简单概括就是，用插件函数做回调（细心一点发现
  const args = toArray(arguments, 1)
  args.unshift(this)
说明了plugin的注册函数调用的第一个参数就是Vue），传入参数


## 淦 loading实战
> 接下来带大家写一个loading插件，但是这个有点不同的是，不是用标签才渲染组件--这也是这个教程的特殊点。并且会带大家走出一个误区

```javascript
const LoadingComponent = {
  name: 'loading',
  data() {
    return {
      showLoading: true
    }
  },
  methods: {
    show() {
      this.showLoading = true
    },
    hidden() {
      this.showLoading = false
    }
  },
  mounted() {},
  template: `
  <div class="box-container" v-show="showLoading">
    <div class="box1"></div>
    <div class="box2"></div>
    <div class="box3"></div>
    <div class="box4"></div>
    <div class="box5"></div>
    <div class="box6"></div>
    <div class="content">......</div>
  </div>
    `
}

let counter = 0 //可以测试Vue.use是否按意料之中执行

//注意这个是主角 它就是那个插件对象plugin
var Loading = {
  install(Vue, option) {
    console.log(++counter)
    //VueLoading 类
    var VueLoading = Vue.extend(LoadingComponent);
    //这里最好加类型判别
    var loading = new VueLoading(option) // VueLoading 实例
    //注意这里仍然没有绑定元素，甚至没有创建内存中的DOM，也没有虚拟节点
    console.log(loading)
    loading.$mount() //创建VNode和内存DOM
    document.body.append(loading.$el, document.getElementById('app'))
  }
}

//这个是测试配角
var Loadings = {
  install(Vue, option) {
    console.log(++counter)

  }
}

//创建App
const vm = new Vue({
  el: '#app',
  name: 'App',
  data: {

  },
  template: `
  <div id="app">
  这是app组件
  </div>
  `,
  methods: {

  }
})

Vue.use(Loading) 
Vue.use(Loading)
// 有趣的是以上 只打印一层 1

Vue.use(Loadings)
//打印了2
```
**值得注意的是很多人往往在install方法加判断，是否重新注册，但其实根本上是不需要的，原因两个**
1. 当在同一文件中 Loading插件对象只有一个，根据Vue.use源码分析会indexof和return检测，不会重新执行install方法

2. 当Loading插件对象是通过导入的方式，由于webpack的打包方式（这里其实可以先挖个坑），会记录模块化导入的数据，也就是在整个执行过程中Loading插件对象其实只有一个

**因此，对于这样写的同学不需要担心重复注册渲染**