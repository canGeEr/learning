# 掌握vue核心概念之响应式数据
本篇文章主要讲的是vue的数据更新，要怎么去做，但是我并不会涉及原理之类的去讲（也就数据代理，递归处理对象，绑定函数更新）
只是告诉萌新如何去用，作为一个初学者，我仍然建议先了解一个大概，做到第一阶段的能用，第二阶段埋坑，第三阶段的了解原理，第四阶段的自己工具

## option.data
为什么会响应，注意是将option的data函数调用或data值，遍历解析属性，代理挂载到vm上（挂载的是对应属性的getter和setter方法），
在实质上，vm只是有一根通向option的data的电话线，你编写代码说要操作获取data属性值在vm上，vm反手就是通知option的data更新

> 如果把data比喻成原生产商，那么vm就是中间商，赚差价（getter和setter能干别的事中间），正是因为是中间人，才能使得DOM可以监听到更新，这其实是一种设计模式


下面是实现一个简易的响应vm
```javascript
(function (global) {
    function Vue(option) {
      //这里忽略一些绑定，el等等，我们只关注数据
      this.$option = option;
      var data = option.data //注意这里仍然指向同一地址
      this._data = {};
      //先将data的属性代理到_data，再转到vm
      monitor(this._data, data);
      monitor(this, data);
    }

    //monitor 监听
    function monitor(target, resource) {
      //注意这里用的是var pro 和 value 再次访问的时候会变值
      for (var pro in resource) {
        var value = resource[pro]   //算值
        //递归处理
        switch (typeof value) {
          case 'object':
            if (__isArray(value)) { //处理数组

            } else { //处理对象
              var deep_data = {}
              monitor(deep_data, value)
              __proxy(target, pro, resource, deep_data);
            }
            //这里还有两张情况 对象 和 数组对象
            break;
          default:
            __proxy(target, pro, resource);
            break;
            //这里是默认的一些类型，基本类型和函数不需要嵌套代理
        }
      }
    }

    //这里手动实现一个proxy，如果用ES6将非常简单
    function __proxy(target, pro, resource, getterResource) {
      Object.defineProperty(target, pro, {
        configurable: false,
        enumerable: false,
        get: function () {
          return getterResource || resource[pro]
        },
        set: function (fresh) { // 更新DOM 因此这里也可以看出，是先解析模板的
          resource[pro] = fresh
        }
      })
    }

    function __isArray(target) {
      if ('isArray' in Array) return Array.isArray(target)
      return Object.prototype.toString.call(target).slice(8, -1) === 'Array'
    }

    global.Vue = Vue
  })(window)
```

### 添加，删除 响应式属性
上面说了，只有在注册组件的option的data的属性（递归）绑定，才能是响应式的。
那么都在初始化的时候绑定了，怎么在使用中添加动态属性呢
```javascript
// 添加 api => Vue.set( target, propertyName/index, value )
// 删除 api => Vue.delete( target, propertyName/index )
```
对于数组其实是一个特殊的元素，如果一个一个绑定从0 => arr.length 那将很耗费资源，性能低

## 更新数据
基于上面的东西
### 对于对象
直接更新就行

### 对于数组
数组的一些方法是被重写过的
```javascript
//更新数组元素 可以 api => Vue.set(arr, index, value)
// splice 方法
```