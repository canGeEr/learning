# Vue.extend && Vue.$mount

## Vue.$mount 挂载
```html
//index.html文件
<body>
  <div id="app"></div>
</body>
```
```javascript
//index.js文件
//1. 先看看普通的绑定
new Vue({
  el: '#app',
  // el: document.getElementById('app') 
  template: `<div id="app">
    如果new Vue时候的option的el属性存在，那么它会自动的绑定并渲染到页面上
  </div>`
})

//2. vm.$mount( [elementOrSelector] ) 元素或者选择器(类'#app')
/*如果没有提供 elementOrSelector 参数，模板将被渲染为文档之外的的元素，并且你必须使用原生 DOM API 把它插入文档中*/

//2.1
var vm = new Vue({ //没有el选项
  template: `<div id="myapp">
    如果new Vue时候的option的el属性存在，那么它会自动的绑定并渲染到页面上
  </div>`
})

vm.$mount('#app') //自动创建渲染在DOM外并绑定渲染

//2.2 
var vm = new Vue({ //没有el选项
  template: `<div id="myapp">
    如果new Vue时候的option的el属性存在，那么它会自动的绑定并渲染到页面上
  </div>`
})

vm.$mount() //自动创建渲染在DOM外，可以打印vm.$el => myapp的元素 注意是根据template生成了DOM树，但是还在内存里
document.body.appendChild(vm.$el)

```

## Vue.extend
它其实就是类的继承的意思，它其实是一种寄生组合式的继承。如果你把Vue.extend(someClass)看成Vue的子类，其实你已经理解了一半了    
我们再来看一个官方的例子
```html
<div id="mount-point"></div>
```
```javascript
// 创建构造器
var Profile = Vue.extend({
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data: function () {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
})
// 创建 Profile 实例，并挂载到一个元素上。
var profile1 = new Profile().$mount('#mount-point')

var profile2 = new Profile().$mount('#mount-point')

var profile3 = new Profile().$mount('#mount-point')
```
1. 根据上面的profile1，profile2，profile3你可能已经有头绪了，如果正常注册一个component它不论式全局注册还是局部
都要传入参数对象option，进行参数配置，那你看看Profile（Vue 的子类）这样一看是不是就明白了呢。

2. 父类是子类功能复用，行为抽离的类，而Vue和Profile显然满足这一条件

3. 那为什么说Vue.extend要传入的配置的data是函数，而不是对象呢，其实很简单，profile1，profile2，profile3也告诉了你其实，一个类肯定可以创建多个实例，而在vue的內部它是直接将传入的option配置对象的data作为数据来源，即状态。为了保持每个Profile实例组件都独立，自然只能用函数返回对象

4. new Profile 产生的实例时VueComponet级别的，要注意区分

5. new Profile([option]) 仍然可以传入option参数，两个参数会进行合并，生命周期成数组队列依次执行
。如果你学过mixin混入，那你就会更加清晰是怎么合并的。
```javascript
var MyVue = Vue.extend({
  name: 'MyVue',
  data:()=>({
    nickname: 'zix',
    id: 0
  }),
  created() {
    console.log('注册了MyVue类')
  }
})

console.log(new MyVue({
  data:()=>({
    nickname: 'wucan',
    id: 1
  }),
  created() {
    console.log('创建了了MyVue类实例')
  }
}))
```