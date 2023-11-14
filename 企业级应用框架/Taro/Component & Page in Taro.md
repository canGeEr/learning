
## Taro2.x的组件和页面
Taro2.x是通过一定规则将的React代码转换成小程序原生，这也被称作为强绑定React DSL
- 如果页面比较复杂，层级嵌套很深，那么setData将变得过于复杂导致更新变慢，这里通过[小程序自定义组件](https://taro-docs.jd.com/docs/optimized#%E4%BC%98%E5%8C%96%E6%9B%B4%E6%96%B0%E6%80%A7%E8%83%BD)达到优化层级的效果
- 解决逻辑执行互通，hooks和生命周期在小程序和React组件互通（Nerv JS，在@tarojs/taro-weapp实现）

@tarojs/taro-weapp 通过 createComponent(createApp) 函数根据 ReactComponentClass 创建对应的React实例并返回适配 小程序原生Component(App)的Options，因此小程序和React组件是并存的，相互存在引用
```javascript
// 这里是 createApp 示例
function createApp (AppClass) {
  const app = new AppClass()
  const weappAppConf = {
    onLaunch (options) {
      app.$app = this
      app.$app.$router = app.$router = {
        params: options
      }
      if (app.componentWillMount) {
        app.componentWillMount()
      }
      if (app.componentDidMount) {
        app.componentDidMount()
      }
    },
	// 还有很多其他的生命周期相互绑定
  }
  return Object.assign(weappAppConf, app)
}

export default createApp
```

在Taro中，开发者编写组件或者页面时访问的this通常是React组件，如果需要访问对应的原生小程序实例需要：
```javascript
// 在@tarojs/taro-weapp 的 create-component.js 注意_init方法的调用（建立$scope的链接）
this.$scope

// 获取小程序app实例
Taro.getApp()
```

## Taro3.x的~~组件~~和页面
Taro3.在app.config.js 或者 page.config.js 使用 usingComponents，taro **任然**会将其转换成原生小程序自定义组件，但是它的wxml的渲染仍然是template递归渲染

这样意味着，Taro3只能通过Page(App)注册小程序原生页面，并且React虚拟DOM在构建中通过自定义reconcile获取到Page(App)的整个自定义DOM Tree，在运行时，当每次DOM Tree更新完成之后再跟原生Page(App通信，通过setData将整个/局部数据交给原生Page渲染以达到更新，Page(App)通过template递归渲染完成流程

- 初次渲染非局部更新，需要递归渲染整个DOM Tree的template，相对Taro2.x已经编译好wxml慢一点
- 如果页面比较复杂，层级嵌套很深，那么setData将变得过于复杂导致更新变慢，这里通过[小程序自定义组件](https://taro-docs.jd.com/docs/optimized#%E4%BC%98%E5%8C%96%E6%9B%B4%E6%96%B0%E6%80%A7%E8%83%BD)达到优化层级的效果

注意 Taro3.x除非特意指定将某个组件或者页面**打包**成原生自定义组件，否则不会自动编译组件成原生组件，即使是<CustomWrapper />也只是 CustomWrapper 是原生组件，内部的children仍然通过template递归渲染；


**!!#ff0000 总结 this.$scope 一般情况下无法访问，不再是一个Taro Component 对应一个原生组件!!**

## Taro3.x 怎么把组件编译成原生
-~~[把 Taro 组件编译为原生自定义组件](https://taro-docs.jd.com/docs/taro-in-miniapp#%E6%8A%8A-taro-%E7%BB%84%E4%BB%B6%E7%BC%96%E8%AF%91%E4%B8%BA%E5%8E%9F%E7%94%9F%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6)~~，注意这里只能专门的打包编译，不能在Taro3中混用
- 在 **app.config.js** 或者 **page.config.js** 使用 usingComponents，taro 会将其转换成原生小程序自定义组件，但是它的wxml的渲染仍然是template递归方式，总体效果类似 CustomWrapper，但是需要注意，如果需要在render渲染出来，必须使用小写 比如 TestComponent =>  test-component

!!#ff0000 现阶段踩坑：
虽然usingComponents确实能加载React组件，也确实会编译成原生小程序，但是两者数据传递没有互通，即props传递无效，无法刷新状态!!

