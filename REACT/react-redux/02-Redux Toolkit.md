# 02-Redux Toolkit
[redux 官网](https://redux.js.org/)

react-redux组织代码过于繁琐，因此我们希望能有个中间件，帮我们开发人员写更少的代码，组织更好的逻辑，Redux Toolkit做到了（它是官方推荐的）

## createSlice 代码分片
```javascript
import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer
```
我们通过这段简短的代码发现，createSlice函数生成的对象 counterSlice 直接包含了对应的action 和对应的 reducer ，这使得整个过程没有 action对象的参与，也少了actionType，并且createSlice传入的对象具有命名空间属性，而且更容易看懂

## configureStore 组合 slice生成的reducer
```javascript
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'

export default configureStore({
  reducer: {
    counter: counterReducer
  }
})
```
## Toolkit 异步 dispatch
```javascript
// 在createSlice文件中，我们获取到了对应的counterSlice.actions
// 那么可以尝试导出一个异步方法，异步回调调用对应的actions就可
export const { increment, decrement, incrementByAmount } = slice.actions;

export const incrementAsync = amount => dispatch => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount));
  }, 1000);
};
```

## 如何在组件使用
- useSelector 传入一个函数，函数会自动的调用，并返回函数的结果作为值使用
    ```javascript
    const count = useSelector(state => state.counter.value)
    ```
- useDispatch 返回dispatch对象，对象接受 counterSlice.actions 的ActionFun 函数的结果（需要注意的是， counterSlice.actions 你需要区分开 reducer，Toolkit是对reducer对象进行了封装，最后才获取的 actions


可以发现其实 useSelector 的函数就相当于 Vuex的getter函数，因此，可以将复炸逻辑的useSelector的参数封装

```javascript
// 在createSlice生成 reducer 文件中 
export const selectCount = state => state.counter.value;

//在组件中
import { selectCount } ...
const count = useSelect(selectCount)
```