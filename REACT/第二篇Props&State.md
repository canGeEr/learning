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
**只读性**

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