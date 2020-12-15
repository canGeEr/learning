# 05 怎么理解操作DOM和样式
## **一、看一段代码**
```html
<body>
  <div id="title">第一次渲染</div>
  <script>
    const title = document.getElementById('title')
    title.addEventListener('click', function () { 
      title.textContent = '第二次渲染'
      long()//方便performance好调试
      console.log(title.textContent)
      title.textContent = '第三次渲染'
      console.log(title.textContent)
      alert(title.textContent)
    })

    function long(){
      for (var i = 0; i<1000; i++){
        for (var j = 0; j<1000; j++){
          for (var k = 0; k<1000; k++){
          }
        } 
      }
    }
  </script>
</body>
```
相信一下，点击title会发生什么，出现什么情况？       
- 先打印 '第一次渲染'
- 再修改DOM
- 再打印 '第二次渲染'
- 页面被alert停止了

我惊讶的发现：页面没有更新？        
What？Why？我的世界观差点崩塌，     
不是说操作DOM、样式，就会发生DOM更新，回流重绘吗？
难道是一次性执行完，然后更新的？那为什么会说操作DOM消耗性能，别人都是一次更新的。

## **二、操作的DOM和样式具体是个啥啊！**
> 我们先回顾一下 - HTML解析过程：Parse HTML 形成DOM Tree，Parse CSS 形成CSSOM，将两个attachment成Render Tree，这里需要注意Render Tree 和 DOM节点不是一一对应的，比如display为none的元素就不在。

结合前三篇的知识，进行梳理（一下内容涉及到performance）：
### **(1) 页面第一次加载 Parse 细致分析**
- Parse HTML是对HTML进行解析，把它转换为树的结果 => DOM Tree，再浏览器的Task表现就是Parse HTML
- Parse CSS对内联和外联进行解析，把他转换为模型对象 => CSSOM，浏览器的Task对内联表现为进行一次Recalculate Style，外联进行Parse CSS，再进行一次Recalculate Style，那么Parse CSS到底会发生什么呢？
=> 器都会将 CSS 文件解析成 StyleSheet 对象，对的，就是document.styleSheets获取的东西，将CSS处理成一条条的CSSRule，为attachment准备。

![](https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/image023.png)
- DOM Tree + CSSOM + attachment => Render Tree，那么Render Tree又相对有什么变化吗？
  和DOM Tree对比 节点少了，不需要渲染的节点移除；和CSSOM对比进行样式的计算，即对每个节点的DOM和样式进行结合方便布局渲染，直接获取节点的式。在performance表现为Recalculate Style，是的，你没看错，我个人觉得，StyleSheet本就可以边Parse CSS得到，边进行attachment构建Render Tree（即使最坏的情况下，他们同步完成，等待也没有毛病）。

- layout 进行布局 => 计算节点真正的长度大小，样式可不是写什么样，浏览器就渲染什么样式（各种无效样式，或者重复样式要合并，元素文字太多溢出之类）。这个过程结束之后能够获取到真实的计算样式。在performance表现为Layout。

- Paint 绘制，根据绘制顺序绘制，计算各种图案几点的像素点。在performance表现为Paint

- 分层展示 z-index属性，为了简单，将z-index同一层进行渲染，最后将分层合并。在performance表现为Update Layer Tree，Composite Layers

### **(2) 动态修改，执行过程分析**
*(1)* 对页面加载进行分析，可是更多的时候，都是各种交互，回调函数，执行JavaScript。由于JS能反复的修改页面，
但是却从未有人明确指出，
- 修改的是什么？怎么修改的？
- 什么时候修改的？
- 为什么说消耗性能
- “离线” DOM为什么能优化性能
- 获取css到底获取的是节点那个阶段的值

针对以上三个问题：

1. 操作DOM修改的是GUI线程的DOM Tree和CSSOM，但是这直接影响到 Render Tree 和 “layout之后的” Render Tree的更新。你可能会担心，每次修改都要重新建立Render Tree的话岂不是非常消耗性能？对的，如果真的这么做了，那性能一定不好。那它是这么做的呢？对比更新！   
记录DOM Tree更新了什么，CSSOM更新了什么，对比上次的Render Tree进行更新，得到新的Render Tree，但是一旦到了layout，又难受了，因为一个小的节点的插入将迎来大面积的宽高位置计算。所以layout处理的好不好，就看你如果操作DOM和CSS了。

2. 什么时候修改的呢？在执行DOM操作（这个时候，主线程的JS线程还在执行JS代码），开始调用底层API，通知GUI线程进行更新，但是这两个线程互斥，JS线程被迫停止，先更新DOM Tree和CSSOM。等待一系列更新完成，回到JS继续执行代码。

3. JS线程要停止去GUI线程更新DOM，或者读取 “layout之后的” Render 的样式，这必然是一个非常大的连接消耗，如果对其进行更新还可能引发**回流**和**重绘**，要耗费的时间就更多了。    
**浏览器的优化（Flush 队列）**： *因为现代浏览器是很聪明的。浏览器自己也清楚，如果每次 DOM 操作都即时地反馈一次回流或重绘，那么性能上来说是扛不住的。于是它自己缓存了一个 flush 队列，把我们触发的回流与重绘任务都塞进去，待到队列里的任务多起来、或者达到了一定的时间间隔，或者“不得已”的时候，再将这些任务一口气出队*

4. ”离线DOM” 能优化？很多人说找不到依据，那现在找到了！   
  比如：element.style.display = 'none' ，当执行这段代码的时候，显示更新了CSSOM和DOM（style属性更新），element要从Render Tree移除，并更新Render Tree，至于layout不一定触发（这里又很多情况，如果你需要访问一些至于layout才能拿到的样式的话，就会强制渲染），这种情况下，无论是否发生layout，当你接下来的JS代码再怎么操作该element，都不会进行更新Render Tree和进行layout，因为它都不在上面了！   
  上面的解释也告诉我们，element.style.display = 'none' 是否值得，比较它可引发一次及其消耗性能的layout，除非你确认之后的代码不会影响到 该element和其它被影响到的节点的布局后 样式的获取。举个例子
    ```javascript
    <body>
      <div id="title">第一次渲染</div>
      <div id="temp">temp</div>
      <script>
        const title = document.getElementById('title')
        title.addEventListener('click', function () { 
          title.style.display = 'none'
          console.log(temp.clientHeight)
        })
      </script>
    </body>
    ```
    title 变化后，肯定会影响其后面的元素clientHeight，但是你只要不去获取，浏览器自然不需要耗费无关的性能，可是一旦获取了，就引发layou，回流。



5. 上面说了，其实到了layout执行完成之后，真实的计算样式已经确立，所以获取到的DOM样式就是 “layout之后的” Render Tree的样式，那如果DOM不在Render Tree上呢？（对的，如果改变style.display，这个节点更新从Render Tree移除，自然无法从Render Tree获取它的样式，只能从CSSOM去获取，CSSOM又是内联和外联和内嵌的结合（包含所有写入的CSS），再进行选择器的匹配，如果还未匹配到，只能返回元素默认的样式。   
上面说的是getComputedStyle属性。
    ```html
    <body>
      <div id="title">第一次渲染</div>
      <script>
        const title = document.getElementById('title')
        title.addEventListener('click', function () { 
          const newDiv = document.createElement('div')
          newDiv.className = 'zix'
          newDiv.textContent = '新的div'
          document.body.append(newDiv)
          // newDiv.style.display = 'none' 重要的代码片段
          console.log(window.getComputedStyle(newDiv).height) // 20.8px
        })
      </script>
    </body>
    ```
    分析一下这段代码（看performance），
    1. window.getComputedStyle会直接破坏第三点说的优化，进行layout布局，自然布局完成打印出了20.8px；
    2. 如果加上 “重要的代码片段” 发现 没有进行layout，为什么？前面说了更新意味着先更新DOM Tree 和 CSSOM，并进而更新Render Tree，newDiv.style.display = 'none'将导致 newDiv直接从Render Tree删除，自然layout也没有了这个节点，当再次获取window.getComputedStyle都无法再Render Tree找到这个节点的，自然不会强制layout！同时打印输出 **auto**
    3. 上面说了getComputedStyle会回退，也可以获取CSSOM的的值，但是它现在没有，如果你加上样式：

        ```css
          .zix {
            height: '100px';
          }
        ```
        果然打印出了100px。

## **三、让我们回到那个问题**
页面为什么没有更新？这似乎很简单，就是好没有进行paint 和 display 嘛！alert立即阻断Main线程的执行，页面更新和脚本的执行都停下了。那会不会发生一闪而过的第二次渲染呢？不会的，每次时间循环等到执行完成微任务才能进行渲染更新，不然所以的DOM Tree更新和CSSOM都会暂停，只能更新到，Render Tree阶段（如果又机会刚好在layout阶段）。

## 四、名词解释

**回流**：当我们对 DOM 的修改引发了 DOM 几何尺寸的变化（比如修改元素的宽、高或隐藏元素等）时，浏览器需要重新计算元素的几何属性（其他元素的几何属性和位置也会因此受到影响），然后再将计算的结果绘制出来。这个过程就是回流（也叫重排）。

**重绘**：当我们对 DOM 的修改导致了样式的变化、却并未影响其几何属性（比如修改了颜色或背景色）时，浏览器不需重新计算元素的几何属性、直接为该元素绘制新的样式（跳过了上图所示的回流环节）。这个过程叫做重绘。