# 事件触发器Event
事件触发就是DOM绑定事件一样，只不过DDM的触发可以通过用户点击，写法上又有点像Vue里的emit父子组件传值

## 为什么需要
- 高性能（在一些高并发的时候处理急救处理）
- 优秀的发布/订阅模式（观察者模式）

## 基本使用
- 引入events模块：
    ```jaVascript
    const EventEmitter = require('events')
    const eventEmitter = new EventEmitter()
    ```

- 绑定事件（发布）：
    ```javascript
    eventEmitter.on('start', () => {
        console.log('开始')
    })
    ```
- 触发事件（订阅）：
    ```javascript
    eventEmitter.emit('start')//执行对应的回调
    ```

## API介绍
- addListener，作用就像DOM的add事件一样
    ```javascript
    const EventEmitter = require('events')
    const eventEmitter = new EventEmitter()  
    eventEmitter.on('start', () => {
        console.log('start绑定')
    })
    eventEmitter.addListener('start', function() {
        console.log('第一个addListener绑定')
    })  
    eventEmitter.addListener('start', function() {
        console.log('第二个addListener绑定')
    })  
    eventEmitter.emit('start')
    //start绑定
    //第一个addListener绑定
    //第二个addListener绑定
    ```
- removeListener() 移除，removeAllListeners移除所有

- on 直接绑定事件，类比DOM的onEvent方法绑定
- off 移除on的事件监听
- **once** 监听一次性的事件（尤为重要）

## 处理并发场景之一
[Events事件触发器](https://www.bookstack.cn/read/Nodejs-Roadmap/nodejs-events.md)
```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();
const fs = require('fs');
const status = {};
const select = function (file, filename, cb) {
    emitter.once(file, cb);
    if (status[file] === undefined) {
        status[file] = 'ready'; // 不存在设置默认值
    }
    if (status[file] === 'ready') {
        status[file] = 'pending';
        fs.readFile(file, function (err, result) {
            console.log(filename);
            emitter.emit(file, err, result.toString());
            status[file] = 'ready';
            setTimeout(function () {
                delete status[file];
            }, 1000);
        });
    }
}
for (let i = 1; i <= 11; i++) {
    if (i % 2 === 0) {
        select(`/tmp/a.txt`, 'a 文件', function (err, result) {
            console.log('err: ', err, 'result: ', result);
        });
    } else {
        select(`/tmp/b.txt`, 'b 文件', function (err, result) {
            console.log('err: ', err, 'result: ', result);
        });
    }
}
```

## 异步？
```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();
emitter.on('test',function(){
    console.log(111)
});
emitter.emit('test');
console.log(222)
// 输出
// 111
// 222
```
代码证明是同步