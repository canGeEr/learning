# JSX in Vue
> 如果你写过React的JSX，那么对你来说，学的会非常快，但是由于所谓的JSX都是通过解析模板调用createElement函数，最好生成虚拟DOM。
Vue的createElement和React的createElement显然不同，所有对于一些问题的需要特殊处理

## 安装
> vue-cli-v4.x已经直接支持写JSX了，不需要配置

官方文档，请仔细阅读
[vuejs/jsx](https://github.com/vuejs/jsx#installation)

## CreateElemnet了解

### **1. React中的createElemnet**
每个 JSX 元素只是调用**React.createElement(component, props, ...children)** 的语法糖。因此，使用 JSX 可以完成的任何事情都可以通过纯 JavaScript 完成。**请注意第二个参数是props**，这个props包含所有传参，这也是为什么说，react是函数式编程特点。

### **2. Vue中的createElemnet**
> 然而，Vue做了一层过滤，当然如果要说的话本质是一样的（JSX是怎么被解析的，它本身和某个库无关，独立的一种标识————Vue做了对参数分类过滤）

那看下Vue是如何做的：     
```javascript
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // 一个 HTML 标签名、组件选项对象，或者
  // resolve 了上述任何一种的一个 async 函数。必填项。
  'div',

  // {Object}
  // 一个与模板中 attribute 对应的数据对象。可选。
  {
    // 与 `v-bind:class` 的 API 相同，
    // 接受一个字符串、对象或字符串和对象组成的数组
    'class': {
      foo: true,
      bar: false
    },
    // 与 `v-bind:style` 的 API 相同，
    // 接受一个字符串、对象，或对象组成的数组
    style: {
      color: 'red',
      fontSize: '14px'
    },
    // 普通的 HTML attribute
    attrs: {
      id: 'foo'
    },
    // 组件 prop
    props: {
      myProp: 'bar'
    },
    // DOM property
    domProps: {
      innerHTML: 'baz'
    },
    // 事件监听器在 `on` 内，
    // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
    // 需要在处理函数中手动检查 keyCode。
    on: {
      click: this.clickHandler
    },
    // 仅用于组件，用于监听原生事件，而不是组件内部使用
    // `vm.$emit` 触发的事件。
    nativeOn: {
      click: this.nativeClickHandler
    },
    // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
    // 赋值，因为 Vue 已经自动为你进行了同步。
    directives: [{
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }],
    // 作用域插槽的格式为
    // { name: props => VNode | Array<VNode> }
    scopedSlots: {
      default: props => createElement('span', props.text)
    },
    // 如果组件是其它组件的子组件，需为插槽指定名称
    slot: 'name-of-slot',
    // 其它特殊顶层 property
    key: 'myKey',
    ref: 'myRef',
    // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
    // 那么 `$refs.myRef` 会变成一个数组。
    refInFor: true
  }

  // {String | Array}
  // 子级虚拟节点 (VNodes)，由 `createElement()` 构建而成，
  // 也可以使用字符串来生成“文本虚拟节点”。可选。
  [
    '先写一些文字',
    createElement('h1', '一则头条'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```
第一个参数都一样，但是你发现第二个在Vue叫做数据对象，它将（拿react做对比）props拆分成各种属性，这也是为什么vue会有各种指令然后实现。      
**值得注意的是props这个属性是数据对象的属性的一个元素**
> 这也导致，在vue的组件上要进行**透传**，需要这样写
```javascript
const VNode = (
  <div props={props} ></div>
)
```

### **3. 怎么理解createElement**
首先进行JSX语法的识别，把标签作为调用createElement的第一个参数，让后获取所有绑定在组件上的attributes，作为第二个参数（vue和react的这个函数的区别就在这里，react将所有的组成一个对象，叫做props；但是vue是数据对象，包含了props），将其所有子节点做第三个参数。

## 真正在Vue写JSX
> 看完createElement你就可以写了，**不然你会遇见很多奇怪的坑**

### **1.数据绑定，渲染变量**
(1) 模板语法
```javascript
const name = 'zix'
{
  template: `<div>
    {{name}}
  </div>`,
  //第一种绑定this
  created() {
    this.name = name
  },
  //第二种绑定data，这种vue会对其进行监听更新，所有性能上
  data() {
    return {
      name: name
    }
  }
}
```
注意，这个name要渲染，必须是Vue对象实例上的属性，模板解析的是获取实例的name属性，你以为的获取data只是数据双向绑定的结果，在代码表象上，仍然是**实例.name**

(2) JSX
```javascript
{
  render(h) {
    const name = 'zix'
    //所有能访问的变量都可以，绑定属性
    return (
      <div name={name} >{name}</div>
    )
  }
}
```

### **2.属性透传**
```javascript
{
  render(h) {
    const {$props} = this
    const name = 'zix'
    //所有能访问的变量都可以，绑定属性
    return (
      <div props={...$props} >{name}</div>
    )
  }
}
```

### **3.作用域、插槽**
```javascript
{
  render(h) {
    const {$props, $slots, $scopedSlots } = this
    const defaultSolt =  $slots.default && $slots.default() //默认插槽
    const nameSolt =  $slots.name && $slots.name() //具名插槽，作用域用$scopedSlots
    const name = 'zix'
    //所有能访问的变量都可以，绑定属性
    return (
      <div props={...$props} >
        {{defaultSolt}}
      </div>
    )
  }
}
```

## 总结
写JSX的时候只要符合对应库的createMent函数，就不会出问题，当然有些可以JSX和模板语法结合，会有不一样的体验。