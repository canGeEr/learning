# JSX

## 什么是JSX
它是一个 JavaScript 的语法扩展。我们建议在 React 中配合使用 JSX，JSX 可以很好地描述 UI 应该呈现出它应有交互的本质形式。JSX 可能会使人联想到模版语言，但它具有 JavaScript 的全部功能。

## JSX转换
1. 使用 JSX 编写的代码将会被转换成使用 React.createElement() 的形式。如果使用了 JSX 方式，那么一般来说就不需要直接调用 React.createElement()。  
2. 每个 JSX 元素只是调用 React.createElement(component, props, ...children) 的语法糖。因此，使用 JSX 可以完成的任何事情都可以通过纯 JavaScript 完成。
```javascript


React.createElement(
  type,
  [props],
  [...children]
)

/*创建并返回指定类型的新 React 元素。
其中的类型参数既可以是标签名字符串（如 'div' 或 'span'），
也可以是 React 组件 类型 （class 组件或函数组件），
或是 React fragment 类型*/

ReactDOM.render(element, container[, callback])
//渲染函数
```

## 语法

### 标签
```javascript
//jsx作为一种类似于字符一样使用
//{} 用于解析 何有效的JavaScript表达式 
const element = <h1>Hello, {name}</h1>;

//使用在html的属性上
const element = <div tabIndex="0"></div>;
const element = <img src={user.avatarUrl}></img>;

//如果没有子节点，你还可以使用自闭合的标签形式，如 <div className="sidebar"/>

//JSX 标签的第一部分指定了 React 元素的类型。 (也会用于diff协调算法的元素类型的对比)

/*
你不能将通用表达式作为 React 元素类型。如果你想通过通用表达式来（动态）决定元素类型，
你需要首先将它赋值给大写字母开头的变量。这通常用于根据 prop 来渲染不同组件的情况下:
<components[props.storyType] story={props.story} />
*/


// 布尔类型、Null 以及 Undefined 将会忽略
```
> 警告

因为 JSX 语法上更接近 JavaScript 而不是 HTML，所以 React DOM 使用 camelCase（小驼峰命名）来定义属性的名称，而不使用 HTML 属性名称的命名约定。  
例如，JSX 里的 class 变成了 className，而 tabindex 则变为 tabIndex。

### 如何完成语句渲染

#### if
```javascript
let showReact
if(/* 条件 */) {
  showReact = <h1>h1</h1>
} else {
  showReact = <p>p</p>
}
```

#### 循环

```javascript
const arr = [1,2,3,4,5]
(
  <div>
    {arr.map((item)=>{
      return <div :key="item" >{item}</div>
    })}
  </div>
)
```


## 对于js说什么是jsx
在js中，jsx是一种新的数据类型，它区别于普通的函数，对象，基本数据，
又自己的一套运算方式 => {JSX  / JSX_ARRAY}
jsx不能进行 加减运算 ，要注意的不能像拼接字符串一样

```javascript
//注意
<App /> 渲染成JSX 它现在属于JSX数据
```