# react-redux
我们常常把store比作数据的核心，那么react-redux和众多的状态管理库一样，只有store tree一个根节点，store能为你做什么：
- store  provider 数据 state，和操作数据的方法 dispatch，其实就是相当于发布订阅中心
- store 的 state 和  dispatch 触发生成新的 state 的逻辑都被封装到 reducer 中 （reducer管理如何创建“干净的state"）
- store = createStore(reducer)


看完上面，你就发现，数据源有了，更新数据的方法有了，更新数据的逻辑有了，还缺点什么嘛？

## 如何订阅
虽然上面说了如何更新store的state，但是我们至少在更新store，完全没有和UI结合，那么组件如何进行订阅呢？

- **subscribe** 状态监听器：每当store的state更新了，那么就会触发store.subscribe监听器传递的回调函数的触发
  ```javascript
  //引入 store
  store.subscribe(()=>{
    ReactDOM.render(
      <App stroe={store}/>,
      document.getElementById('root')
    )
  })
  ```
  每当store更新时，重新渲染整个组件，但是store数据源，需要使用的组件还未获取到，我们需要手动的传递，或者直接在对应文件引入

- 状态监听器 刷新页面的方式不够优雅，我们可以直接使用store的对应 Provider，当状态刷新时，自动的刷新；并且 store的Provider向下提供了数据源store，可以通过connect方法进行消费获取到对应的store

## React-redux如何异步
为了更好的组织代码，通常还存在ActionType和ActionFun层，ActionFun生成Action对象，当store调用dispatch时传入Action对象，进而在reducer接受到触发的Action，通过Action获取Type根据Type类型，匹配对应的生成新的”干净的“state，触发store的更新


React-redux异步有几种方式：


第一种：直接在组件代码中使用 setTimeout 异步回调触发 dispatch，但是connect()执行不传入任何参数，组件的props获取到dispatch。但是这样代码耦合度高，而且不好追踪，到底什么时候触发的ActionFun

第二种：connect的第二个参数是 mapDispatchToProps ，将 ActionFun 解耦到props上的方法，mapDispatchToProps 返回对象的key，就是props的key，mapDispatchToProps 返回对象的key对应的值，就是props的key对应的值。但是有一个缺点就是，这种方式不支持异步。因此我们需要redux-thunk包，来支持异步：
```javascript
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(thunk) // 中间件
);
```
这样，ActionFun，支持异步调用dispatch

## React-redux如何组合state
state，可能需要分块，或者需要对应的命名空间，以便方便整个应用的使用
```javascript
import { combineReducers } from 'redux'

rootReducer = combineReducers(
  {
    potato: potatoReducer, 
    tomato: tomatoReducer
  }
)
```