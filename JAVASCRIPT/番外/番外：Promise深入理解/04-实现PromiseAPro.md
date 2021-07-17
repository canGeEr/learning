# 手写 PromiseAPro

```javascript
function resolvePromise(promise, x, resolve, reject) {
  // 这是为了防止死循环
  if (promise === x) {
    return reject(
      new TypeError("The promise and the return value are the same")
    );
  }

  if (x instanceof PromiseAPro) {
    x.then(function (y) {
      resolvePromise(promise, y, resolve, reject);
    }, reject);
  }
  // 如果 x 为对象、 thenable对象
  else if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      // 把 x.then 赋值给 then
      var then = x.then;
    } catch (error) {
      // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      return reject(error);
    }

    // 如果 then 是函数
    if (typeof then === "function") {
      var called = false;
      // 将 x 作为函数的作用域 this 调用之
      // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
      // 名字重名了，我直接用匿名函数了
      try {
        then.call(
          x,
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          function (y) {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量called
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          function (r) {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (error) {
        // 如果调用 then 方法抛出了异常 e：
        // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
        if (called) return;

        // 否则以 e 为据因拒绝 promise
        reject(error);
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x);
  }
}

const PromiseAPro = (function () {
  const PromiseState = {
    fulfilled: "fulfilled",
    pending: "pedding",
    rejected: "rejected",
  };

  const { pending, fulfilled, rejected } = PromiseState;

  const privatePropertyNames = {
    state: Symbol("PromiseState"),
    result: Symbol("PromiseResult"),
    fulfillCallbacks: Symbol("fulfillCallbacks"),
    rejectCallbacks: Symbol("rejectCallbacks"),
  };

  return class PromiseAPro {
    [privatePropertyNames.state];
    [privatePropertyNames.result];
    [privatePropertyNames.fulfillCallbacks];
    [privatePropertyNames.rejectCallbacks];

    static resolve(value) {
      if (value instanceof PromiseAPro) return value;
      return new PromiseAPro((fulfill) => {
        fulfill(value);
      });
    }

    static reject(errorReason) {
      if (value instanceof PromiseAPro) return value;
      return new PromiseAPro((fulfill, reject) => {
        reject(errorReason);
      });
    }

    // 实现all方法  怎么处理可迭代 ?
    static all(iterator) {
      return new PromiseAPro((fulfill, reject) => {
        let count = 0;
        const resArr = [];
        for (let PromiseAPro of iterator) {
          PromiseAPro.then((res) => {
            resArr.push(res);
            if (++count >= iterator.length) {
              fulfill(resArr);
            }
          }, reject);
        }
      });
    }

    // 实现any方法  怎么处理可迭代 ?
    static any(iterator) {
      return new PromiseAPro((fulfill, reject) => {
        let count = 0;
        for (let PromiseAPro of iterator) {
          PromiseAPro.then(fulfill, (error) => {
            if (++count >= iterator.length) {
              reject(error);
            }
          });
        }
      });
    }

    // 实现race方法
    static race(iterator) {
      return new PromiseAPro((fulfill, reject) => {
        for (let PromiseAPro of iterator) {
          PromiseAPro.then(fulfill, reject);
        }
      });
    }

    constructor(executor) {
      this[privatePropertyNames.state] = PromiseState.pending;
      this[privatePropertyNames.fulfillCallbacks] = [];
      this[privatePropertyNames.rejectCallbacks] = [];

      try {
        executor(this.fulfill.bind(this), this.reject.bind(this));
      } catch (e) {
        this.reject(e);
      }
    }

    fulfill(result) {
      if (this[privatePropertyNames.state] === PromiseState.pending) {
        this[privatePropertyNames.state] = PromiseState.fulfilled;
        this[privatePropertyNames.result] = result;
        this[privatePropertyNames.fulfillCallbacks].forEach((callback) =>
          callback(this[privatePropertyNames.result])
        );
      }
    }

    reject(result) {
      if (this[privatePropertyNames.state] === PromiseState.pending) {
        this[privatePropertyNames.state] = PromiseState.rejected;
        this[privatePropertyNames.result] = result;
        this[privatePropertyNames.rejectCallbacks].forEach((callback) =>
          callback(this[privatePropertyNames.result])
        );
      }
    }

    then(onFulfilled, onRejected) {
      if (typeof onFulfilled !== "function") {
        onFulfilled = (res) => res;
      }

      if (typeof onRejected !== "function") {
        onRejected = (error) => {
          throw error;
        };
      }

      const nextPromiseAPro = new PromiseAPro((fulfill, reject) => {
        switch (this[privatePropertyNames.state]) {
          case pending:
            this[privatePropertyNames.fulfillCallbacks].push(() => {
              setTimeout(() => {
                try {
                  const result = onFulfilled(this[privatePropertyNames.result]);
                  resolvePromise(nextPromiseAPro, result, fulfill, reject);
                } catch (error) {
                  reject(error);
                }
              }, 0);
            });
            this[privatePropertyNames.rejectCallbacks].push(() => {
              setTimeout(() => {
                try {
                  const result = onRejected(this[privatePropertyNames.result]);
                  resolvePromise(nextPromiseAPro, result, fulfill, reject);
                } catch (error) {
                  reject(error);
                }
              }, 0);
            });
            break;
          case fulfilled:
            setTimeout(() => {
              try {
                const result = onFulfilled(this[privatePropertyNames.result]);
                resolvePromise(nextPromiseAPro, result, fulfill, reject);
              } catch (error) {
                reject(error);
              }
            }, 0);
            break;
          case rejected:
            setTimeout(() => {
              try {
                const result = onRejected(this[privatePropertyNames.result]);
                resolvePromise(nextPromiseAPro, result, fulfill, reject);
              } catch (error) {
                reject(error);
              }
            }, 0);
            break;
        }
      });

      return nextPromiseAPro;
    }

    catch(onRejected) {
      return this.then(undefined, onRejected);
    }

    finally(callback) {
      return this.then(
        (res) => {
          callback();
          return res;
        },
        (errorReason) => {
          callback();
          throw errorReason;
        }
      );
    }
  };
})();

// promises-aplus-tests测试钩子
PromiseAPro.defer = PromiseAPro.deferred = function () {
  let defer = {};
  defer.promise = new PromiseAPro((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
};

module.exports = PromiseAPro;
```

## 测试

- package.json

```json
{
  "name": "promise",
  "version": "1.0.0",
  "description": "",
  "main": "Promise.js",
  "scripts": {
    "test": "npx promises-aplus-tests Promise.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "promises-aplus-tests": "^2.1.2"
  }
}
```
