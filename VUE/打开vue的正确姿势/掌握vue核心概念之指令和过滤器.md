# 自定义指令 && 过滤器
这些东西都和component差不多

## 过滤器
Vue.js 允许你自定义过滤器，可被用于一些常见的文本格式化。过滤器可以用在两个地方：双花括号插值和 v-bind 表达式 (后者从 2.1.0+ 开始支持)。过滤器应该被添加在 JavaScript 表达式的尾部，由“管道”符号指示
```javascript
{
  template: `<div>
    <!-- 在双花括号中 -->
    {{ message | capitalize }}

    <!-- 在 `v-bind` 中  2.1.0+  -->
    <div v-bind:id="rawId | formatId"></div>
  </div>`
}
```

1. 局部过滤器
```javascript
expoet default {
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
}
```

2. 全局注册
```javascript
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
```
过滤器得参数其实就是 过滤器前得变量，另一个值得注意得是，自然是优先级解决冲突，其实就是合并

3. 过滤器是 JavaScript 函数，因此可以接收参数：
```javascript
  {{ message | filterA('arg1', arg2) }}
```
这里，filterA 被定义为接收三个参数的过滤器函数。其中 message 的值作为第一个参数，普通字符串 'arg1' 作为第二个参数，表达式 arg2 的值作为第三个参数。


## 自定义指令

### 函数简写
```javascript
//注意 你可能想在 bind 和 update 时触发相同行为，而不关心其它的钩子。比如这样写：
//这里先屏蔽一下钩子函数，我喜欢从简单到难
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```
### 钩子函数（指令顺着VNODE得生命周期）
一个指令定义对象可以提供如下几个钩子函数 (均为可选)：
- **bind**：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
- **inserted**：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
- **update**：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
- **componentUpdated**：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
- **unbind**：只调用一次，指令与元素解绑时调用

### 钩子函数参数
每个钩子函数都会有相应得参数，作为回调函数，为了获取this之类得对象，会显得比较复杂
- **el**：指令所绑定的元素，可以用来直接操作 DOM。
- **binding**：一个对象 具体参考 
https://cn.vuejs.org/v2/guide/custom-directive.html#%E9%92%A9%E5%AD%90%E5%87%BD%E6%95%B0%E5%8F%82%E6%95%B0
- **vnode**：Vue 编译生成的虚拟节点。移步 VNode API 来了解更多详情
- **oldVnode**：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。


> 说太多都是假的，来个实操
```javascript
export default {
  data: ()=>({
    color: 'red',
    width: '200px',
    height: '200px',
  }),
  template: `<div v-anim style="{color, width, height}" >

  </div>`,
  directives: {
    anim: {
      bind(el, binding, vnode, lodNode) {
        console.log(el, binding, vnode, lodNode)
      },
      unbind(el, binding, vnode, lodNode) {
        console.log(el, binding, vnode, lodNode)
      }
    }
  }
}
```
1. bind是和unbind应该一起使用得，当然着也和其它得并不冲突就像$on和$once一样
2. inserted , update, componentUpdated 配合使用