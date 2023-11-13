# 生成器 Generator

## **一、特征**

1. function 后有一个\*
2. 函数内部有 yield，注意 yield 只有在带有\*的函数內部出现才能使用，不然会发生错误
3. 看一个简单的 generator 函数

```javascript
function* func() {
  console.log("one");
  yield "1";
  console.log("two");
  yield "2";
  console.log("three");
  return "3";
}
```

4. 生成器函数 generator 调用并不像普通的函数一样：
   - 调用后，函数内的代码不执行，而是返回一个 iterator（迭代器），可以调用 next 方法的对象
   - 返回的迭代器对象可以通过调用 next 方法，执行一段代码（这段代码，从上一段代码结尾开始执行，直到碰到 yield 关键字，并执行完该 yield 右边表达式
5. 看一下，（如果对执行结果有疑问，建议去看看 Iterator 迭代器）

```javascript
const myIterator = func();
console.log(myIterator.next());
//one /n {value: 1, done: false}
console.log(myIterator.next());
//two /n {value: 2, done: false}
console.log(myIterator.next());
//three /n {value: 3, done: false}
```

总结一下：**所以有 n 个 yield 就要调用 n+1 次结束函数**

## **二、生成器的其它几个点**

### **（1）yield 既是关键字又是变量**

> 你把它先看成 return 就很好理解，不需要注意边界问题，调用一次 next，就是执行一段函数，直到 **yield**（这个特殊的返回 return），**并且 yield 右边的表达式也要计算完成**

1. yield 遇到 函数被“截断”，只有再下一次调用 next，才会继续往下执行
2. 下一次调用 iterator.next(params) 参数的值将赋值给 yield

```javascript
function* func() {
  console.log("start");
  let yieldValue = yield "1";
  console.log(yieldValue);
  yieldValue = yield "2";
  console.log(yieldValue);
}

const myIterator = func();
console.log(myIterator.next("第一次传入的值"));
//start /n {value: 1, done: false}
console.log(myIterator.next("第二次传入的值"));
//第二次传入的值 /n {value: 2, done: false}
console.log(myIterator.next("第三次传入的值"));
//第三次传入的值 /n {value: undefined, done: true}
```

next 传值调用下一段代码，实参的值将赋值给上一段代码的 yield
（如果上一段没有。自然无法传递：第一次调用 next）

### **（2）return 打断 next 迭代**

Generator().return 外部执行 return 可以传参，参数的值为最后一次迭代返回的对象的 value => {value: params, done: true}

```javascript
function* func() {
  console.log("start");
  yield "1";
  console.log("1");
  return "a";
  yield "2";
  console.log("2");
}
//注意到return 之后，next调用不会再执行代码

const myIterator = func();
console.log(myIterator.next());
//start \n {value: 1, done: false}
console.log(myIterator.next());
//1 {value: "a", done: true} 这里的value变成a也是值得注意的
console.log(myIterator.next());
//{value: undefined, done: true}
```

出了在函数內部直接 return，也可以再外部直接 generator.return(variable)，结束迭代器

### **（3）yield\***

- yield\* 表达式表示 yield 返回一个遍历器对象，用于在 Generator 函数内部，调用另一个 Generator 函数。
- 它和 yield 有什么不同吗？看下面一段代码

1. 说过 **yield** 相当于 return，打断点，只是简单的返回右边表达式计算完成的值，但是 yield 失去了 return 的作用，也就是说 **yield\*** 没有断点的作用
2. 但是 **yield\***，会执行右边的 generator 函数（这个很重要），**并调用其返回的迭代器对象的 next 方法一次**

> 一个 generator 函数被调用之后只返回迭代器，是不会执行 next 的，但是 yield 用于相当于两条语句的功能

```javascript
/* yield案例 */
function* generatorFuncOne() {
  console.log("开始执行generatorFuncOne");
  console.log("执行generatorFuncTwo之前");
  yield generatorFuncTwo();
  console.log("执行完成generatorFuncTwo之后");
  return "a";
}

function* generatorFuncTwo() {
  console.log("开始执行generatorFuncTwo");
}

const funcIterator = generatorFuncOne(); // 执行generator函数，但是没有任何代码执行
console.log(funcIterator.next()); // 执行第一段代码，注意value是generatorFuncTwo迭代器
// 开始执行generatorFuncOne \n 执行generatorFuncTwo之前 \n 开始执行generatorFuncTwo \n  {value: generatorFuncTwo, done: false}
console.log(funcIterator.next());
// 执行完成generatorFuncTwo之后 \n {value: 'a, done: true}

/* yield*案例 */
function* generatorFuncOne() {
  console.log("开始执行generatorFuncOne");
  console.log("执行generatorFuncTwo之前");
  yield* generatorFuncTwo();
  console.log("执行完成generatorFuncTwo之后");
  return "a";
}

function* generatorFuncTwo() {
  console.log("开始执行generatorFuncTwo");
}

const funcIterator = generatorFuncOne(); // 执行generator函数，但是没有任何代码执行
console.log(funcIterator.next()); // 执行第一段代码
// 开始执行generatorFuncOne \n 执行generatorFuncTwo之前 \n 开始执行generatorFuncTwo \n  {value: 'a', done: true}
```

3. **yield\***如果不是对一个 generator 函数使用会怎么样呢

```javascript
function* generatorFuncOne() {
  yield* function () {
    return {};
  };
}

function* generatorFuncTwo() {
  console.log("开始执行generatorFuncTwo");
}

// 执行generator函数，但是没有任何代码执行，注意但是现在没有报错
const funcIterator = generatorFuncOne();
// 执行第一段代码 开启报错：Uncaught TypeError: undefined is not a function
console.log(funcIterator.next());
```

### **（3）throw 抛出异常**

Generator().throw 方法可以再 Generator 函数体外面抛出异常，再函数体内部捕获。

### yield\*

yield\* 表达式表示 yield 返回一个遍历器对象，用于在 Generator 函数内部，调用另一个 Generator 函数。

> 这个例子如果不使用 yield\*只用 yield 那么就会按照原来的逻辑执行，

```javascript
function* callee() {
  console.log("callee: " + (yield));
}
function* caller() {
  while (true) {
    yield* callee();
  }
}
const callerObj = caller();
callerObj.next();
// {value: undefined, done: false}
callerObj.next("a");
// callee: a
// {value: undefined, done: false}
callerObj.next("b");
// callee: b
// {value: undefined, done: false}

// 等同于
function* caller() {
  while (true) {
    for (var value of callee) {
      yield value;
    }
  }
}
```

> 相当于暂时进入另一个迭代器迭代，或者说当前迭代器将迭代权转交给了內部的另一个迭代器，并且其它的形式完全按照该迭代器处理(传参，返回的对象 value 等)。当然要注意的是 done 的值，只有当所有的迭代完成才能 done: true

## **三、实现异步调用**

```javascript
//希望先执行waitOne完成setTime回调后再执行waitTwo，等回调后完成
var iteratorObj = (function* () {
  yield waitOne();
  yield waitTwo();
  yield waitThree();
})();

function waitOne() {
  setTimeout(function () {
    console.log("a");
    iteratorObj.next();
  }, 3000);
}

function waitTwo() {
  setTimeout(function () {
    console.log("b");
    iteratorObj.next();
  }, 3000);
}

function waitThree() {
  setTimeout(function () {
    console.log("c");
    iteratorObj.next();
  }, 3000);
}

iteratorObj.next();

/* 另外一种 yield* 这种更加接近 async await */
var iteratorObj = (function* () {
  yield* waitOne();
  yield* waitTwo();
  yield* waitThree();
})();

function* waitOne() {
  setTimeout(function () {
    console.log("a");
    iteratorObj.next();
  }, 3000);
  yield;
}

function* waitTwo() {
  setTimeout(function () {
    console.log("b");
    iteratorObj.next();
  }, 3000);
  yield;
}

function* waitThree() {
  setTimeout(function () {
    console.log("c");
    iteratorObj.next();
  }, 3000);
  yield;
}

iteratorObj.next();
//仔细看每个等待generator函数有没有像promise一样，只有当函数回调执行完成，才发起next解除当前函数的断点
```
