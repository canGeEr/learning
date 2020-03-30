# 强大的Map和Set

## Map

### 为什么需要Map?
> 后两个容纳了数组的特性 这也使得 Map看起来更加规整
1. Map所表示“键”可以是任意数据类型 Number String Boolean null undefined Object Symbol
2. Map不必惧怕和原型对象的属性冲突
3. 存储键值对个数通过size获取
4. 键值对的有序

### new Map(params: Map | Array)
params : Array :    
注意数组必须是二维数组，每个子数组两个值，第一个代表key,第二个代表value,**当传入多个数组是进行合并**

params : Map :      
返回的对象实例相当于克隆传入的Map类型实例
> 事实上，不仅仅是数组，任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map构造函数的参数

### 遍历 Map
1. 重写的forEach
2. for of   
(1) Map实例
(2) Map实例的entries方法返回一个Iterator 对象
(3) Map实例的myMap.keys()返回**键数组**
(4) Map实例的myMap.values()返回**值数组**

> 虽然 NaN 和任何值甚至和自己都不相等(NaN !== NaN 返回true)，NaN作为Map的键来说是没有区别的。

## Set
Set也叫做集合，特点就是没有相同元素 (值)   
1. +0 与 -0 在存储判断唯一性的时候是恒等的，所以不重复；
2. undefined 与 undefined 是恒等的，所以不重复；       
3. NaN 与 NaN 是不恒等的，但是在 Set 中只能存一个，不重复


### new Set(params : Array | String )
传入自动转换为set实例


