const STATUS = {
  pending: 'PENDING',
  fulfilled: 'FULFILLED',
  rejected: 'REJECTED'
}


class MyPromise {
  status = STATUS.pending; // 状态
  value; // 返回值
  onFulfilledCallbacks = []; // 成功回调函数 数组
  onRejectedCallbacks = []; // 失败回调函数 数组

  static resolve(value) {
    if(value instanceof MyPromise) return value
    return new MyPromise((fulfill)=>{
      fulfill(value)
    })
  }

  static resolve(errorReason) {
    if(value instanceof MyPromise) return value
    return new MyPromise((fulfill, reject)=>{
      reject(errorReason)
    })
  }

  static all(iterator) { // 传入一个迭代器
    return new Promise((fulfill, reject) => {
      for(let myPromise of iterator) {

      }
    }) 
  }

  constructor(executor) {
    try {
      executor(this.resolve, this.reject)
    }catch(error) {
      this.reject(error)
    }
  }

  resolve = (res) => {
    if(this.status === STATUS.pending) { // 执行成功回调函数
      if(res instanceof MyPromise) { // 如果是 MyPromise 实例，则串联
        res.then(
          res => {
            this.resolve(res)
          },
          errorReason => {
            this.reject(errorReason)
          }
        )
      }else { // 如果是正常的值
        this.status = STATUS.fulfilled // 变更状态为 fulfilled
        this.value = res
        for(let cb of this.onFulfilledCallbacks) {
          cb()
        }
      }
    }
  }

  reject = (errorReason) => {
    if(this.status === STATUS.pending) { // 执行失败回调函数
      this.status = STATUS.rejected // 变更状态为 rejected
      this.value = errorReason
      for(let cb of this.onRejectedCallbacks) {
        cb()
      }
    }
  }

  then(onFulfilled = res => res , onRejected = errorReason => { throw errorReason }) {
    return new MyPromise((fulfill, reject) => {
      if(this.status === STATUS.pending) {    // 等待中回来的时候触发变更

        this.onFulfilledCallbacks.push(() => {
          this.connectPromise(onFulfilled, fulfill, reject)
        })

        this.onRejectedCallbacks.push(() => {
          this.connectPromise(onRejected, fulfill, reject)
        })

      } else if(this.status === STATUS.fulfilled) { // 直接执行
        this.connectPromise(onFulfilled, fulfill, reject)
      }else if(this.status === STATUS.rejected) { // 直接执行失败
        this.connectPromise(onRejected, fulfill, reject)
      }
    })
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  finally(outFun) {
    return this.then(
      res => {
        outFun()
        return res
      }, 
      errorReason => {
        outFun()
        throw errorReason
      }
    )
  }

  connectPromise(callback, fulfill, reject) {
    queueMicrotask(()=>{
      try {
        const result = callback(this.value)
        if(result instanceof MyPromise) {
          result.then(fulfill, reject)
        }else {
          fulfill(result)
        }
      } catch(error) {
        reject(error)
      }
    })
  }
}