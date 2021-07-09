# 手写 PromiseAPro

```javascript
const PromiseAPro = (function () {
  const PromiseState = {
    fulfilled: "fulfilled",
    pending: "pedding",
    rejected: "rejected",
  };

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
      if (value instanceof MyPromise) return value;
      return new MyPromise((fulfill) => {
        fulfill(value);
      });
    }

    static reject(errorReason) {
      if (value instanceof MyPromise) return value;
      return new MyPromise((fulfill, reject) => {
        reject(errorReason);
      });
    }

    // 实现all方法  怎么处理可迭代 ?
    static all(iterator) {
      return new PromiseAPro((fulfill, reject) => {
        let count = 0;
        const resArr = [];
        for (let myPromise of iterator) {
          myPromise.then((res) => {
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
        for (let myPromise of iterator) {
          myPromise.then(fulfill, (error) => {
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
        for (let myPromise of iterator) {
          myPromise.then(fulfill, reject);
        }
      });
    }

    constructor(executor) {
      this[privatePropertyNames.state] = PromiseState.pending;
      this[privatePropertyNames.fulfillCallbacks] = [];
      this[privatePropertyNames.rejectCallbacks] = [];
      if (!executor) throw new Error("注册参数未传入");
      try {
        executor(this.fulfill.bind(this), this.reject.bind(this));
      } catch (e) {
        this.reject(e);
      }
    }

    //其实在Promise.prototype上没有 fulfill方法和reject方法，毕竟这两个方法没用服用的效果
    // fulfill可以实现串联
    fulfill(result) {
      if (this[privatePropertyNames.state] === PromiseState.pending) {
        this[privatePropertyNames.state] = PromiseState.fulfilled;
        this[privatePropertyNames.result] = result;
        this[privatePropertyNames.fulfillCallbacks].forEach((callback) =>
          callback()
        );
      }
    }

    reject(result) {
      if (this[privatePropertyNames.state] === PromiseState.pending) {
        this[privatePropertyNames.state] = PromiseState.rejected;
        this[privatePropertyNames.result] = result;
        this[privatePropertyNames.rejectCallbacks].forEach((callback) =>
          callback()
        );
      }
    }

    then(
      onFulfilled = (res) => res,
      onRejected = (error) => {
        throw error;
      }
    ) {
      const nextPromiseAPro = new PromiseAPro((fulfill, reject) => {
        switch (this[privatePropertyNames.state]) {
          case PromiseState.pending:
            this[privatePropertyNames.fulfillCallbacks].push(() => {
              queueMicrotask(()=>{
                try {
                  const result = onFulfilled(this[privatePropertyNames.result]);
                  this.connectPromise(result, fulfill, reject, nextPromiseAPro);
                } catch(error) {
                  reject(error)
                }
              })
            });
            this[privatePropertyNames.rejectCallbacks].push(() => {
              queueMicrotask(()=>{
                try {
                  const result = onRejected(this[privatePropertyNames.result]);
                  this.connectPromise(result, fulfill, reject, nextPromiseAPro);
                } catch(error) {
                  reject(error)
                }
              })
            });
            break;
          case PromiseState.fulfilled:
            queueMicrotask(()=>{
              try {
                const result = onFulfilled(this[privatePropertyNames.result]);
                this.connectPromise(result, fulfill, reject, nextPromiseAPro);
              } catch(error) {
                reject(error)
              }
            })
            break;
          case PromiseState.rejected:
            queueMicrotask(()=>{
              try {
                const result = onRejected(this[privatePropertyNames.result]);
                this.connectPromise(result, fulfill, reject, nextPromiseAPro);
              } catch(error) {
                reject(error)
              }
            })
            break;
        }
      });

      return nextPromiseAPro
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

    // 串联Promise
    connectPromise(lastPromiseAPro, fulfill, reject, nextPromiseAPro) {
      if( lastPromiseAPro === nextPromiseAPro ) {
        throw new Error('不能循环使用')
      }

      let called = false
      if(lastPromiseAPro !== null && (typeof lastPromiseAPro === 'object' || typeof lastPromiseAPro === 'function')) {
        try {
          then = lastPromiseAPro.then
          if(typeof then === 'function') {
            then.call(result, 
              (res) => {
                if(called) return
                called = true
                this.connectPromise(res, fulfill, reject, nextPromiseAPro)
              }, 
              (error) => {
                if(called) return
                called = true
                reject(error)
              }
            )
          } else {
            fulfill(lastPromiseAPro)
          }
        } catch(error) {
          if(called) return
          called = true
          reject(error)
        }
      } else {
        fulfill(lastPromiseAPro)
      }
    }
  };
})();

// promises-aplus-tests测试钩子
Promise.defer = Promise.deferred = function() {
  let defer = {}
  defer.promise = new Promise((resolve, reject) => {
    defer.resolve = resolve
    defer.reject = reject
  })
  return defer
}
try {
  module.exports = Promise
} catch (e) {}
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

- Promise.js 文件
```javascript

// promises-aplus-tests测试钩子
Promise.defer = Promise.deferred = function() {
  let defer = {}
  defer.promise = new Promise((resolve, reject) => {
    defer.resolve = resolve
    defer.reject = reject
  })
  return defer
}
try {
  module.exports = Promise
} catch (e) {}
```