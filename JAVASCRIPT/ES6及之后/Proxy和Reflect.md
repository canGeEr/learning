# Proxy && Reflect

## Proxy 代理

> Proxy 构造函数用于创建一个参数对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等

**handler 的各各属性是对应的捕获器（trap）**
常见的监听方法有：

- getPrototypeOf
- setPrototypeOf
- isExtensible
- preventExtensions
- getOwnPropertyDescriptor
- defineProperty
- has 拦截 in 操作
- deleteProperty 拦截 delete 操作
- get(target, propKey, receiver) 拦截访问属性，表示 Proxy 实例本身
- set(target, propKey, value, receiver) 拦截赋值属性
- ownKeys 拦截 getOwnPropertyNames 或者 getOwnPropertySymbols
- apply 拦截函数调用
- construct 拦截 new 操作调用

#### 问 Vue 为什么用 Proxy 重写

- defineProperty 无法监听对象重新添加的属性
- defineProperty 不能很好的实现对数组下标的监控（可能新增元素）

## Reflect

ES6 中将 Object 的一些明显属于语言内部的方法移植到了 Reflect 对象上（当前某些方法会同时存在于 Object 和 Reflect 对象上），未来的新方法会只部署在 Reflect 对象上。

Reflect 对象对某些方法的返回结果进行了修改，使其更合理。

Reflect 对象使用函数的方式实现了 Object 的命令式操作。

## 实现观察者模式

```javascript
// 定义 Set 集合
const queuedObservers = new Set();
// 把观察者函数都放入 Set 集合中
const observe = (fn) => queuedObservers.add(fn);
// observable 返回原始对象的代理，拦截赋值操作
const observable = (obj) => new Proxy(obj, { set });
function set(target, key, value, receiver) {
  // 获取对象的赋值操作
  const result = Reflect.set(target, key, value, receiver);
  // 执行所有观察者
  queuedObservers.forEach((observer) => observer());
  // 执行赋值操作
  return result;
}
```
