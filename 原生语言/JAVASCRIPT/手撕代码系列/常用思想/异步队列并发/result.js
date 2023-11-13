const TaskPool = require("./index");

TaskPool.prototype.addList = function (asyncTaskList) {
  const promiseList = asyncTaskList.map((asyncTask) => {
    return new Promise((fulfill, reject) => {
      this.add(() =>
        asyncTask().then(
          (res) => {
            fulfill(res);
            return res;
          },
          (error) => {
            reject(error);
            throw error;
          }
        )
      );
    });
  });
  return Promise.all(promiseList);
};

const runTask = new TaskPool(4);

const tasks = new Array(10).fill(0).map(
  (x, i) => () =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log(`task${i} complete`);
        resolve(`task${i}`);
      }, 2000);
    })
);

runTask.addList(tasks).then((res) => console.log(res));

/**
 * 设计一个任务队列，并发数量为 n，按顺序输出任务执行结果
 */
