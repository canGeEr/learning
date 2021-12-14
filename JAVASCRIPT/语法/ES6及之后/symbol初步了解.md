# 原始数据类型Symbol

## 唯一值
试想一下，如果希望生成一个唯一的基本类型值，好像js还写不出来，但是可以生成比较复杂的数字，或者字符串，
但这样都显得不够优雅，而且对用户依然可见。毕竟例如
```javascript
a = 'dsadsadsadsadsafdsavdsvdsafsafdsa'
//一人可以通过赋值粘贴，取到其值
```
或者可能加上时间戳就显得不一样

## Symbol(str:String) 
参数希望是字符串
```javascript
Symbol('a') == Symbol('a') //false
//任何参数产生的Symbol数据都不同
```

### 常量使用

### 对象属性 [] 访问


## Symbol.for(str: String)
全局注册Symbol，相当所有的Symbol.for共存于同一个作用域

每次调用Symbol.for 会到作用域查找是否已经注册存在，
如果不存在，则注册，否则返回已注册的值
```javascript
let commonSymbol = Symbol.for('same');
let commonSymbolCopy = Symbol.for('same');
commonSymbolCopy === commonSymbol
```

## Symbol.keyFor()
获取注册参数str

> Symbol 值作为属性名时，该属性是公有属性不是私有属性，可以在类的外部访问。但是不会出现在 for...in 、 for...of 的循环中，也不会被 Object.keys() 、 Object.getOwnPropertyNames() 返回。如果要读取到一个对象的 Symbol 属性，可以通过 Object.getOwnPropertySymbols() 和 Reflect.ownKeys() 取到。