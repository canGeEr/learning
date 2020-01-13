# Why is getElementsByTagName() faster than querySelectorAll()

## 从空间角度
**GetElementsByTagName** : 返回的是html的集合 **HTMLCollection**   
**QuerySelectorAll** : 返回的是 **NodeList**  

HTMLCollection和NodeList都是DOM的节点集合；但是它们两个能够包含的元素是不太一样的，HTMLCollection只可以包含HTML元素(Element)集合，NodeList可以包含任意的节点类型，就是说NodeList不仅可以包含HTML元素集合，也可以包含像文字节点，注释节点等类型的节点集合

## 属性角度
**GetElementsByTagName** : 是实时更新的**live**  
**QuerySelectorAll** : 是静态的**static**  

DOM中的NodeList(live)是一种特殊的对象，它是实时更新的；就是你对这个NodeList中的任何一个元素进行的一些操作，都会实时的更新到这个NodeList对象上面

## 分析
可以这么理解 : 使用getElementsByTagName方法我们得到的结果就像是一个对象的索引，而通过querySelectorAll方法我们得到的是一个对象的克隆；所以当这个对象数据量非常大的时候，显然克隆这个对象所需要花费的时间是很长  
注意和警告 : querySelectorAll只在单次获取，多量操作时有优势，如果任然需要多次实时更新获取(消耗时间是长的，JS是阻塞页面渲染的), 少量(实时)的访问操作可以用getElementsByTagName

## 结束
如果你不需要一个快照，那就选择使用getElementsByTagName方法，如果你需要一个快照来进行复杂的CSS查询，或者复杂的DOM操作的话，那就选择使用querySelectorAll方法。