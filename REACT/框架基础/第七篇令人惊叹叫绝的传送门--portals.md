# 第七篇令人惊叹叫绝的设计


## portals (传送门)

### 为什么要portals
大多数情况下，在一个组件中，所有的元素只能渲染在该组件下，对于意外的，突发的需求无法满足，比如loading组件，弹窗组件要跳出父组件甚至是祖父组件

### portail 能干什么
Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。
```javascript
//container 容器 child要传送渲染的组件
ReactDOM.createPortal(child, container)
//注意确保 container 要存在 (指的是内存上存在，不一定要渲染出来)
```

### 有趣的portail
对于portail仍然是逻辑上的父子组件(事件，props)，但是只是渲染的时候渲染在其它地方


## Render props => Cross-Cutting Concerns 横切关注点

### 为什么要Render props
使用 Props 而非 render。重要的是要记住，render prop 是因为模式才被称为 render prop ，你不一定要用名为 render 的 prop 来使用这种模式。事实上， 任何被用于告知组件需要渲染什么内容的函数 prop 在技术上都可以被称为 “render prop”.
在组合里其实有说过，类似于solts的模板组合问题，但是在组合里的slot补充的插槽的模板数据来自于当前使用组合的模块，而Render props是将函数（模块渲染函数，接受数据做props传入模块）传入对于数据再渲染

> 简而言之 传统的JSX组合是在顶层模块获取数据，再插入插槽以便渲染，而render props 传入函数的props(返回模块)，在底层模块获取数据，最终渲染

### Render props 能干什么
一种在 React 组件之间使用一个值为函数的 prop 共享代码的简单技术