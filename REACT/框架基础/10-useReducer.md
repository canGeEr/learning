# 10-useReducer
useReducer 的基本栗子
```javascript
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter( {initialState} ) {
  const [state, dispatch] = useReducer(reducer, initialState, init);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```
## 为什么需要useReducer
在一些复杂的场景下，如果state的数据结构复杂，那么更新state的方式复杂且多变，如果耦合在
逻辑代码中，将相当的难以阅读，可维护性非常差。另外，将复杂的更新方式抽离复用，能够极大的减少重复代码的编写

## useReducer + Context 实现 redux

useState的进阶版，其实你可以看到useReducer 就像创建了一个redux里的store，包含数据源和事件分发，
更令人决定巧妙的是，redux的store需要使用Provider进行更新监听重新渲染，但是useReducer在调用的时候，会进行函数依赖识别，即当
触发dispatch更新state的时候，该组件函数（或者自定义Hooks）将会重新执行，即拿到新的state，并且可以向下传递。但是还缺一个向
深层次的子组件无限传递状态，因此我们可以配合Context穿透传递state，能够实现小型的redux