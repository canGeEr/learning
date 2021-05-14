# 一些API的解析

## React.Component 组件类
```javascript
class ThenAble extends React.Component {

}
```
React上的一个属性，表示组件类，一般用于写class类时需要使用到。


## 组件类的生命周期
三个过程：
- mount     => constructor => get­Derived­State­From­Props => getSnapshotBeforeUpdate
- update    => (new props、setState、forceUpdate) get­Derived­State­From­Props => shouldComponentUpdate => render  => getSnapshotBeforeUpdate  => componentDidUpdate
- unMount   => componentWillUnmount

解释比较难懂的几个：
1. get­Derived­State­From­Props：它应返回一个对象来更新 state，如果返回 null 则不更新任何内容（这个特点让它在update过程在shouldComponentUpdate之后）
2. getSnapshotBeforeUpdate：它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）。此生命周期方法的任何返回值将作为参数传递给 componentDidUpdate()（这是它在componentDidUpdate之前的原因）
3. shouldComponentUpdate：组件是否需要更新，如果你知道在什么情况下你的组件不需要更新，你可以在 shouldComponentUpdate 中返回 false 来跳过整个渲染过程。（注意该函数执行的时机）

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

## React.PureComponent 纯组件类
```javascript
class ThenAble extends React.PureComponent {

}
```
区别就在这个**纯**字，React.Component的生命周期有一个**shouldComponentUpdate**，它会在shouldComponentUpdate对中以浅层对比 prop 和 state 的方式来实现了该函数（其实就是对shouldComponentUpdate重写了一下，稍微的优化了一下性能）

## React.memo HOC
React.memo是一个高阶组件（高阶组件都是函数，函数返回值是一个组件而已）

为什么需要？        
class组件为了避免不需要的重复渲染使用shouldComponentUpdate，但是函数组件没有生命周期，大部分情况下props都不会变，因此**函数组件的避免重复渲染是优化组件性能的非常重要的一部分**。       
React.memo就是为了解决这一问题！    
```javascript
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
```
> 需要注意的是：与 class 组件中 shouldComponentUpdate() 方法不同的是，如果 props 相等，areEqual 会返回 true；如果 props 不相等，则返回 false。这与 shouldComponentUpdate 方法的返回值相反