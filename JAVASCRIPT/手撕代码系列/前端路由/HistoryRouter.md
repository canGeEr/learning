# HistoryRouter

## 什么是 history

window.history 就是所谓的 history，它上面包含触发 popState 事件各种方法：go、forward、back，并且还有操作历史堆栈、更改 URL 的的方法：pushState、replaceState、获取当前状态的方法 history.state

## 基本流程

- 实现的核心 window 监听 popState
- 维护一个路由对象，hash 值路径对应的回调函数
- 页面所有的路由跳转链接由 JS 维护，调用 pushState 或者 replaceState，更改路径不触发重刷，并且传入 path 对应的 state
- 它能通过 forward、go、back 触发浏览器（触发 window 的 popstate 事件）返回行为，从而不需要自己维护历史堆栈 history，解决 hash 自定义堆栈 history 和浏览器堆栈不协调问题

```javascript
class HistoryRouter {
  routes = null;
  history = window.history;
  constructor() {
    this.routes = {};
    window.addEventListener("load", () => {
      this.push(this.getPathUrl());
    });
    window.addEventListener("popstate", this.popListener.bind(this), false);
    window.addEventListener("click", this.proxyLink.bind(this), true);
  }
  addRoute(path, callback = function () {}) {
    this.routes[path] = callback;
  }

  push(path, payload) {
    this.history.pushState({ path, ...payload }, null, path);
    this.routes[path]?.();
  }

  getPathUrl() {
    return window.location.pathname;
  }

  go() {
    this.history.forward();
  }

  back() {
    this.history.back();
  }

  // 对link事件进行劫持
  proxyLink(event) {
    event.preventDefault();
    const eventPath = event.path;
    eventPath.find((item) => {
      if (item.nodeType === 1 && item.tagName.toLowerCase() === "a") {
        this.push(item.getAttribute("href"));
      }
    });
  }

  popListener(event) {
    const { state } = event;
    if (state) {
      console.log(event.state, this.routes);
      const { path } = event.state;
      this.routes[path]?.();
    }
  }
}
```
