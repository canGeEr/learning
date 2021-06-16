# 13-Node的事件循环机制
Node 中的 Event Loop 和浏览器中的是完全不相同的东西。Node.js采用V8作为js的解析引擎，而I/O处理方面使用了自己设计的libuv，libuv是一个基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的API，事件循环机制也是它里面的实现（下文会详细介绍）


## Nodejs的运行机制
- V8引擎解析JavaScript脚本。
- 解析后的代码，调用Node API
- libuv库负责Node API的执行。它将不同的任务分配给不同的线程，形成一个Event Loop（事件循环），以异步的方式将任务的执行结果返回给V8引擎。
- V8引擎再将结果返回给用户

> libuv 调度各个线程工作，执行完成对应的任务，将结果作为异步回调函数参数，在V8上执行


## 事件循环
```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```
总共六个阶段，每个阶段都是一个“消息任务队列”：

每个阶段都有一个 FIFO 队列来执行回调。虽然每个阶段都是特殊的，但通常情况下，当事件循环进入给定的阶段时，它将执行特定于该阶段的任何操作，然后执行该阶段队列中的回调，直到队列用尽或最大回调数已执行。当该队列已用尽或达到回调限制，事件循环将移动到下一阶段



- 主线程执行代码（V8上），能够触发各种异步任务： 
  - 宏任务：I/O，setTimeout、setInterval、setImmediate（script本身是宏任务）
  - 微任务：process.nextTick、promise （process.nextTick在 promise之前执行，即先执行完所有的 process.nextTick 的任务，再执行完所有的 promise 任务

- 主线程执行完成，进入第一阶段：timers（setTimeout、setInterval），主要检查是否有定时器计时超过对应的阈值，注意，在这个阶段，定时器的数据结构是最小堆，根据设置的阈值就知道谁的执行顺序先。直到执行所有的定时器回调，才执行微任务，进入下一阶段

> 注意 pending callbacks 和 poll 阶段是核心，他们都处理I/O回调 => 本质上是共用一个I/O任务队列，但是 pending callbacks 不负责收集 I/O回调 到 I/O任务队列，而poll能 够收集，因此 pending callbacks 只能在每次在执行完成 poll 后的下一轮事件循环（poll是有最长执行时间和最大执行回调个数，到了限制之后，即使I/O队列还存在任务也得退出，进行到下一阶段）

- pending callbacks / I/O callbacks，检查I/O队列（上一轮poll留下来），比如文件读取、写入，执行I/O任务直到所有的I/O队列完成，执行微任务，进入下一阶段

-  idle, prepare 是内部的实现，没必要讨论

- poll轮询阶段，为啥需要它？ 
  - timer阶段和 pending callbacks 阶段有各种回调，这些回调也是能够触发异步任务，因此，即使当 pending callbacks 完成所有微任务后，I/O队列和定时器队列还是存在大量的任务等待执行
  - poll 首先查看 是否存在已经超时的定时器，存在，回到timer阶段重新走
  - poll 发现没有超时的定时器，查看I/O队列是否存在任务，执行任务队列的任务，但是，每执行完成一个任务就执行所有的微任务
  - poll 执行完任务发现为空，那么检查是否存在setImmediate任务注册，如果存在那么结束poll，进入 下一阶段 

- check 执行 setImmediate
- close callbacks  执行关闭回调

## setTimeout VS setImmediate
如果你把这两个函数放入一个 I/O 循环内调用，setImmediate 总是被优先调用
```javascript
// timeout_vs_immediate.js
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});

$ node timeout_vs_immediate.js
immediate
timeout
```
网上大部分默认是 poll 执行该回调，那么参照 poll 阶段，执行完成回调之后，有发现有 setImmediate 任务注册，进入check阶段，再 close ，再进入下一轮的 事件循环的timer阶段，因此肯定是 setImmediate 先

> 一般情况下是没有问题，但是，如果 poll 未正常完成I/O任务队列的执行，将这个回调留到了下一轮的 pending callbacks 那么就会出现问题，因为 pending callbacks 进去的第一次回检查是否有定时器完成，而 setTimeout(..., 0) 有极大的可能检测到定时器完成，从而回到 timers阶段，这样 timeout 就会先执行
