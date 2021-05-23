# 高阶组件

## React.memo
PureComponent是对组件实现的shouldComponentUpdate的封装，但是生命周期只有class组件才有，对应普通的函数组件我们应该如何进行props对比，从而达到优化性能的问题

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

React.memo 是一个高阶组件，将函数组件作为第一个参数，将类似于shouldComponentUpdate函数作为第二个参数，React.memo内部实现当areEqual返回值为true时，返回上一次对函数组件的“缓存”，从而达到性能优化

