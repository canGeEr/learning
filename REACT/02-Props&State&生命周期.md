# 02-Props&State&生命周期

## Props
React的props: **单向数据流，向下传递数据，底层组件无法更新props影响上层组件**

但是，相较于Vue的props，React的Props更加的彻底和纯粹，这体现在：
- 获取元素DOM的ref
- 绑定事件的函数的this和作用域问题（可以传递函数）
- 可以传递JSX元素（组件和JSX本身都是对象！）

> Vue对props做了很多分类和过滤处理来绑定到Vue组件实例对象上，React的props**什么都可以传入**！


## State
状态更新几乎是区分React和Vue原理的主要部分，Vue通过数据劫持和绑定实现的直接修改state的属性就能触发更新

state需要注意两个问题：
- state的更新属于合并 **setState的实参对象可以选择部分更新**
- React不基于数据代理proxy，那么不能直接修改this.state的属性，而使用setState
- React的state有更新延时（Vue的异步渲染，nextTick），setState之后，并不是this.state也会立即更新

我们看一段代码明白React状态延时更新：
```javascript
const { value } = this.state;
this.setState({
  value: value + 1,
});
console.log(this.state.value); 
// 如果你以Vue的思维，肯定以为输出的是2，但实际上输出的是1即this.state.value的值在调用setState之后没有理解更新，而是延时到该”论“所以的数据更新收集完成，进行一次性更新
```

基于延时更新，如果代码如下，那么不会按照预期执行

```javascript
for(let i=0; i<10; i++>) {
  this.setState({
    value: this.setState.value + 1,
  });
}
//最后输出的this.state.value还是1!
```

那么如何访问到更新之后的state呢？

```javascript
for (let i = 0; i < 10; i += 1) {
  this.setState((state, props) => {
    console.log(state.value);
    return {
      value: state.value + 1,
    };
  });
}

console.log(this.state.value);
```

setState传递一个函数，**函数第一个形参表示state，但是这个state是之前调用的所以setState方法更新之后获取到的state**，因此可以放心的使用，props也是最新的。需要注意的是：回调函数的返回值即return的值是设置的新的state
