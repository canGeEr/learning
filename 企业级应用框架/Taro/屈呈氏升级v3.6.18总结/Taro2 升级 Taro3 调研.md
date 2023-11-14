## 资源

- [多端统一开发框架 Taro 优秀学习资源汇总](https://github.com/NervJS/awesome-taro)
- [官网版本说明](https://docs.taro.zone/docs/version)
- [Taro 版本升级权威指南](https://docs.taro.zone/blog/2020-09-01-taro-versions/)

## 官网

- **Taro 不再绑定 DSL**

  - 第一：除了 Taro 本身支持的特性从 **@tarojs/taro** 引入，其它 React 相关的东西引入需要从 React 引入（也可以使用 Nerv，但是对 React 生态的库可能存在兼容问题）

  ```javascript
  // npm install react -S
  import React, { Component } from "react";

  // Taro 专有 Hooks
  import { usePageScroll, useReachBottom } from "@tarojs/taro";
  // 框架 Hooks （基础 Hooks）
  import { useState, useEffect } from "react";
  ```

  - 第二：同样的，React 的生态的库可以直接使用，官方不再维护 taro-redux 、taro-mobx

  ```javascript
  import { useSelector } from "react-redux";
  ```

  - 第三：Taro 需要对不同的 DSL 使用不同的编译配置，因此需要添加 framework

  ```javascript
  // 如果是使用React那么需要配置 framework: react,（react, nerv, vue, vue3）
  // jsxAttributeNameReplace 配置被移除
  ```

  - 第四：使用 React **(Nerv 不受影响)**，受到 React 的升级影响，一些生命周期名称被改变；Ref 和 DOM 的使用也会改变，React 不支持字符串 Ref，只能使用 createRef；ref 获取的 DOM 是 Taro element，需要获取真实的小程序 DOM 使用 SelectorQuery，比如获取节点的真实

  ```javascript
  //生命周期
  // componentWillMount() -> UNSAFE_componentWillMount()
  // componentWillReceiveProps -> UNSAFE_componentWillReceiveProps()
  // componentWillUpdate -> UNSAFE_componentWillUpdate()
  ```

- Taro 不再识别页面组件/项目组件的 Config 属性，需要单独为项目/页面新增\*.config.js，然后导出

  ```javascript
  // 项目/页面.config.js
  export default {
    navigationBarTitleText: title,
  };
  ```

- Taro 某些挂载在对象的实例（路由 \$router、\$scope、\$componentType）不再能被 this 获取到，而需要通过 getCurrentInstance() 获取对应的实例

- Taro2 升级 Taro3 升级本身会带来一些依赖的升级，babel 升级到 babel7，babel 的配置需要提取到 babel.config.js

- Taro 自带的页面样式隔离失效，需要自己手动启动 CSS Modules，不过改造麻烦 js 需要使用 style[classname]，可以考虑 babel-plugin-react-css-modules 自动转换

总结，React 因为不绑定 DSL，如果我们选择从 Taro2 => Taro3 升级而不是重构，那基本只能选择 React 或者 Nerv 两个 Framework，其中

- Nerv 是京东旧的 DSL 重构，因此对一些旧的语法比较好兼容，比如 ref；体积比 React 小，性能相对更优
- React 对 React 的生态支持的更好，改动相对 Nerv 多一点点

具体使用那个，要看真实项目中使用 React 生态工具、Ref 等等确定

## Taro 版本升级权威指南

比较详细的介绍，这里只展示对官网的补充

- **如何获取页面节点信息**：由于 Taro 3 设计机制的原因，需要在新增的 onReady 生命周期内才能调用 Taro API 正确获取页面节点信息，小程序和 H5 都是如此

- **Taro UI 是不是不支持 Taro3 了**：npm add taro-ui@next

## [taro2-to-3](https://github.com/SyMind/taro2-to-3)

- 自动更新编译配置（包括 babel）
- 根据 app.js 配置更新所以页面代码
  - taro-imports（解决 React 引入和 @tarojs/taro 引入问题）
  - page-config 自动提取出来，生成 xxx.config.js
  - \$router 访问替换，但是 \$scope、$componentType 不会转换
- 更新 package.json 的 Taro 依赖

能做的事情有限，但是也能解决大部分问题了

## demo 升级样例

> [多端统一开发框架 Taro 优秀学习资源汇总](https://github.com/NervJS/awesome-taro)

找到**taro-2**相关项目，git clone 到本地，发现分支上已经存在升级代码记录，观察升级改动文件，和之前总结的吻合，尝试 git reset 到升级分支之前，再次使用 taro2-to-3，确实能减少大量手动更新工作

## 升级计划

采用 React 框架，先用 taro2-to-3 升级依赖，和转换大部分代码，接下来手动解决

好解决

- CSS Module 问题（如果存在，添加 Babel 配置）
- React 生态相关的依赖更新（查看依赖就可）
- \$scope、\$componentType 问题（一般使用的少，全局检索）

相对好解决：

- 过时生命周期替换

- 旧版的 React Class 组件允许使用 Hooks（React 会报错）

- Ref 和 DOM 访问（检索 ref="，获取元素实时的位置信息 boundingClientRect, scrollOffset）
- 只有 onReady 才能获取页面节点信息
- preloadData API 发生变化（Taro 3.2.x 以上版本）

- 一些内置组件的属性更新（参考 [taro-components-sample](https://github.com/NervJS/taro-components-sample) 的升级历史记录）

难解决：

- 如果使用了 Taro UI，有升级方案，但是比较难判断影响范围，比较难测试