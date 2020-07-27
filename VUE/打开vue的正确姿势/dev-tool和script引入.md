# Vue.js呼叫请回答
> 注意：该栏目全部一句Vue.js官网的教程2.x编写

## script引入
```html
<!-- 生产环境（上线） -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.11"></script>
<!-- 使用最新版本 开发版 供学习 -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

## MVVM => VM
1. 简单创建一个实例，并显示实例数据的name值
```html
<!-- 上面忽略一大堆 -->
<body>
  <div id="app">{{name}}</div>
</body>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
  const vm = new Vue({
    name: 'App' //给这个vm起个名字（随意的）
    el: '#app', //要绑定的元素
    data: {     //绑定的响应数据 
      name: 'zix'
    }
  })
</script>
<!-- 下面忽略一大堆 -->
```

2. 实例 参数的data数据 会对应到实例的getter和setter方法，代理数据
```javascript
const data = {     
  name: ''
}
const vm = new Vue({
  name: 'App' //给这个vm起个名字（随意的）
  el: '#app', //要绑定的元素
  data        //绑定的响应数据 
})
//注意式data的数据是响应的
console.log(vm.name) // => 'zix' getter方法
vm.name = 'wucan' // => data.name === 'wucan' setter方法
```

> 声明周期就不讲了，对新手难于理解

## 总结
Vue.js是一个渐进式框架，虽然刚才只是其中一角，但是依然让人感觉到其中的强大，并拿来使用。通过深入
的学习，整个框架的结构细节也越来丰满。