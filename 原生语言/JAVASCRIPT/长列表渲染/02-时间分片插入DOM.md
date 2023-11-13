# 02-时间分片插入DOM
参考资料：
[「前端进阶」高性能渲染十万条数据(时间分片)](https://juejin.cn/post/6844903938894872589)


在有的场景下，我们不得不插入大量的DOM到页面，如何去做优化呢？你需要了解一些基本点：
- DOM的创建消耗远低于DOM的渲染

## setTimeout(insertDOMFun, 0)
通过延时的递归调用，每次等到setTimeout任务到的时候再次插入一部分DOM，插入一部分DOM又要等待UI渲染完毕，如此反复

## requestAnimationFrame
参考资料：
[requestAnimationFrame知多少](https://www.cnblogs.com/onepixel/p/7078617.html)

小知识：
- setTimeout 和 setInterval 是要进入任务队列排队等待执行，因此它并不准时，所以通过定时器设置的动画都不够流畅！
- 千万不要惯性的将事件循环和requestAnimationFrame一起考虑，这样只会乱。你只要知道浏览器尽量的保证 60 帧每秒，因此当事件循环的事件队列存在任务时，需要记录上一次更新UI的时间，只要当之后的任务执行完成再次更新UI时，时间超过了 1000 / 60 ms ，才会去渲染页面

如何解决 **定时器不准**（脱离事件队列），定时器执行过快 （快于 1000/60 时，多次更新渲染线程DOM）浏览器并不渲染（最佳渲染时机）


requestAnimationFrame：告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

上面其实已经告诉你它的执行时机：它是独立于事件循环外的，只和浏览器的渲染帧（虽然不一定是 1000/16 但是会自动计算最佳的渲染帧）有关，只要当前渲染帧时间到达的时候，它就会立即的执行

因此，通过window.requestAnimationFrame实现
```javascript
window.requestAnimationFrame(insertDOMFun)
//insertDOMFun 内部再次调用 window.requestAnimationFrame 直到插入完毕
```
> 可以配合再 insertDOMFun 使用 DocumentFragment，将所有的DOM节点组织好之后在一次回调中插入到页面中


requestAnimationFrame 有两个优势
- CPU节能：使用 setTimeout 实现的动画，当页面被隐藏或最小化时，setTimeout 仍然在后台执行动画任务，由于此时页面处于不可见或不可用状态，刷新动画是没有意义的，而且还浪费 CPU 资源。而 rAF 则完全不同，当页面处理未激活的状态下，该页面的屏幕绘制任务也会被系统暂停，因此跟着系统步伐走的 rAF 也会停止渲染，当页面被激活时，动画就从上次停留的地方继续执行，有效节省了 CPU 开销，减少电池开销。

- 函数节流：在高频率事件(resize,scroll 等)中，为了防止在一个刷新间隔内发生多次函数执行，使用 rAF 可保证每个绘制间隔内，函数只被执行一次，这样既能保证流畅性，也能更好的节省函数执行的开销。一个绘制间隔内函数执行多次时没有意义的，因为显示器每16.7ms 绘制一次，多次绘制并不会在屏幕上体现出来。（当然，这需要加上锁机制才能配合实现，即触发滚动将更新DOM作为函数传入requestAnimationFrame，关闭锁，当完成回调的时候才再次打开锁）

> 一个值得一提的是：大部分框架都已经内部帮你实现了requestAnimationFrame在你更新数据的时候，比如React的setState异步更新，Vue的异步渲染nextTick（其实从这里也可以看到nextTick是如何实现的）
