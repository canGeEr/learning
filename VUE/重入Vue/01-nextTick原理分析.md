# 01-nextTick原理分析 
简单分析Vue的原理层：   
Vue通过proxy代理监听属性，属性发生变化，先进行收集属性变化对应的更新函数，最后统一通过更新函数触发虚拟DOM的更新，
再通过diff对比虚拟DOM树之后，通过底层方法自动的更新DOM（这个时候GUI渲染线程的DOM真的更新了），但是这个时候仍然出处于事件循环的宏任务执行阶段

## 为什么需要nextTick
解决异步渲染带来的问题，Vue改变属性不会立即触发真实DOM的更新，然而对于开发者，更新完数据之后立马触发DOM更新，代码之后能立即获取到最新的DOM更好理解。这也是为什么说Vue是“异步渲染”，其实可以说是异步的更新DOM树（相对代码级别上的立即）


分析完Vue的原理层你能发现，Vue底层更新完DOM仍然处于宏任务执行阶段，从事件循环机制看，只要我们的代码后于该宏任务执行，就能获取到真实的DOM，因此几种方式：
- setImmediate （宏任务代码执行完成立即触发，但是存在兼容性）
- promise （对应 MessageChannel ）
- setTimeout （最慢的，及其影响体验，如果你是需要在这里操作DOM，用户体验是最差的，并且中间发生可能动画由于旧的事件循环结束）


```javascript
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (
  typeof MessageChannel !== 'undefined' &&
  (isNative(MessageChannel) ||
    // PhantomJS
    MessageChannel.toString() === '[object MessageChannelConstructor]')
) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  /* istanbul ignore next */
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```
nextTick支持promise
```javascript
export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve
  // 将回调函数整合进一个数组中
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  // 判断是否可以使用 Promise
  // 可以的话给 _resolve 赋值
  // 这样回调函数就能以 promise 的方式调用
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```