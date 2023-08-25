const sleep = require("./../utils/sleep");

class TaskPool {
  // 最大同时执行的任务
  max;
  // 任务列表
  taskList;
  constructor(max = 10) {
    this.max = max;
    // 存储还在执行的任务列表
    this.taskList = [];
  }
  add(asyncTask) {
    if (this.max > 0) {
      this.max--;
      // 执行完成之后释放资源
      asyncTask().finally(() => {
        this.max++;
        // 每次完成之后，检查是否有任务需要继续进行
        this.checkAsyncTask();
      });
    } else {
      this.taskList.push(asyncTask);
    }
  }
  checkAsyncTask() {
    if (!this.taskList.length) return;
    // 退出一个资源
    const asyncTask = this.taskList.shift();
    this.add(asyncTask);
  }
}

// const taskPool = new TaskPool(2);

// function sleepConsole(n) {
//   return () =>
//     sleep(n).then((res) => {
//       console.log(res);
//     });
// }

// const test = [
//   // [sleepConsole(3), sleepConsole(3), sleepConsole(3), sleepConsole(1)],
//   [
//     sleepConsole(1),
//     sleepConsole(2),
//     sleepConsole(3),
//     sleepConsole(1),
//     sleepConsole(2),
//   ],
// ];

// console.log(
//   test.map((item) => item.map((asyncTask) => taskPool.add(asyncTask)))
// );

// for (let i = 0; i < 10; i++) {
//   const task = () =>
//     new Promise((resolve) => {
//       // 这里 i 的值也是以前非常高频的闭包题哦
//       setTimeout(() => {
//         console.log(`task${i} complete`);
//         resolve(`task${i}`);
//       }, 2000);
//     });
//   taskPool.add(task);
// }

/**
 * 实现一个 taskpool类，其至少具有 add 方法和最大并发数 max，
 * 该 add 方法接收函数(返回值为 promise)，当当前执行的任务数小于设定值 max 时，立即执行，
 * 大于 max，则等待任务空闲时执行该任务，模版代码如下:
 */
