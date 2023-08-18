# 手写 PromiseAPro

```javascript
const PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected";

class Promise {
  state;
  successQueue;
  failQueue;
  result;
  constructor(callback) {
    this.state = PENDING;
    this.successQueue = [];
    this.failQueue = [];
    try {
      callback(this.fulfill.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }
  // 最终根据resolve决定什么时候执行
  fulfill(result) {
    if (this.state !== PENDING) return;
    this.state = FULFILLED;
    this.result = result;
    this.successQueue.forEach((callback) => callback(result));
  }
  reject(result) {
    if (this.state !== PENDING) return;
    this.state = REJECTED;
    this.result = result;
    this.failQueue.forEach((callback) => callback(result));
  }
  then(onSuccess, onError) {
    if (typeof onSuccess !== "function") {
      onSuccess = (result) => result;
    }
    if (typeof onError !== "function") {
      onError = (error) => {
        throw error;
      };
    }
    /**
     * 如果then返回的结果是个promise，需要等待其完成
     */
    const nextPromise = new Promise((fulfill, reject) => {
      const asyncOnSuccess = () => {
        setTimeout(() => {
          try {
            const x = onSuccess(this.result);
            resolvePromise(nextPromise, x, fulfill, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      };
      const asyncOnError = () => {
        setTimeout(() => {
          try {
            const x = onError(this.result);
            resolvePromise(nextPromise, x, fulfill, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      };
      if (this.state === PENDING) {
        this.successQueue.push(asyncOnSuccess);
        this.failQueue.push(asyncOnError);
      }
      // 立即执行当前的两个函数
      if (this.state === FULFILLED) {
        asyncOnSuccess();
      }
      if (this.state === REJECTED) {
        asyncOnError();
      }
    });
    return nextPromise;
  }
}

/**
 *
 * @param {* Promise} dependentPromise 依赖者
 * @param {* Promise} dependant 被依赖者
 * @param {* function} fulfill
 * @param {* function} reject
 * @returns
 */
function resolvePromise(dependentPromise, dependant, fulfill, reject) {
  // 避免依赖循环
  if (dependentPromise === dependant) {
    return reject(new TypeError("promise dependency circle"));
  }
  // 注意这可能是Thenables，
  if (isObject(dependant)) {
    // 注意这里Thenables的fulfill, reject不能被重复调用，因此需要使用used
    let then = null,
      used = false;
    try {
      then = dependant.then;
      if (typeof then === "function") {
        then.call(
          dependant,
          (res) => {
            if (used) return;
            used = true;
            // 递归判读dependant返回的是不是promise
            resolvePromise(dependentPromise, res, fulfill, reject);
          },
          (error) => {
            if (used) return;
            used = true;
            reject(error);
          }
        );
      } else {
        fulfill(dependant);
      }
    } catch (error) {
      if (used) return;
      used = true;
      reject(error);
    }
  } else {
    fulfill(dependant);
  }
}

// promises-aplus-tests测试钩子
Promise.defer = Promise.deferred = function () {
  let defer = {};
  defer.promise = new PromiseAPro((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
};

module.exports = Promise;
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
