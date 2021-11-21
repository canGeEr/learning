# 04-完全开发JSX的能力

## 条件判断
- &&  与运算 和 || 或运算
- ?: 三目运算符
- if else 判断渲染
- 动态组件名

## 事件处理
- class的监听函数，babel自动处理绑定this为当前实例
- 构造函数 this.onClick = this.onClick.bind(this)
- JSX表达式 {() => this.onClick()} 或者 {this.onClick.bind(this)}

## 受控组件
> React实现的双向数据绑定
```javascript
import React from 'react';
export default class StateInput extends React.PureComponent {
  state = {
    username: 'zix',
    email: '2020974511@qq.com'
  }
  vmodel = ({target}) => {
    console.log(target)
    const {title, value} = target
    this.setState({
      [title]: value
    })
  }
  render() {
    return (
      <div>
        <input type="text" title="username" value={this.state.username} onChange={this.vmodel} />
        <input type="text" title="email" value={this.state.email} onChange={this.vmodel} />
        <p>{`
          username: ${this.state.username} \n
          email: ${this.state.email}
        ` }</p>
      </div>
    );
  }
}
```
通过在表单控件上，添加title方便更新时，更新对应的数据

聊聊真是的双向绑定功能流程：
- React扫描JSX时，发现表单元素被value属性修饰，确定该表单元素为“受控元素”
- 为"受控组件"自动的绑定input系列事件，监听input的变化，如果触发input则重新渲染一次包含"受控元素"的组件
- 因此，如果没有绑定onChange回调事件的元素，数据模型没有改变，即使手动输入了字符，触发内置绑定的input，重新渲染相同的组件，没有任何变化
- 这样的结果就是，虽然键入了数值，但是看起来页面没有任何反应

## 循环能力
数据
```json
{
  "list": [
    {
      "id": "1",
      "title": "蛇皮鸡的第一天"
    },
    {
      "id": "2",
      "title": "蛇皮鸡的第二天"
    },
    {
      "id": "3",
      "title": "蛇皮鸡的第三天"
    },
    {
      "id": "4",
      "title": "蛇皮鸡的第四天"
    }
  ]
}
```
代码
```javascript
import React from 'react';
import data from './list.json'

const { PureComponent }  = React;
const { list } = data
export default function List(props) {
  return (
    <div className="list">
      { list.map(function(item) {
        return <li key={ item.id }>{ item.title }</li>
      }) }
    </div>
  )
}
```


## 组合Slot插槽
- slot组合（JSX元素的props可以传递组件或者JSX元素）
- 特例关系


**solt插槽组合 包含关系**
```javascript
//index.js文件
const components = importAll(require.context('./components', false, /\.jsx$/));

Object.keys(components).forEach((key) => {
  const Component = components[key].default;
  components[key] = <Component  />;
});

ReactDOM.render(
  <h1>
    <Layout {...components} />
  </h1>,
  document.getElementById('root'),
);

//importAll函数代码
export default function importAll(context) {
  //  需要注意的是context的context(key)任然是一个模块，并不是普通的import的值，可以尝试打印查看
  const map = {};
  context.keys().forEach((key) => {
    let match = key.match(/\/(\w+).jsx$/);
    if (match) {
      match = match[1];
      map[match[0].toLowerCase() + match.slice(1)] = context(key);
    }
  });
  return map;
}

//Layout组件
export default function Layout(props) {
  return (
    <div className="layout">
      {props.top}
      {props.left}
      {props.right}
      {props.bottom}
    </div>
  );
}
```

**特定props 特例关系**
```javascript
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />
  );
}
```