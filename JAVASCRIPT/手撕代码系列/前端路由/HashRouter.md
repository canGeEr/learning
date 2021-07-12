# HashRouter

## 什么是 hash

浏览器路径的#之后的值都是 hash 值

```javascript
window.location.hash.slice(1);
```

## 基本流程

- 实现的核心 window 监听 hashchange
- 维护一个路由对象，hash 值路径对应的回调函数
- 自己维护一个 history 堆栈数组，来进行前进和后退
- 如何保证浏览器记录和 JS 的 history 不矛盾

  - 浏览器左右点击或者设置都是添加记录（JS 维持的 history 栈）

  - 用户自己返回或者前进就是对，history 的指针进行左/右偏移

```javascript
class Routers {
  constructor() {
    this.routes = {};
    this.history = [];
    this.state = null;
    this.currentUrl = this.getHashUrl();
    this.currentHisyoryIndex = -1;
    this.action = "go";
    this.reflash = this.reflash.bind(this);
    window.addEventListener("load", this.reflash, false);
    window.addEventListener("hashchange", this.reflash, false);
  }

  getHashUrl() {
    return location.hash.slice(1);
  }

  visitRoute(route) {
    this.routes[route]?.();
  }

  addRoute(path, callback) {
    this.routes[path] = callback || function () {};
  }

  pushHistory(hasUrl) {
    this.history.push(hasUrl);
    this.currentHisyoryIndex++;
  }

  back() {
    this.currentHisyoryIndex--;
    if (this.currentHisyoryIndex < 0) this.currentHisyoryIndex = 0;
    window.location.hash = `${this.history[this.currentHisyoryIndex]}`;
    this.action = "back";
  }

  go() {
    this.currentHisyoryIndex++;
    if (this.currentHisyoryIndex >= this.history.length)
      this.currentHisyoryIndex = this.history.length - 1;
    window.location.hash = `${this.history[this.currentHisyoryIndex]}`;
    this.action = "back";
  }

  reflash() {
    const hasUrl = this.getHashUrl();
    if (this.action !== "back") {
      this.pushHistory(hasUrl);
    } else {
      this.action = "go";
    }
    console.log(this.history);
    this.visitRoute(hasUrl);
  }
}

window.Router = new Routers();
var content = document.querySelector("body");

function changeBgColor(color) {
  content.style.backgroundColor = color;
}

Router.addRoute("", function () {
  changeBgColor("red");
});

Router.addRoute("/yellow", function () {
  changeBgColor("yellow");
});
Router.addRoute("/blue", function () {
  changeBgColor("blue");
});
Router.addRoute("/green", function () {
  changeBgColor("green");
});

backButton.addEventListener("click", function () {
  Router.back();
});

goButton.addEventListener("click", function () {
  Router.go();
});
```
