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

> setState可以传递第二个函数参数，和Vue的nextTick很相识


## 生命周期
了解生命周期非常重要：
- 什么时候能够访问实例this
- 什么时候能够获取真实的DOM元素
- 什么时候应该去请求数据
- 什么时候组件销毁，去掉一下绑定在组件上的消耗内存的东西（比如定时器）
- 什么时候渲染，什么时候更新，如何去优化性能

[异步渲染之更新](https://zh-hans.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#adding-event-listeners-or-subscriptions) ，这篇文章具体的讲解了
- 每个生命周期应该干点啥，不应该怎么做
- 解释了为什么新版的React去除那么多生命周期，为什么加一些生命周期

[生命周期图谱](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)，图解生命周期

- **constructor** 构造函数
  
  这个阶段可以访问this组件实例，但是需要调用super(props)。这个阶段主要是**初始化state**和**绑定方法的this**

- **getDerivedStateFromProps** 从props获取派生的state

  注意：**派生意味着有依赖性**，它发生在constructor之前，但是在render之后。当props更新后（需要注意的是setState和forceUpdate方法调用的时候都会触发该阶段），会触发该生命周期，如果有state的值依赖于props，那么这个阶段就可以s返回新的state以便达到派生的效果

    ```javascript
    // After
    class ExampleComponent extends React.Component {
      // 在构造函数中初始化 state，
      // 或者使用属性初始化器。
      state = {
        isScrollingDown: false,
        lastRow: null,
      };

      static getDerivedStateFromProps(props, state) {
        if (props.currentRow !== state.lastRow) {
          return { //返回新的state
            isScrollingDown: props.currentRow > state.lastRow,
            lastRow: props.currentRow,
          };
        }

        // 返回 null 表示无需更新 state。
        return null;
      }
    }    
    ```
    值得注意的是该方法作为一个**静态方法**
- render 渲染

  这个阶段最好理解，但是这个阶段也是最消耗性能的阶段，因此如果可以应该尽量的减少更新：该阶段的执行（shouldComponentUpdate进行过滤判断）

- **shouldComponentUpdate(nextProps, nextState)** 组件是否需要更新，（PureComponent是对它进行封装）

  这里可以当state或者props有变动的时候，进行判断，如果一些值没有变化，可以选择返回false，那么render等之后的生命周期函数就不会调用

- **getSnapshotBeforeUpdate**  更新之前获取一次快照
  
  很多时候，DOM更新之前我们可能需要记录某些元素的滚动条的滚动距离，这个时候可以在当前阶段处理

- componentDidUpdate 、componentDidMount（操作DOM、ajax请求数据）、componentWillUnmount