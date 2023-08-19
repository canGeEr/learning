# 手写 PromiseAPro

```javascript
const { isObject } = require("./../utils/isObject");

/**
 * 1. promise的回调是同步执行的
 * 2. promise的一旦resolve或者reject之后，都不会再次改变，三种状态 pending、fulfilled、rejected
 * 3. promise
 * 现在所谓的promise不考虑fulfill调用时传递promise的情况
 */
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
  /**
   *
   * @param {*} onError
   * @returns
   */
  catch(onError) {
    return this.then(undefined, onError);
  }
  /**
   * 考点，不管成功或者失败都会执行，并且不带参数
   * @param {*} callback
   * @returns
   */
  finally(callback) {
    const noParams = () => callback();
    return this.then(noParams, noParams);
  }
  // 注意，all也接受可迭代
  /**
   *  考点，promises可以是可迭代对象，空数组也需要返回
   * @param {Promise []} promises
   */
  static all(promises) {
    // 这里也需要处理非promise类型
    promises = Array.from(promises).map((promise) => Promise.resolve(promise));
    return new Promise((fulfill, reject) => {
      const length = promises.length;
      if (!length) {
        return fulfill([]);
      }
      let successCount = 0;
      const result = [];
      // 这里必须记录index，因为then不是按照顺序调用的
      promises.forEach((promise, index) => {
        promise.then(
          (res) => {
            result[index] = res;
            successCount++;
            successCount === length && fulfill(result);
          },
          (error) => {
            reject(error);
          }
        );
      });
    });
  }
  /**
   *
   * @param {*} promises
   * @returns 一直等到所有的promise完成
   */
  static allSettled(promises) {
    // 这里也需要处理非promise类型
    promises = Array.from(promises).map((promise) => Promise.resolve(promise));
    return new Promise((fulfill) => {
      const length = promises.length;
      if (!length) {
        return fulfill([]);
      }
      let successCount = 0;
      const result = [];
      promises.forEach((promise, index) => {
        promise.then(
          (res) => {
            result[index] = {
              status: FULFILLED,
              value: res,
            };
            successCount++;
            length === successCount && fulfill(result);
          },
          (error) => {
            result[index] = {
              status: REJECTED,
              reason: error,
            };
            successCount++;
            length === successCount && fulfill(result);
          }
        );
      });
    });
  }

  /**
   *
   * @param {*} promises
   * @returns 任意一个成功就成功，全部失败才失败
   */
  static any(promises) {
    // 这里也需要处理非promise类型
    promises = Array.from(promises).map((promise) => Promise.resolve(promise));
    return new Promise((fulfill, reject) => {
      const length = promises.length;
      // 注意这里是拒绝
      if (!length) {
        return reject(new AggregateError([]));
      }
      let successCount = 0;
      const result = [];
      // 这里必须记录index，因为then不是按照顺序调用的
      promises.forEach((promise, index) => {
        promise.then(
          (res) => {
            fulfill(res);
          },
          (error) => {
            result[index] = error;
            successCount++;
            successCount === length && reject(new AggregateError(result));
          }
        );
      });
    });
  }

  /**
   *
   * @param {*} promises
   * @returns 依据最先返回的状态
   */
  static race(promises) {
    // 这里也需要处理非promise类型
    promises = Array.from(promises).map((promise) => Promise.resolve(promise));
    return new Promise((fulfill, reject) => {
      for (let promise of promises) {
        promise.then(fulfill, reject);
      }
    });
  }

  // 注意thenables
  static resolve(value) {
    if (value instanceof Promise) return Promise;
    if (value?.then && typeof value.then === "function") {
      return new Promise(value.then);
    }
    return new Promise((fulfill) => fulfill(value));
  }

  // 和resolve不同，一定会返回一个新的promise，并不会重用
  static reject(value) {
    return new Promise((fulfill, reject) => {
      reject(value);
    });
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

// const promise = new Promise((fulfill, reject) => {
//   setTimeout(reject, 1000);
// });

// promise.then(
//   (res) => {
//     console.log("这里是正确结果", res);
//   },
//   (error) => {
//     console.log("这里是错误结果", error);
//   }
// );

// console.log("这里promise代码层面之后");

Promise.deferred = Promise.defer = function () {
  var defer = {};
  defer.promise = new Promise((resolve, reject) => {
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
