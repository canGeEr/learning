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
    return new MyPromise((fulfill)=>{
      fulfill(value)
    })
  }

  static resolve(errorReason) {
    return new MyPromise((fulfill, reject)=>{
      reject(errorReason)
    })
  }

  constructor(excutor) {
    try {
      excutor(this.resolve, this.reject)
    }catch(error) {
      this.reject(error)
    }
  }

  resolve = (res) => {
    if(this.status === STATUS.pending) { // 执行成功回调函数
      this.status = STATUS.fulfilled // 变更状态为 fulfilled
      this.value = res
      for(let cb of this.onFulfilledCallbacks) {
        cb()
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
      let result
      if(this.status === STATUS.pending) {    // 等待中回来的时候触发变更

        this.onFulfilledCallbacks.push(() => {
          try {
            result = onFulfilled(this.value)
            this.connectPromise(result, fulfill, reject)
          } catch(error) {
            reject(error)
          }
        })

        this.onRejectedCallbacks.push(() => {
          try {
            result = onRejected(this.value)
            this.connectPromise(result, fulfill, reject)
          } catch(error) {
            reject(error)
          }
        })

      } else if(this.status === STATUS.fulfilled) { // 直接执行
        try {
          result = onFulfilled(this.value)
          this.connectPromise(result, fulfill, reject)
        } catch(error) {
          reject(error)
        }
      }else if(this.status === STATUS.rejected) { // 直接执行失败
        try {
          result = onRejected(this.value)
          this.connectPromise(result, fulfill, reject)
        } catch(error) {
          reject(error)
        }
      }
    })
  }
  
  connectPromise(result, fulfill, reject) {
    if(result instanceof MyPromise) {
      result.then(fulfill, reject)
    }else {
      fulfill(result)
    }
  }
}