# JS一些小技巧

## 算的jS代码执行时间
1. 
```javascript
var timer = new Date().valueOf();
/*
代码段
*/
var timerEnd = new Date().valueOf();
console.log(timeLong, timerEnd - timer);
```
2. 
```javascript
console.time('字符标识'),
console.timeEnd('字符标识')
//自动输出 '字符标识' + '时间'
```