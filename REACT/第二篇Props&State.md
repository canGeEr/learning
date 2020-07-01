# props & state (属性和状态)
> 警告
1. 用户定义的组件必须以大写字母开头
2. 所有组件都需要大写表示为react的组件
3. 所有 React 组件都必须像纯函数一样保护它们的 props 不被更改。
4. 数据向下流动，且props来源未知
## 组件

### 函数
```javascript
function Component(props) {
  return (
    <div></div>
  )
} 
```

### 类组件
```javascript
//Class 组件应该始终使用 props 参数来调用父类的构造函数
class Component extends React.Component {
  //不一定需要constructor
  constructor(props) {
    super(props)
    //没有super无法使用this
    this.state = {

    }
  }
  render() {
  }
}
```

## props

### 只读性
数据的单向流动, 想要改变props，就必须和props的来源进行通信，必须保证，操作改变props的值的对象是"源"

### 传递性

props 可以传递任何js可识别的数据，包括方法和组件（相当于vue的slot）

> props其实就是参数，只是这个参数在一些时候进行了适当的封装和扩展，较为明显的就是Class组件的扩展，但又进行了一些特定字段的过滤(key, )等



## State
1. 只要setState就要更新，更新是对比原来的虚拟DOM，选择性的更新UI界面(显得更加的可控的)
2. State 的更新可能是异步的
```javascript
//以下情况会不会出现预期结果
this.setState({
  name: 'wucan'
})
this.setState({
  name: this.state.name + '-zix'
})
```
3. State 的更新会被合并
> 但是合并只是浅合并,简而言之就是合并第一层
```javascript
state = {
  number: 1,
  string: 2,
  obj: {
    sex: "男",
    age: 29
  }
}
//如果
this.setState({
  obj: {
    age: 28
  }
})

//那么新的state , 注意obj 的变化
state = {
    number: 1,
  string: 2,
  obj: {
    age: 28
  }
}

```


## 更新合并怎么样依据旧数据更新

先看下面一个例子
```javascript
state = {
  counter: 0
}

this.setState({
  counter: 1,
});

// Wrong
this.setState({
  counter: this.state.counter + 2 ,
});
```

以上代码极有可能不按照你的想法更新:
1. 首先执行第一个setState,但是执行完成counter并未改变，
**合并更新** => **异步更新**
2. 在执行第二个setState this.state.counter === 0
3. 最后state.counter === 2;第一次更新被吞并


如何解决上述问题: 传入函数，等待回调
```javascript 
// Correct 
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```