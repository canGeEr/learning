# V8 如何执行 javascript

## V8引擎的内部结构
V8是一个非常复杂的项目，使用cloc统计可知，它竟然有超过100万行C++代码。

V8由许多子模块构成，其中这4个模块是最重要的：

**Parser**：负责将JavaScript源码转换为Abstract Syntax(语法树) Tree (AST)  
**Ignition**：interpreter，即解释器，负责将AST转换为Bytecode，解释执行Bytecode；同时收集TurboFan优化编译所需的信息，比如函数参数的类型；  
**TurboFan**：compiler，即编译器，利用Ignitio所收集的类型信息，将Bytecode转换为优化的汇编代码；  
**Orinoco**：garbage collector，垃圾回收模块，负责将程序不再需要的内存空间回收；

## 流程图
<img src="V8执行流程.png">

## 执行过程

简单地说，Parser将JS源码转换为AST，然后Ignition将AST转换为Bytecode，最后TurboFan将Bytecode转换为经过优化的Machine Code(实际上是汇编代码)。

1. 如果函数没有被调用，则V8不会去编译它。
2. 如果函数只被调用1次，则Ignition将其编译Bytecode就直接解释执行了。TurboFan不会进行优化编译，因为它需要Ignition收集函数执行时的类型信息。这就要求函数至少需要执行1次，TurboFan才有可能进行优化编译。  
3. 如果函数被调用(包括参数)多次，则它有可能会被识别为热点函数，且Ignition收集的类型信息证明可以进行优化编译的话，这时TurboFan则会将Bytecode编译为Optimized Machine Code，以提高代码的执行性能。
4. 图片中的红线是逆向的，这的确有点奇怪，Optimized Machine Code会被还原为Bytecode，这个过程叫做Deoptimization。这是因为Ignition收集的信息可能是错误的，比如add函数的参数之前是整数，后来又变成了字符串。生成的Optimized Machine Code已经假定add函数的参数是整数，那当然是错误的，于是需要进行Deoptimization。(逆优化)

### Parser 过程

#### 1. 词法分析（lexical analysis）
主要是将字符流（char stream） 转换成标记流（token stream），字符流就是我们一行一行的代码，token是指语法上不能再分的、最小的单个字符或者字符串。

#### 2. 语法分析
将前面生成的token流根据语法规则，形成一个有元素层级嵌套的语法规则树，这个树就是AST。在此过程中，**如果源代码不符合语法规则，则会终止，并抛出“语法错误”**。