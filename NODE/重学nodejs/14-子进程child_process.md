# 衍生创建进程

child_process模块提供了创建衍生进程的方法，这个功能主要由 child_process.spawn 提供：

```javascript
const Process = require('child_process')
const { spawn } = Process

// 创建一个衍生子进程
const spawnChildProcess = spawn(
  'cat', 
  ['father_process.js'], 
  {
    cwd: __dirname,
    // 子进程产生的输出会转到父进程的
    stdio: 'inherit'
  }
)

// 预期是node的执行路径
// process 表示当前进程的对象
console.log(process.argv[0])
```
## spawn 调用参数解析
- command：要运行的指令，需要注意的是这个指令只能是系统能够直接找到的，即PATH环境变量能够找到的值
- args：指令后面跟随的字符串参数列表
- options：
  - cwd：当前子进程工作目录 process.pwd()
  - env：设置子进程的环境变量
  - argv0：设置子进程的process.argv[0]，默认值为 command（因此，其实如果是父进程，可能为node xxx.js执行的指令，访问父进程的process.argv[0] => node）
  - stdio：子进程的标准输入输出设备
  - signal：允许使用中止信号中止子进程
  - timeout：允许进程运行的最大时间，默认不限时间
  - killSignal：子进程结束之后的进程结束终止信号
  - uid：设置进程的用户标识
  - shell：指定执行shell脚本的 shell程序，默认是'/bin/sh'
  - detached：准备子进程独立于其父进程运行。 具体行为取决于平台
  - windowsHide：隐藏通常在 Windows 系统上创建的子进程控制台窗口

**需要注意的是：**
child_process.spawn创建的进程是异步的，只是先返回个引用，需要操作 衍生进程 需要通过异步回调的方式操作，如果你希望使用同步的方式操作（等待子线程执行完成并返回结果，最后退出）可以使用对应的方式 => child_process.spawnSync（这将是件非常糟糕的事情，会导致父亲进程阻塞）

## 子进程标准输入输出 options.stdio
默认的每个进程都有自己的V8引擎，自己的栈和堆空间，自己的存储空间，他们也有自己的标准输入输出。如果需要自定义呢？

设置 options.stdio 为一个数组，第0个元素表示stdin、第1个stdout、第二个stderr，设置这些值的类型有几种：
- 标示型
  - pipe 在子进程和父进程之间创建管道
  - overlapped
  - ignore：表示没有管道，直接忽略输入输出已经错误，相当于 设置/dev/null
  - inherit 集成，表示使用父亲进程的标准输入输出，当然也可以使用 0、1、2表示使用父亲的 stdin、stdout、stderr 设置标准输入输出流传入/传出父进程


如何理解pipe？
 
Nodejs并没有像C语言那么基础，不是直接的设置 stdin 为路径这么简单，而是针对文件创建一个可读和可写的流Stream，根据文件的特性，将可读流和可写流分别放在 FatherProcess 和 ChildProcess：
- subProcess.stdin 在父进程能访问到，是个可写流；在子进程中，通过process.stdin 是个可读流（因为子进程需要读取输入）
- subProcess.stdout | stderr 在父进程能访问到，是个可读流；在子进程中，通过process.stdout | stderr 是个可写流（因为子进程需要输出）


```javascript
const { spawn } = require('child_process');
// spawn 调用，创建了对应的进程
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

## 进程独立 options.detached
如果spawn设置options的detached为true的时候，可以让子进程在父进程退出后继续运行。 子进程将有自己的控制台窗口。 一旦为子进程启用，则它就不能被禁用。

默认情况下，父进程将等待分离的子进程退出。 为了防止父进程等待给定的 subprocess 退出，则使用 subprocess.unref() 方法。 这样做会使父进程的事件循环不将子进程包括在其引用计数中，从而允许父进程独立于子进程退出，除非在子进程和父进程之间建立了 IPC 通道。

当使用 detached 选项启动长时间运行的进程时，子进程在父进程退出后不会一直在后台运行，除非提供了未连接到父进程的 stdio 配置（如何链接到父进程 stdio 配置，那么父进程一直无法释放）。 如果继承了父进程的 stdio，则子进程将保持与控制终端的连接。


```javascript
const { spawn } = require('child_process');

// process.argv[0] 返回 node，因为当前文件执行是根据 node ..father.js 在bush执行的
const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore'
});

subprocess.unref();
```

总结一下，如果需要子进程和父进程完全独立（父进程不需要等待子进程结束才退出，子进程不依赖父进程）：
- 没有IPC通讯
- detached 设置为 true，子进程独立
- stdio 不依赖父亲进程的 stdio
- subprocess.unref()，让父进程独自可以退出



# 如何关闭子进程

## AbortSignal打断子进程
```javascript
const Process = require('child_process')
const { spawn } = Process

// AbortController 需要高 node 版本支持，作者换到了v17.1.0
const controller = new AbortController();
const { signal } = controller;

const spawnChildProcess = spawn(
  'cat', 
  ['index.js'], 
  {
    cwd: __dirname,
    stdio: 'inherit',
    signal
  }
)

// 注意，需要处理一下子进程的错误，因为 stdio 是继承的 
spawnChildProcess.on('error', function(error) {
  // console.log(error)
})

controller.abort()
```


## subprocess.kill([signal])
想子进程发送终结信号，如果没有给定参数，则进程将被发送 'SIGTERM' 信号，如果 终止进程 成功，则此函数返回 true，否则返回 false
```javascript
// 终止进程
spawnChildProcess.kill('SIGTERM')
```

# 子进程事件和属性
father_process_main.js
```javascript
const Process = require('child_process')
const { spawn } = Process

const spawnChildProcess = spawn(
  process.argv[0], 
  ['child_process_main.js'], 
  {
    cwd: __dirname,
    stdio: 'inherit',
  }
)

console.log('当前进程的用户：', process.geteuid())
console.log('当前进程的进程标识：', process.pid)

// spawnChildProcess.kill('SIGHUP')
spawnChildProcess.on('spawn', function() {
  console.log('衍生子进程成功，PID为', spawnChildProcess.pid)
  // console.log(spawnChildProcess.exitCode)
})
```
child_process_main
```javascript
let count = 1
setInterval(() => {
  console.log(count++)
}, 1000)
```
打开mac的活动监视器，找到PID那一列，查找进程发现，确实有两个node进程（父亲进程等待子进程结束，因为，我们需要设置 spawnChildProcess.unref()）

需要注意的是，ctrl + C能退出父进程，如果父进程和子进程有依赖关系的话，那么退出父进程会连带的退出子进程。如果你调用了 spawnChildProcess.unref() 就需要注意，子进程和父进程脱离关系，需要在某个时间点关闭子进程，不然一直运行下去不会停止，一直消耗内存和占用CPU

> 如果你希望一开始就让 spawnChildProcess 独立，可以在调用spawn的时候传参options里的 detached 为 true


## onSpawn
```javascript
spawnChildProcess.on('spawn', function() {
  console.log('衍生成功')
})
```

## onError
'error' 事件在以下情况下触发：
- 无法衍生该进程
- 进程无法终止
- 向子进程发送消息失败

发生错误后，'exit' 事件可能会也可能不会触发。 在监听 'exit' 和 'error' 事件时，防止多次意外调用句柄函数


## onExit
- code：如果子进程自己退出，则为退出码
- signal：终止子进程的信号

'exit' 事件在子进程结束后触发。 如果进程退出，则 code 为最终的进程退出码，否则为 null。 如果进程因收到信号而终止，则 signal 是信号的字符串名称，否则为 null。 两者之一将始终是非 null

当 'exit' 事件被触发时，子进程标准输入输出流可能仍处于打开状态

## onClose
- code：如果子进程自己退出，则为退出码
- signal：终止子进程的信号

在进程已结束并且子进程的标准输入输出流已关闭之后，则触发 'close' 事件。 这与 'exit' 事件不同，因为多个进程可能共享相同的标准输入输出流。 'close' 事件将始终在 'exit' 或 'error'（如果子进程衍生失败）已经触发之后触发




## subprocess.exitCode
属性表示子进程的退出码。 如果子进程仍在运行，则该字段将为 null

## subprocess.signalCode
表示子进程接受到的信号。 如果子进程仍在运行，则该字段将为 null