# 07-render props
> render props是一种技巧

## 原理
render props说的高大上，单其实你仔细观察就会发现，它其实就是和事件绑定一样，父组件传递一个函数过去，由子组件决定什么时候调用回调函数！


在组件通信中，回调函数本身就可以相互通信，因此render props你可以简单的认为，render props的传递就是一个函数的传递，只不过在子组件内部调用该函数的时候传入了非event的实参而是你需要的数据（这个数据在子组件内部已经封装完成）


为了更加清晰的说明上面这段话：
```javascript
//分开写的优势在于 Son组件可以是PureComponent，因为传入Son的render没变化
function renderRenderComponent(user) {
  return (
    <RenderComponent user={user} />
  );
}

//父组件
const Father = () => (
  <div>
    <Son render={renderRenderComponent} />
  </div>
);

//子组件 提供服用功能，为其他组件
const Son = (props) => (
  <div>
    {props.render({
      name: 'shepijcanwu',
      sex: 'male',
    })}
  </div>
);

//经常变化的组件
const RenderComponent = (props) => {
  const { user } = props;
  return (
    <div>
      {user.name}
      {user.sex}
    </div>
  );
};
```

## render props和HOC结合
```javascript
function withRender(Component) {
  return class extends React.Component {
    render() {
      return (
        <Son render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
```
