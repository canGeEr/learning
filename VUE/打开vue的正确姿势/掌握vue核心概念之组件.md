# 掌握vue核心概念之组件

## 注册组件
```javascript
//推荐驼峰命名 或者 使用 '-' 还是看个人看法习惯
const GlobalComponent = {
  data: ()=>({  //注意data除了根组件，子组件都要函数返回对象

  }),
  template: '<div>这是一个全局组件</div>'
}

const LocalComponent = {
  data: ()=>({  //注意data除了根组件，子组件都要函数返回对象

  }),
  template: '<div>这是一个局部组件</div>'
}

Vue.component('GlobalComponent', GlobalComponent); //组件名，组件option对象

const vm = new Vue({
  data: {

  },
  el: '#app',
  components: {LocalComponent}  //局部注册
})
// vm无需复用，所以data可以是直接的对象
```

## 懒加载组件
```javascript
const Index = () => import('url');
```

## 动态组件
```javascript
//结合上一案例
const vm = new Vue({
  data: {
    currentTabComponent: 'LocalComponent',
    components: ['LocalComponent', 'GlobalComponent']
  },
  el: '#app',
  //这里其实也可以不挂载GlobalComponent ，因为已经全局注册了
  components: {LocalComponent, GlobalComponent}  //局部注册,
  template: `
    <component v-bind:is="currentTabComponent"></component>
  `,
  methods: {
    //通过用户事件改变 currentTabComponent 值
  }
})
```

## 插槽组件之slot
1. 大家在平时可能都要这样的需求，就是页面首部header和尾部footer几乎相同，可能也只是样式有稍微的差距，用插槽可实现UI页面级别的组件复用。
```javascript
const Head = {
  template: `<header>
    这里是头部
  </header>`
}

const Foot = {
  template: `<footer>
    这里是尾部
  </footer>`
}

const LayoutComponent = {
  components: {Head, Foot},
  template: `<div>
    <slot name="head">
      <Head>这是一段解释，它并不会渲染到页面上，因为Head没有默认的插槽</Head>
    </slot>

    <slot name="main">
      <main>
        这是main插槽的默认渲染内容，请注意main插槽里和head和foot的内容区别
      </main>
    </slot>

    <slot name="foot">
      <Foot>
        这是一段解释，它并不会渲染到页面上，因为Fead没有默认的插槽
      </Foot>
    </slot>
  </div>`
}

const vm = new Vue({
  el: '#app',
  components: {LocalComponent}  //局部注册，
  template: `
    <LocalComponent>
      <template #main>
        渲染父级的main的内容
      </template>
    </LocalComponent>
  `
})
```

2. 默认的插槽default，和使用插槽模板的非缩写形式 v-slot:name 
```javascript
const LayoutComponent = {
  components: {Head, Foot},
  template: `<div>
    <slot name="head">
      <Head></Head>
    </slot>

    <slot name="main">
      <main>
        这是main插槽的默认渲染内容，请注意main插槽里和head和foot的内容区别
      </main>
    </slot>

    <slot name="foot">
      <Foot></Foot>
    </slot>

    <slot>这里是默认的插槽内容</slot>
    <!-- 还可以写多个,但是一样会被渲染，这其实就像写了两个相同的组件一样 -->
    <slot name="default">这里是默认的插槽内容</slot>
  </div>`
}

const vm = new Vue({
  el: '#app',
  components: {LocalComponent}  //局部注册，
  template: `
    <LocalComponent>
      <div>剩余的这一段内容全部其实被模板的name为default的插槽接受</div>
      <template v-slot:main>
        渲染父级的main的内容
      </template>
      <div>剩余的这一段内容全部其实被模板的name为default的插槽接受</div>
    </LocalComponent>
  `
})
```

3. 作用域插槽
> 插槽可以理解为在父级组件中渲染好的元素，最后放到模板文件找个空位，渲染。
但是如果数据其实是在模板组件內部，而父级组件无法获取，那么这就无法实现复用。
有一个解决方法就是作用域插槽。
```javascript
//既然是作用域插槽，那么在模板组件中插槽的声明肯定不一样
const LayoutComponent = {
  data: () => ({
    user: {name: 'zix', email: '2020974511@qq.com'},
    copyright: {author: 'zix', address: '某街道'},
    mainList: ['zix', 'wucan']
  }),
  components: {Head, Foot},
  template: `<div>
    <slot name="head">
      <Head></Head>
    </slot>

    <slot name="main" v-bind:user="user" v-bind:mainList="mainList">
      <main>
        这是main插槽的默认渲染内容，请注意main插槽里和head和foot的内容区别
      </main>
    </slot>

    <slot name="foot" v:bind:copyright="copyright">
      <Foot></Foot>
    </slot>
  </div>`
}

const vm = new Vue({
  el: '#app',
  components: {LocalComponent}  //局部注册，
  template: `
    <LocalComponent>
      <template v-slot:main="{user, mainList, copyright}">
        {{user}} {{mainList}}{{copyright}}
        <!-- copyright 是个错误的演示 -->
        对象接受模板里绑定的数据属性的集合，这里用解构分离声明变量 {{user.name}}
      </template>
    </LocalComponent>
  `
})
```

4. 动态插槽名v-slot:[name]

## 渲染函数createElement
> 对JS编程要求能力较强。渲染函数，它比模板更接近编译器


创建一个虚拟DOM需要什么呢？我们先自己分析下
```html
<body class="body">
  <header></header>
  <footer></footer>
</body>
```
我们假设body是根节点，由于是树形结构，递归，假设N-1层子VDOM为children = [...VNODES]，那么N层如何表示，
```javascript
N = {
  //标签名, 当然这里还可以是组件option对象，不过下面的参数要重写
  labelName: 'body'
  attribute: {
    class: '', style: '', on: {/*事件绑定*/}, attrs: {/*普通属性*/},    
    otherNeedAttribute
  },
  // attribute是可选的，即使传入的是两个参数，也会特殊处理为 childrenVDOM 实参
  childrenVDOM: [
    ...VNODES
  ]
}

N = {
  //组件对象，后面的对象会和 componentOption 合并
  componentOption,
  {
    props: {
      someProp: 'foobar'
    }
  }
}
```

## JSX渲染DOM
为什么先讲JSX，因为其开发效率要不一个个节点通过API创建虚拟DOM高不知道多少倍。
```javascript
createElement(
  'anchored-heading', {
    props: {
      level: 1
    }
  }, [
    createElement('span', 'Hello'),
    ' world!'
  ]
)
```
> JSX需要babel插件 由于涉及内容其实较多(基本webpack搭建，各种配置)，挖个坑先在这，我们就来简单一点的vue-cli-4.x写
cli>3的都默认支持JSX语法的解析了
```javascript
// JSX.vue文件中可以这么写，rander优先级大于template属性值，小于template标签
<template>
</template>
<script>
export default {
  name: 'JSX',
  render(h) {
    return (
      <div>
        JSX组件
      </div>
    )
  }
}
</script>

<style>

</style>
//对于一个vue文件，注意它在被import时会经过vue-cli的打包解析成一个对象，这一点可以从console.log(import ..)看出。有意思的是，在vue文件上，最后形成的组件option对象在模板解析上有优先级选取。1 => template标签；2 => rander函数，3 => template对象属性。
```

```javascript
//JSX.jsx文件
//由于单纯的写vue虽然可以通过编译，但是写JSX是没有提示的，这就让人难受了，不过有一个方案就是直接写JSX文件

//注意，.vue文件是经过解析最后变成了一个组件option对象，并可以提供挂载，其实，被导入父组件的模块就不定需要.vue文件了，可以是一个单纯的完整的返回组件参数对象的js文件，或者说JSX文件

//jsx文件，本质上是JS文件，只不过可以用JSX元素而已，最后被导入的时候依然会进过编译。其实只是单纯的JS文件也可以这么用，至于为什么可能是做过一些处理，我不太清楚

export default {
  name: 'JSX',
  render(h) {
    return (
      <div>
        JSX组件
      </div>
    )
  },
  template: `<div>
    JSX组件template
  </div>`
}
```
## 函数式组件
没有自身需要维持的数据的组件 => 这正是为什么叫函数式组件
```javascript
//1. 
<template functional></template>
//2. 
Vue.component('FunctionComponent', {
  functional: '',
  render(createElement, context) {
    const {props, children, slots, scopedSlots, data} = context;
    //context 其实就相当于react的props，表现的真正的组件像函数传参一样，
    
    //这种叫做透传
    return createElement('labelName', data, children)
  }
})
```