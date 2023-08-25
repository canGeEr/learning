class AsyncQueue {
  constructor() {
    this.cache = new Map();
  }
  tap(name, fn) {
    if (!this.cache.has(name)) {
      this.cache.set(name, []);
    }
    this.cache.get(name).push(fn);
  }
  exec(name, fn) {
    const list = this.cache.get(name);
    if (!list?.length) return fn();
    const currentFun = list.shift();
    currentFun(() => this.exec(name, fn));
  }
}

function fn1(cb) {
  console.log("fn1");
  cb();
}

function fn2(cb) {
  console.log("fn2");
  cb();
}

function fn3(cb) {
  setTimeout(() => {
    console.log("fn3");
    cb();
  }, 2000);
}

function fn4(cb) {
  setTimeout(() => {
    console.log("fn4");
    cb();
  }, 3000);
}

const asyncQueue = new AsyncQueue();
// 注册事件队列
asyncQueue.tap("init", fn1);
asyncQueue.tap("init", fn2);
asyncQueue.tap("init", fn3);
asyncQueue.tap("init", fn4);

// 执行事件队列
asyncQueue.exec("init", () => {
  console.log("执行结束");
});

/**
 * 通过制作下一步回调完成，还需要考虑是不是一定需要pop
 */
