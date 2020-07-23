# 面向对象的JS

## 先说下空间内存的分配

## 字面量
```javascript
var a = {}; //创建一个空的对象
var b = {
  name: "b"
} //带有属性
```

## 什么是prototype属性
```javascript
//注意，并不是说只有大写开头的函数才叫一定是能完成构造函数的功能
//这只是一个默认的标准，代码风格

//例子
function a() {
  this.name = "a";
}

var b = new a();
console.log(b);

//例子
function A() {
  this.name = "a";
}

var b = new A();
console.log(b);


console.log(a.prototype);
//每个函数在创建的时候都会去创建一个原型对象
```
> 其实如果把构造函数能够创建一类（具有某些相同特性）的对象，而把它比喻成一个模型的话，那普通的函数不也是拥有这样的功能吗

**这在JS高级程序设计里面也称之为**  工厂模式
```javascript
function createPerson(name) {
  var person = {};
  person.name = name;
  person.eat = function () {
    console.log(this.name +  "要吃饭了");
  }
  return person;
}

var a = createPerson();
```


## 构造函数创建
当new 一个函数是，创建一个空对象，绑定对象this，调用构造函数， 如过构造函数返回对象，那么直接返回该对象，
否则将对象的隐式原型设置为构造函数的原型属性

```javascript
function Person(name) {
  this.name = name;
  this.eat = function () {
    console.log(this.name +  "要吃饭了");
  }
}

var b = new Person(); 
//创建对象 空
//this 绑定对象执行Person函数
//对象原型 = 构造函数的prototype
//默认返回对象
```

## 构造函数创建 VS 工厂函数创建
```javascript
我们分别打印两张方式创建的对象
console.log(a);
console.log(b)

// 我们发现 b.__proto__ 原型链上比a多了一个 对象 它打印是这样的
{
  constructor: function Person()..... 函数的引用
  __proto__: Object.prototype
}

```

## 原型对象
```javascript
// 为了解决构造函数无法复用函数，注意函数是一个对象，每写一次代码生成一个
// 举个例子对比
var objArr = [];
for(var i=0; i<4; i++) {
  objArr.push({});
}
console.log(objArr[0] === objArr[1]);

function Person() {
  //注意这是匿名函数
  //即使是赋值给变量，它也是匿名函数
  this.eat = function() {

  }
}

```

## 几个重要的概念
1. __proto__ 隐式原型属性 作为对象时获取原型对象的属性
2. prototype 原型属性     作为构造函数的获取对应原型对象的属性
3. constructor 作为原型对象所指向的构造函数 默认是object空对象
4. instanceof 检测 对象的__proto__ === 构造函数的prototype


## 手写new 
new 到底做了什么 理解为什么要new
```javascript
//以此写一个自己的new 错误的示例 为什么 ？ 注意Object.create是通过New 实现的
function myNew(protoClass) {
  var defaultObj = Object.create(protoClass.prototype);
  var args = Array.prototype.slice(argument, 0);
  var constructorObj = Person.apply(defaultObj, args);
  return typeof constructorObj === "object" ? constructorObj : defaultObj;
}

function myNew(protoClass) {
  var defaultObj = {} ;
  var args = Array.prototype.slice(argument, 0);
  var constructorObj = protoClass.apply(defaultObj, args);
  defaultObj.__proto__ = protoClass.prototype;
  //注意上面的 Person.prototype 是原始情况下 如果有修改 最好加上
  // protoClass.prototype.contructor = protoClass
  return typeof constructorObj === "object" ? constructorObj : defaultObj;
}
```



## Object.create
函数的基本实现
```javascript
(prototype) {
  var Fun = new Function(); // Fun() {};
  Fun.prototype = prototype;
  return new Fun();
}
```
其实从这里也可以看出一个特殊的例子：Object.create(null)，创建的实例是没有原型属性的

## 继承
一个构造函数产生的实例是另一个构造函数产生的实例，如果一直延续这样的关系，就形成了一条原型链，.__proto__.__proto__....一直到Object.__proto__ 再到 null空对象

## 组合继承最为常见
```javascript
//父类构造函数
function Super() {

}

//子类构造函数
function Sub() {

}


```