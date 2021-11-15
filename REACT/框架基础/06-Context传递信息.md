# Context
> 解决祖父和孙子等跨多级的props的传递过于冗余，本质上就是发布订阅

当页面结构过于复杂，我们可能将结构拆分的越来越多级，但是这个时候，多级组件之间相互依赖关系，因此又发生状态提升，这就导致一个尴尬的局面：  **多级子组件，孙子组件依赖于顶层组件**

Context是一个很好的解决办法：
- 它不仅将数据传递简化，而且还能够传递更新数据的方法，以达到跨级的发布订阅，触发函数更新context，是一个小型的状态管理

- 相对于Redux、MobX等等状态管理库，它最贴合原始React，性能最优（毕竟开销小）

- react-devtools 能够监察到context组件的行为，便于调试

## 怎么用 发布订阅模式
谁发布？顶级组件发布
```javascript
//  usernameContext.js 文件 创建一个 usernameContext 
import React from 'react';

const usernameContext = React.createContext();//  这里可以省略
usernameContext.displayName = 'usernameContext';
export default usernameContext;

// app.js
import { Provider } from './usernameContext' // React.createContext() 提供 两个对象 Provider、Consumer
<Provider value="shepijcanwu">
  <h1>
    <SetState /> <!-- SetState需要使用context -->
  </h1>
</Provider>
```
SetState组件需要使用，就是需要订阅。那组件如何订阅：
```javascript
//  SetState.js
export default class SetState extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
    };
    console.log(this.context); //这个时候是访问不到的
  }

  render() {
    console.log(this.context);
    return (
      <div className="setS">
        <span />
        <Consumer>
          {(context) => (`this context value is：${context}`)}
        </Consumer>
      </div>
    );
  }
}

SetState.contextType = usernameContext;
```

两种订阅方式：
- static contextType = usernameContext 指定class组件的静态属性contextType，那么在组件的**contructor生命周期之后都能访问到this.context**（这里需要注意：什么地方能访问\阶段context，静态属性只有class组件才有，因此该方式对函数组件无效）
- Consumer组件消费，render props原理，在consumer组件写内嵌表达式返回一个函数作为children属性的props传递（**这种适用于函数组件**，但是写法上不好看）

## Context需要注意的细节
- 创建context对象的时候，可以省略defaultContext的值，即直接的
    ```javascript
    const usernameContext = React.createContext()// 不传入参数
    ```

- Provider 发布者组件的value不能为空，而且可以动态绑定！（这意味这context是可以动态的，这也是什么说可以进行状态管理）
    ```javascript
    <Provider value={this.state.username}>
      {...Components}
    </Provider>
    ```


- Context可以解决多兄弟对同一状态的依赖问题：一个发布者发布，多个订阅者订阅；发布者更新，触发所以发布者更新，下面编写一个简单的登入状态管理

    ```javascript
    //  login.context.js
    import React from 'react';

    const LoginContext = React.createContext();
    LoginContext.displayName = 'LoginContext';

    export default LoginContext;

    //  Login组件
    export default function Login() {
      return (
        <Consumer>
          {({ login, toLogin, outLogin }) => (
            <div className="login">
              当前Login组件中的 login 状态：
              <span style={{ color: 'red' }}>{login}</span>
              <button type="button" onClick={toLogin}>点击登入</button>
              <button type="button" onClick={outLogin}>点击推出登入</button>
            </div>
          )}
        </Consumer>
      );
    }

    //  Index管理组件
    export default class Index extends PureComponent {
      constructor(props) {
        super(props);
        this.state = {
          login: 'login',
          outLogin: this.outLogin.bind(this),
          toLogin: this.toLogin.bind(this),
        };
      }

      outLogin() {
        this.setState({
          login: 'outLogin',
        });
      }

      toLogin() {
        this.setState({
          login: 'login',
        });
      }

      render() {
        return (
          <Provider value={{
            login: this.state.login,
            outLogin: this.state.outLogin,
            toLogin: this.state.toLogin,
          }}
          >
            <div className="index-page">
              <div className="index-context">
                在Index组件里，login登入状态为：
                <span style={{ color: 'red' }}>{this.state.login}</span>
                下面一行是login登入组件：
              </div>
              <Login />
            </div>
          </Provider>
        );
      }
    }
    ```

## useContext 
Hooks是得代码写起来更加简洁：
```javascript
// useContext 主要是在订阅context的时候十分方便，在发布和注入Provider的时候还是一样的流程
const value = useContext(usernameContext) // 直接在函数组件内使用非常方便
```

