# 05-怎么理解操作DOM和样式

## 访问DOM
HTML要在GPU渲染之后，才会展示，但HTML都没解析完，如果里面有JS，为什么能访问DOM？    

JS能访问的DOM是DOM Tree，所以只要DOM Tree的对于节点已经被解析，就能被JS访问，HTML的解析就是从上到下，所以JS刚好能访问在其之前的所有元素


## 回流和重绘
**回流**：当我们对 DOM 的修改引发了 DOM 几何尺寸的变化（比如修改元素的宽、高或隐藏元素等）时，浏览器需要重新计算元素的几何属性（其他元素的几何属性和位置也会因此受到影响），然后再将计算的结果绘制出来。这个过程就是回流（也叫重排），其实就算layout阶段

**重绘**：当我们对 DOM 的修改导致了样式的变化、却并未影响其几何属性（比如修改了颜色或背景色）时，浏览器不需重新计算元素的几何属性、直接为该元素绘制新的样式（跳过了上图所示的回流环节）。这个过程叫做重绘

他们两个都会触发render tree，但是不同的是，回流会触发重新layout阶段， 比如 width + 1，就会引起整棵树的重新计算位置信息，消耗实在大。而 重绘只会在重新计算样式之后之间的合成图层并绘制Paint

## 操作DOM发生了什么
1. 操作DOM间接的修改的是GUI线程的DOM Tree和CSSOM，但是这会影响到 Render Tree 和 Paint tree。

2. 执行DOM操作，开始调用底层API，通知GUI线程进行更新，但是这两个线程互斥，JS线程被迫停止，先更新DOM Tree和CSSOM。等待一系列更新完成，回到JS继续执行代码

3. JS线程要停止去GUI线程更新DOM，这必然是一个非常大的连接消耗，如果对其进行更新还可能引发**回流**和**重绘**，要耗费的时间就更多了。    
**浏览器的优化（Flush 队列）**： 因为现代浏览器是很聪明的。浏览器自己也清楚，如果每次 DOM 操作都即时地反馈一次回流或重绘，那么性能上来说是扛不住的。于是它自己缓存了一个 flush 队列，把我们触发的回流与重绘任务都塞进去，待到队列里的任务多起来、或者达到了一定的时间间隔，或者“不得已”的时候，再将这些任务一口气出队

> Flush 队列 在 performance里显示的是：Schedule Style Recalculation，安排样式的更新


## 为什么分离读写
合成rener tree是一件非常浪费时间的事情，合成之后还有计算样式、再layout，就能为JS提供完整的CSS信息，比如 window.getComputedStyle 就算获取到 layout 之后的节点信息，但这无疑会之间的加重浏览器的负担，迫使 “Flush 队列” 出队，更新整个render tree

操作样式的方法有三种：
- window.getComputedStyle(node)、
- node.style.CSSName、node.style.getPropertyValue(CSSName)
- document.styleSheets[0] 获取style标签的对象

为什么第二种不会有影响？

## 访问Node.style
Node.style是属于节点信息，这是它和style样式表的本质区别，它在DOM tree上，因此无论怎么操作 Node.style 都只是更新对应 DOM tree 的节点的 style 属性。因此，对Node.style的读取，根本不至于重新的render tree，可以等到执行完成脚本后统一的重新计算样式。

## transition的时机
```javascript
const block = document.getElementById('block')
const button = document.getElementById('button')
button.addEventListener('click', function(event) {
  block.style.transform = 'translateX(200px)'
  // window.getComputedStyle(block).transform
  block.style.transition = 'transform 1s ease-in-out'
  block.style.transform = 'translateX(100px)'
})
```
transition作用后
将前一棵DOM树对应属性，和最新的要渲染的DOM树的对应属性，形成的一个动画


## 为什么”离线DOM” 能优化？
```javascript
element.style.display = 'none'
```
当执行这段代码的时候，更新了DOM（style属性更新），element要从Render Tree移除，并更新Render Tree 重新 layout，在这之后，无论是否发生layout，当你接下来的JS代码再怎么操作该element，都不会进行更新Render Tree和进行layout，因为它都不在Render Tree上面了，自然不会发生后续。

如果在这之后我们再
```javascript
// 对 element style一顿操作
window.getComputedStyle(element)
```
发现，不会发生layout，因为 element 都不在render tree，自然获取不到对应的样式，只能从 CSSOM和 DOM tree获取

## 一次大量 优于 少量多次
操作DOM，一行代码代替多行

JS是一行一行执行的，在JS线程上，一行涉及DOM的代码，切换GUI线程执行完成切换回JS线程，但是发现下一行代码又是涉及DOM的代码，又要回去切换，因此如果你的代码可以通过DOM暴露的API一次性写入的话，就一次性写入，不要分行处理，因为会是得多次切换GUI线程，常见的例子就是

- cssText 一次性写入多行代码
- className、classList 操作代替 css写入
- DocumentFragment、innerHTML开启JS引擎加速

## 总结
主要考虑两点：
- 不要频繁切换GUI线程，减少DOM操作
- 不要触发重排（回流）layout 阶段，小小的变化触发整个tree的节点信息计算