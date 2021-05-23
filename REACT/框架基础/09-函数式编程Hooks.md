# 09-函数式编程 Hooks

## Hooks 如何拥有状态

调用 Hooks 函数 useState，返回一个数组，第一个值为状态值，第二个为更新状态的函数。

```javascript
const [value, setValue] = useState(initValue);
```

那我们对标 class 组件

- 如何检测组件是否更新：

  - class 组件中，当 setState 方法调用的时候或者 props 更新，触发组件更新，重新执行 render 函数，触发 update 生命周期
  - Hooks 中，调用对应的 setValue 这类更新状态的方法或者 props 更新，触发该 React 组件（函数）重新执行

- 重新执行如何获取之前的状态：
  - class 组件保存在实例上，实例在组件更新期间是不会“挂”的
  - [Hooks 如何追踪 state](https://react.docschina.org/docs/hooks-rules.html#explanation)

## Hooks 如何追踪状态

> setXXX 传入的参数如果和上次相同，那么不会触发 React 组件的重新渲染

Hooks 的 React 组件是函数，无法通过实例保存状态，那么需要外部的变量去保存。

- 比如第一次执行函数之前生成一个 FunHooksArr = []数组，每次调用 Hooks 方法，将结果直接保存至数组中，初始化数组（其实这里就是保存状态，**这不过这些状态存在的先后顺序，因此 Hooks 的调用存在规则**）
- 在之后，如果内如产生更新（比如：set 更新方法和 props 更新）组件函数重新执行，这个时候就会判断是否存在 FunHooksArr，如果存在那么说明第一次已经初始化过了 state，当前的更新就对标于（componentDidUpdate 阶段），**重新执行函数**
- 遇到 Hooks 函数，就把 FunHooksArr 的值弹出，而不是再次初始化（这里也说明，Hooks 的顺序很重要，因此不能在条件中调用 Hooks，不然的话会产生 Hooks 乱序）

- 处理完函数的逻辑，渲染页面，这个时候触发回调函数（useEffect 传入的）

- 在执行 useEffect 后，将返回的函数也进行保存，在下一次函数再次执行之前，执行返回的函数！

> 总结：为了追踪状态，不要在条件（循环也是条件）中使用 Hooks、嵌套函数内调用 Hooks

## useEffect 的细节

- useEffect 相当于 mounted（useEffect 传入是回调函数）、update、unMounted 。分别对应

  - 第一次执行回调函数，保存返回的**清除函数**
  - 启动更新，重新执行组件函数之前，执行清除函数，再次执行等待该次的回调函数执行
  - 组件卸载时，将保存的清楚函数执行！

- useEffect 如何实现：
  - state 依赖 props （getDerivedStateFromProps的功能）
  - 优化新能，减少回调函数的执行（shouldComponentUpdate的作用）
  - 更新渲染完成之前记录DOM的位置，即getSnapshotBeforeUpdate （useLayoutEffect 可以做到）
    
这两个功能都依赖于useEffect的第二个参数，第二个参数是一个数组，我们称其为**浅对比优化数组**，当然它有一个默认值：null。   
原理：

- 当第一执行完成函数之后，保存**浅对比优化数组**
- 第二次执行前 useEffect 的回调函数之前，对比此次传入的新的**浅对比优化数组**（调用组件函数自动的形成和传入），将新旧数组对比（浅对比），如果没有变化，就不执行 useEffect 的回调函数！
- 发生变化后，将新的**浅对比优化数组**再次保存，一直这样下去。

因此，当传入空的数组：

```javascript
useEffect(() => {
  console.log("只有一次效果，第一次执行函数时打印");
}, []);
```

## 自定义 Hooks

- 当我们在一个自定义 Hooks 中或者在 React 中（假设叫 TopFun|TopCom）使用其它的自定义 Hooks（ChildHooks），那么这个时候，React 自动做出绑定，即上层函数或者组件函数 **依赖于** ChildHooks，形成依赖关系。
- 即当 ChildHooks 触发自己的状态更新的时候，自动的重新执上层函数或者组件函数
- 由于上层函数本身包含 ChildHooks 的调用，这样就自然的没有破坏 Hooks 的规则

> 前面说过，不要使用**嵌套函数**在React中，意思是，不要在useEffect等内置的Hooks函数，传入调用其它Hooks的函数

```javascript
const Index = () => {
  const [value, setValue] = useState("就这？");
  function updateValue() {
    setValue(value);
  }
  console.log("update");
  function handleChange(e) {
    setValue(e.target.value);
  }

  // 自定义的hooks，在React组件调用的函数如果包含hooks代码，必须use开头才能追踪，并建立依赖关系
  const useFuck = (initialState) => {
    console.log("自定义hooks调用");
    const [state, setstate] = useState(initialState);
    useEffect(() => {
      setTimeout(() => {
        setstate(state + 1);
      }, 1000);
    });
    return state;
  };

  console.log(`fuck hooks 里使用的${useFuck()}`);

  return (
    <div className="hook-index">
      <Test value={value} handleChange={handleChange} />
      <button id="button" type="button" onClick={updateValue}>
        点击更新
      </button>
    </div>
  );
};
```

## Hooks的其它API

- useCallback 是能够缓存函数的（返回第一次记忆的函数对象），用于性能优化

    ```javascript
    const oldFun = useCallback(() => {
      console.log('这个方法并没有传入新的值绑定');
    }, []);

    return (
      <MyCom value={oldFun} /> //该组件的 oldFun 一直不变，降低了每次绑定新的回调函数的开销
    )
    ```
- useMemo 返回一个记忆值，和useCallback区别在于返回的是什么，作用基本相同（比如创建的一个对象，如果每次组件函数更新，对象都重新创建再传给子组件的props，再次有触发子组件的更新）

- useRef 也是会缓存 ref，在react函数中尽量的使用use，因为能有缓存效果

> useMemo、 useCallback 和 React.memo搭配使用都是可以的
