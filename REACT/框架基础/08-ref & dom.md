# 为什么需要refs
> Refs 提供了一种方式，允许我们访问 DOM 节点或在 render 方法中创建的 React 元素

说人话，就是Refs直接操作DOM，在React写逻辑只是数据和元素的关联，更新元素必须对应数据的变化，如果需要直接的操作DOM元素，我们只能通过Refs间接获取（当然，你可以直接的getElement...式的API，但是这不符合React的思想）

## 何时使用 Refs
- 管理焦点，文本选择或媒体播放。
- 触发强制动画。
- 集成第三方 DOM 库

## 简单的例子
```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }

  //完成挂载的生命周期
  componentDidMount() {
      const element = this.myRef.current//访问到
  }
}
```

## refs存在问题
上面的ref只是能用在**Class组件**和**原生的元素**。对于current属性，Class组件上获取的是组件实例，原生元素获取的是直接的DOM对象

> 无法对函数组件进行DOM获取

## 回调refs
> 这里其实就是告诉你为什么ref可以这么用，文档上说这样控制更精细
```javascript
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} /> 
      <!-- 自动的把DOM作为函数的参数，调用回调函数 -->
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

## refs的缺陷
解决几个问题
- refs无法对函数组件处理
    ```javascript
    <FunCOmponent ref={ref} /> // 报错
    ``` 
- refs使用在组件上，只能获取组件的实例

这些问题的关键点，在于ref属性，是react内部处理过了，因此只要我们在传递的时候，使用其它属性名传递ref值
- 其它属性给函数组件作prop不像ref，不会报错
- 其它属性给类组件做prop不像ref，不会直接获取组件实例

刚好解决了问题，示例：
```javascript
import React from 'react';

const index = () => {
  const ref = React.createRef();
  console.log('触发更新', ref.current, ref);
  return (
    <div>
      <TestCom realRef={ref} />
    </div>
  );
};

const TestCom = ({ realRef }) => (
  <div className="test-com" ref={realRef}>
    这是test-com元素
  </div>
);

export default index;
```


依据这一点，我们可以自己使用其它属性来在中间传递ref，最终获取对应的元素DOM。**但是需要注意：** 这种代码开起来相当难以维护，不适合复杂、大型项目






## 官方解决方案 forwardRef
> 核心词：React.forwardRef、forwardedRef={ref}

解决第一点：
```javascript
//index.js
//原来的FancyButton组件
function FancyButton(props) {
    return (
    <button ref={ref} className="FancyButton">
        {props.children}
    </button>
    )
}

//index.js
//改后FancyButton组件
const FancyButton = React.forwardRef((props, ref) => (
    <button ref={ref} className="FancyButton">
        {props.children}
    </button>
));

// 你可以直接获取 DOM button 的 ref：
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

解决第二点（通常的叫高阶组件的透传）：
```javascript
//第一个页面：高阶组件
function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      const {forwardedRef, ...rest} = this.props;

      // 将自定义的 prop 属性 “forwardedRef” 定义为 ref
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // 注意 React.forwardRef 回调的第二个参数 “ref”。
  // 我们可以将其作为常规 prop 属性传递给 LogProps，例如 “forwardedRef”
  // 然后它就可以被挂载到被 LogProps 包裹的子组件上。
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}


//第二个页面：
class FancyButton extends React.Component {
  focus() {
    // ...
  }

  // ...
}

// 我们导出 LogProps，而不是 FancyButton。
// 虽然它也会渲染一个 FancyButton。
export default logProps(FancyButton);


//第三个页面
const ref = React.createRef();

<FancyButton
  label="Click Me"
  handleClick={handleClick}
  ref={ref}
/>;
```