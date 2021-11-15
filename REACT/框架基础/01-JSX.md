# 01-JSX

## 什么是JSX
它是一个 JavaScript 的语法扩展。我们建议在 React 中配合使用 JSX，JSX 可以很好地描述 UI 应该呈现出它应有交互的本质形式。JSX 可能会使人联想到模版语言，但它具有 JavaScript 的全部功能。

## 为什么需要JSX
React也是虚拟DOM（Virtual DOM），因此需要创建虚拟节点，在通过内部实现进行挂在到真正的DOM元素上
```javascript
import React from 'react'
import ReactDOM from 'react-dom'
const virtualNodeH1Type = 'h1'
const virtualNodeH1Props = {className: 'title'}
const virtualNodeH1Children = '这是通过createElement创建的虚拟节点' //文本节点
const virtualNodeH1 = React.createElement(virtualNodeH1Type, virtualNodeH1Props, virtualNodeH1Children)

//创建完节点需要渲染
ReactDOM.render(virtualNodeH1, document.getElementById('root'))
```

写完上面代码发现创建一个简单的h1代码都这么复杂，有没有什么简单的方法吗？    
JSX可以非常简单的做到
```javascript
const virtualNodeH1 = <h1 className='title'>这是通过createElement创建的虚拟节点</h1>

ReactDOM.render(virtualNodeH1, document.getElementById('root'))
```

## JSX的原理
每个 JSX 元素只是调用 React.createElement(component, props, ...children) 的语法糖。因此，使用 JSX 可以完成的任何事情都可以通过纯 JavaScript 完成。

- JSX元素的标签名对应着第一个参数：创建元素的标签，当然也可以是组件
- JSX 元素的属性节点会被处理成key-value的形式组成对象props作为第二个参数
- JSX的子元素被处理成children递归的创建，作为三个参数

> 因此JSX表达式（JSX元素）返回的值就是一个虚拟节点对象（你可以尝试打印出来）

## 内嵌表达式增强JSX
JSX从上面来看已经非常强大了，但是对于一些问题还是不够，比如属性需要使用变量来渲染，JSX元素内容需要变量来渲染，动态渲染元素等等      

**这个时候需要JSX内嵌表达式 => {JS表达式} 返回JS表达式执行之后的结果**

比如，最简单的一个例子
```javascript
const h1InnerHTML = 'JSX表达式'
//class会又冲突，于是JSX直接使用className代替了class，在渲染的实话className 等效于 class字段
const virtualNodeH1 = <h1 className='title'>{h1InnerHTML}</h1>

const logoStyle = {
  display: 'inline-block'
  width: '100px',
  height: '200px'
  backgroundImage: 'url(....)' //注意小驼峰命名
}
const virtualNodeSpan = <span className='logo' style={logoStyle}></span>
```

JSX的内嵌表达式也不是一定就需要写纯粹的变量：
```javascript
const virtualNodeSpan = <span className='logo' style={{
  display: 'inline-block'
  width: '100px',
  height: '200px'
  backgroundImage: 'url(....)'
}}></span>
```

值得注意的是，内嵌表达式也可以解析JSX元素！

```javascript
const spanElement = <span>一个span元素</span> // spanElement 已经被转换为React元素了
const cardElement = (
  <div className="card">
    {spanElement} 
    {/* 这样也可以渲染JSX元素 （这是JSX的注释） */}
  </div>
)
```


## JSX动态组件
> 组件这个概念，如果学习其他框架就好理解。单独的抽离出的 UI + 功能

React的组件的特殊之处在于：
1. 纯函数，无副作用的组件叫做无状态组件（有些人叫函数组件，但是hooks的出现打破这一说法，函数组件也可以有状态）（类比Vue的函数式组件，这类组件开销小）【注意，纯函数和PureComponent的概念要区分，后者只是组件进行生命周期**shouldComponentUpdate**定制做的优化罢了】

2. class组件面向对象（类比Vue的单文件组件）

3. React的组件解析是，提前JSX组件元素的标签名，把标签名进行JS解析，去找到当前JSX文件能够访问的变量，将变量的值进行解析
    ```javascript
    function UserCard(props) {
      return (
        <div>
          <h1>{props.username}</h1>
          <span>{props.introduce}</span>
        </div>
      )
    }

    React.DOM.render(
      <UserCard></UserCard>, //<UserCard /> 也行
      document.getElementById('root')
    )
    //<UserCard></UserCard>, 元素编译的时候，babel自动的找到变量UserCard对应的值（函数对象），解析为虚拟节点对象，这是为什么不需要声明或者做额外的工作就能直接的作为组件使用
    ```
4. 由于组件本质是变量的查询，因此React组件可以使用访问符来做动态组件

    ```javascript
    const components = {
      top: Top, //Top组件
      bottom: Bottom //Bottom组件
    }
    <components.top /> //只要prototypeName属性的值变化了，那么这个组件就变了
    ```
    查询到底的变量一定要是一个函数或者class类（它本身其实也是函数）

## JSX需要注意的几个地方

1. 因为 JSX 语法上更接近 JavaScript 而不是 HTML，所以 React DOM 使用 camelCase（小驼峰命名）来定义属性的名称，而不使用 HTML 属性名称的命名约定。例如，JSX 里的 class 变成了 className，而 tabindex 则变为 tabIndex

2. JSX是严格的HTML写法，接近XHTML，所以一些标签写法没有容错！比如在HTML写input标签可以
    ```html
    //  html
    <input type="input">

    //  JSX 注意标签的闭合，注意单标签元素br、hr、img、meta、link、input
    <input type="input" /> 
    ```

3. JSX在写组件元素时，组件元素的变量名一定要大写开头

## Component有时无法直接套上内嵌表达式
这里的List和Layout都是一个组件：
```javascript
<Layout {...props}>
  <h2>dadsa</h2>
  {List} //注意，这里很危险，它直接将List组件函数传入
</Layout>
```
List被解析成功，因为它是一个函数对象（即使它是class类，那也是函数对象）。因此在Layout组件内的props对象，存在属性children是一个数组，表示有两个子元素，一个子元素是h1，另外一个是一个**类函数**！

你甚至可以在Layout组件里面这样去写，渲染List组件
```javascript
function Layout(props) {
  console.log(List);
  const List = props.children[1];
  return (
    <div className="layout">
      这是一个List组件
      <List />
    </div>
  );
}
```

但是，注意，如果将Layout组件内部代码改成如下：
```javascript
return (
  <div className="layout">
    这是一个List组件
    {List}
  </div>
);
```
使用内嵌表达式渲染组件，报错：
```bush
Warning: Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.
```
为什么？


因为是一个内置元素包裹着 {List} ！对于div（内置元素）它已经是最终的渲染的最小单位了，它不接受props.children属性更没有下层组件传递props，List又是一个函数无法直接转换为DOM渲染，这样无法解析！

## 组件到DOM的转换
组件是一个函数，但是组件一般都返回元素，或者JSX元素，当使用一个JSX组件写法时，
```javascript
<Component />
```
其实相当于调用了组件这个函数（或者类函数），这个JSX表达式自然的就会返回元素对象（VNode）！和
```javascript
<h1 />
```
打印形态时一样的。

注意通过解析VDOMTree，渲染出整个DOM，最终插入页面展示