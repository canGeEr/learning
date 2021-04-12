# 09-RegExp正则匹配类型
正则是一个高效的字符串查找功能，可以减少大量代码的编写，但是却提供强大的检索能力

## 字面量的正则表达式
有两个//组成，在斜杠之间的就是匹配的内容（字符），比如
```javascript
/abc/ //匹配包含abc连续字符的字符串
```
但是着些字符有一些属于特殊字符：
- ^ 以...开头，$ 以...结尾
- ? 0~1次，+ 1~无穷，* 0~无穷，{n, m} n~m次
- .（点号）一次任意的字符
- |，对外层分界，表示可选
    ```javascript
    /green|red/
    /[ab]/ => /a/b/ 只不过[]内只支持一个字符的或，比如
    /[a-zA-Z0-9]/
    ```
- 另外一些常用的特殊字符
    - \d数字，\D非数字
    - \s空白，\S非空白
    - \w单词（字母、数字或者**下划线**），\W非单词
    
    这些其实也说明了\是个特殊字符，如果需要匹配\，需要使用\\

对于这些特殊字符，字符串要匹配的时候，需要转义，即加上\。比如：
```javascript
//匹配点号
/\./ 和 /./意义完全不同
```

## RegExp构造函数
RegExp作为一个构造函数可以使用new标识符创建一个正则表达式，第一个参数是一个字符串，第二个是正则匹配模式
- 第一个参数：是正则表达式的字符串，但是注意，在构造函数处理的时候会默认的进行一次转义，因此，在传入之前，你需要多加一层转义以正常使用
- 第二个参数：字面量（正则表达式）模式

## RegExp实例属性
- 是否设置对应的字面量模式
    - global 布尔值 是否设置g标志
    - ignoreCase 布尔值 是否设置i标志
    - multiline 布尔值 是否设置m标志
- lastIndex 开始搜索的下一个匹配项的字符位置，从0开始算起
- source 返回实例化传入的字符串参数
    ```javascript
    new RegExp('\.').source === "."
    new RegExp('\\.').source === "\."
    ```

## RegExp实例方法

### exec
> 对于是否包含字面量模式g的处理方式不同

如果有g全局匹配，那么调用之后返回从实例的lastIndex开始匹配到的字符串数组（因为包含多个括号，数组第一个元素为匹配到的整段字符串）
```javascript
const pattern = /ab(c)/g
const str = 'abcbcaababc'
console.log(pattern.lastIndex, pattern.exec(str))
console.log(pattern.lastIndex, pattern.exec(str))
console.log(pattern.lastIndex, pattern.exec(str))
/*
注意index和pattern.lastIndex的值
0 [ 'abc', 'c', index: 0, input: 'abcbcaababc', groups: undefined ]
3 [ 'abc', 'c', index: 8, input: 'abcbcaababc', groups: undefined ]
11 null
*/
```
如果没有。那么永远返回第一次匹配到的值
```javascript
const pattern = /ab(c)/
const str = 'abcbcaababc'
console.log(pattern.lastIndex, pattern.exec(str))
console.log(pattern.lastIndex, pattern.exec(str))
console.log(pattern.lastIndex, pattern.exec(str))
/*
0 [ 'abc', 'c', index: 0, input: 'abcbcaababc', groups: undefined ]
0 [ 'abc', 'c', index: 0, input: 'abcbcaababc', groups: undefined ]
0 [ 'abc', 'c', index: 0, input: 'abcbcaababc', groups: undefined ]
*/
```

### test
> 只关心是否匹配成功，不关心过程
返回匹配的布尔值，表示是否匹配成功

## 实现正则的上层方法
> String.prototype上的很多方法都对其进行封装，只需要传入需要匹配的正则便能完成很多功能

### match
方法检索返回一个字符串匹配正则表达式的结果，但是对于一个正则是否包含g字面量处理不同
```javascript
const pattern = /ab(c)/g
const str = 'abcbcaababc'
console.log(str.match(pattern))
//[ 'abc', 'abc' ] 每一个匹配到的字符串段

//不含g
const pattern = /ab(c)/
const str = 'abcbcaababc'
console.log(str.match(pattern))
//[ 'abc', 'c', index: 0, input: 'abcbcaababc', groups: undefined ] 和 exec的结果一致
```
总结就是，match对exec做了循环调用处理，直到退出循环，并把每次的结果数组的第一个元素（每次匹配到的字串）取出，重新组合数组

## matchAll
> ES6之后的实现，返回的是一个**迭代器**
```javascript
const pattern = /ab(c)/g
const str = 'abcbcaababc'
console.log([...str.matchAll(pattern)])
/*
[
  [ 'abc', 'c', index: 0, input: 'abcbcaababc', groups: undefined ],
  [ 'abc', 'c', index: 8, input: 'abcbcaababc', groups: undefined ]
]
```
可以看出，matchAll是对exec也做了循环处理，但是把每次匹配的结果**整个**保留下来

## search
> 核心区别点就是在于查找

查找第一次匹配（无关是否包含g字面量）到的字串段并返回，如果没有返回-1
（其实也是基于exec实现的，test不足以实现，但是test性能一定比exec快）

## replace
> 它很有用在于它可以有回调的处理每一次匹配，这让我们可以做非常多的事请，显得很强大

