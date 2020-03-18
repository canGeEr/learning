# 一些不好记忆的js知识点

## 焦点管理
检测element是否聚焦
```javascript 
button.focus(); 
document.activeElement === button //true
document.hasFocus() //文档是否聚焦
```

## 自定义属性 data-
HTML5规定可以为元素添加非标准的属性，但要添加前缀 data-，目的是为元素提供与渲染无关的 信息，或者提供语义信息。这些属性可以任意添加、随便命名，只要以 data-开头即可,添加了自定义属性之后，可以通过元素的 dataset 属性来访问自定义属性的值


## 插入标记
(1) **innerHTML**:   
在写模式下，innerHTML 的值会被解析为 DOM子树，替换调用元素原来的所有子节点。因为它的 值被认为是 HTML，所以其中的所有标签都会按照浏览器处理 HTML 的标准方式转换为元素（同样， 这里的转换结果也因浏览器而异）。如果设置的值仅是文本而没有 HTML标签，那么结果就是设置纯文本

> 使用 innerHTML 属性也有一些限制。比如，在大多数浏览器中，通过 innerHTML 插入\<script> 元素并不会执行其中的脚本,并不是所有元素都支持 innerHTML 属性


(2) **outerHTML**:  
在读模式下，outerHTML 返回调用它的元素及所有子节点的 HTML标签。在写模式下，outerHTML 会根据指定的 HTML字符串创建新的 DOM子树，然后用这个 DOM子树完全替换调用元素

(3) **insertAdjacentHTML**:   
**beforebegin**，在当前元素之前插入一个紧邻的同辈元素   
**afterbegin**，在当前元素之下插入一个新的子元素或在第一个子元素之前再插入新的子元素    
**beforeend**，在当前元素之下插入一个新的子元素或在后一个子元素之后再插入新的子元素   
**afterend**，在当前元素之后插入一个紧邻的同辈元素    


> 在删除带有事件处理程序或引用了其他 JavaScript 对象子树时，就有可能导致内存占用问题。假设 某个元素有一个事件处理程序（或者引用了一个 JavaScript对象作为属性），在使用前述某个属性将该元 素从文档树中删除后，元素与事件处理程序（或 JavaScript 对象）之间的绑定关系在内存中并没有一并 删除。如果这种情况频繁出现，页面占用的内存数量就会明显增加。因此，在使用 innerHTML、 outerHTML 属性和 insertAdjacentHTML()方法时，好先手工删除要被替换的元素的所有事件处理 程序和 JavaScript对象属性


## scrollIntoView()
跳转视图

## contains() 节点关系判断

新增的方法element
compareDocumentPosition:  
1 无关（给定的节点不在当前文档中）  
2 居前（给定的节点在DOM树中位于参考节点之前）   
4 居后（给定的节点在DOM树中位于参考节点之后）   
8 包含（给定的节点是参考节点的祖先）  
16 被包含（给定的节点是参考节点的后代）   