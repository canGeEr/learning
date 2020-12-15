# let和const

个人感觉没什么好说的
```javascript
let x = "'global'
function a() {
  console.log(x);
  let x = 1;
}
//这个例子如果不用变量提升解释的话？
```