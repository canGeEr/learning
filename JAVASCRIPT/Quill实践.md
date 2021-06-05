# Quill

基本原理：
- 使用Delta数据模型描述富文本内容及其变化，以保证行为的可预测
- 通过Parchment对DOM进行抽象，以保证平台一致性
- 通过Mutation Observe监听DOM节点的变化，将DOM的更改同步到Delta数据模型中

需要注意的是，Parchment 就算充当数据 Delta和 DOM之间的翻译管，Delta 通过 一系列转变为 Parchment 结构类型的值，Parchment 类型的值调用对应的方法输出为DOM，最终渲染；监听DOM的变换，根据变化和 Parchment 更新 Delta 数据模型

因此 Parchment 才是核心，如何定义好一个 Parchment 扩展各种的功能（只要你的翻译官越强大，那么对于  Delta => DOM 的转换就越好）

## 什么是 Parchment 
[Parchment](https://github.com/quilljs/parchment/)
> 上面说了 Parchment 能够解析的语法更多，那么Quill能够处理的输入和输出就更多，关键是如何定义 Parchment 的数据格式：

我们先了解一下 Parchment ，Parchment能做的就算对DOM的抽象，比如DOM拥有tagname，props，childrens等属性，并且分element、text等节点，Parchment 就有相应的数据结构对于，比如基本的：**Blot** 相当于DOM的节点的地位，对其的拓展 Block Blot、Inline Blot、Embed Blot
，当然只要这个不够细化，还需要对props形成对于的抽象 **Attributors** 

这样，如何将 DOM 抽象成 Parchment 我们就完成了

```javascript
class Blot { 
  static blotName: string;
  static className: string;
  static tagName: string;
  static scope: Scope;

  domNode: Node;
  prev: Blot;
  next: Blot;
  parent: Blot;
  // ... 各种方法
}

class Attributor {
  attrName: string;
  keyName: string;
  scope: Scope;
  whitelist: string[];
  // ... 各种方法
}
```

## 具体
- Quill通过对Delta.opts的数组遍历处理，根据每个Delta.opt对象创建对应的 Blot 和 它对应的 Attributor，生成 Parchment 数据结构，这也是为什么 Delta单个对象 的 insert 字段的 包含 “标签名：image"（它其实是 定义继承 Blot 类型子类的 blotName ），并且有对应的格式化属性attribute

- 生成 Parchment 之后，根据数据结构生成对应的 DOM，并对节点进行 Mutation Observe 监听，如果发生变化，更新对应的Detla


## Quill核心部分 Formats
Formats 在 Quill就扮演着 Parchment的角色，它在Quill的文档的描述中是这样：它即决定toolbar中是否能够使用它，有决定剪贴板是否能输入这种格式的内容。其核心原因就是：
**在输出（点击toolbar的对应的format）、输入时自动的通过调用对应的 Parchment的Slot类/子类，生成对应的DOM插入（当然也会去更新delta）**

Quill宣称自己的可拓展性非常强，核心原因就算；我们可以自定义Format，只需要在Quill上register一下就好，注册完之后我们不仅可以在toolbar使用对应的option，还可以通对应的命令插入内容：
```javascript
let Inline = Quill.import('blots/inline'); // 这是Quill内部实现的核心模块

class BoldBlot extends Inline { } // 通过继承能够和Quill进行契合
BoldBlot.blotName = 'bold';
BoldBlot.tagName = 'strong';

class ItalicBlot extends Inline { }
ItalicBlot.blotName = 'italic';
ItalicBlot.tagName = 'em';

Quill.register(BoldBlot); // 进行注册
Quill.register(ItalicBlot);

option = {
  toolbar: [
    ['bold', 'italic'] // 这样对应的UI，点击事件都会触发
  ]
}
var quill = new Quill('#editor', option);

quill.insertText(0, 'Test', { bold: true });
quill.formatText(0, 4, 'italic', true);
// 我们还可以在 toolbar 通过handlers绑定对应的tolbar点击事件触发的方法，再通过调用：
// quill.insertText / quill.formatText 等方法，插入内容或者格式化内容
```

## Quill的方法拓展 Module
> 高可拓展性的定制化功能  

Quill不希望你直接的修改Quill的API而进行拓展，它希望你能够通过插件进行拓展，Quill.regitser 进行注册module。它内部将编辑器的基本功能分离成多个module，这些module被封装，
并通过Quill.import 找到对应的模块（它能被 修改|配置 来改变编辑器地行为）。例如：Quill就把toolbar分成多个模块，字体大小、字体颜色、背景颜色、字体family：
  - toolbar的多个子模块：
    ```javascript
    var ColorClass = Quill.import('attributors/class/color'); // 编辑器设置color模块
    var SizeStyle = Quill.import('attributors/style/size');  // 编辑器设置size模块
    Quill.register(ColorClass, true);
    Quill.register(SizeStyle, true);
    ```


- Quill 定制化内容：class / style 样式选定      
当我们点击粗体或者斜体的时候，Parchment 解析内容，并修改DOM，但是修改DOM有多种方式，
  - 改变DOM的class（为其添加clss，或者删除clsss）
  - 直接修改DOM的style的属性

  主要到上面的toolbar的子模块的区别了吗，Quill两种方式都实现了，分别被封装在 **"attributors/class/"** 或 **“attributors/style/”**
  看一个例子你就明白了
  ```javascript
  var ColorClass = Quill.import('attributors/class/color');
  Quill.register(ColorClass, true);
  //var ColorStyle = Quill.import('attributors/style/color'); 
  //Quill.register(ColorStyle, true);
  ```
  F12对比一下元素就好

- Quill 事件系统：
    - 监听键盘事件 Clipboard Module
      - 中间也可以设立监听器

    - 事件修改事件
    - 监听toolbar触发点击事件，添加handlers完成事件监听
      ```javascript
      var toolbarOptions = {
        handlers: {
          // handlers object will be merged with default handlers object
          'link': function(value) {
            if (value) {
              var href = prompt('Enter the URL');
              this.quill.format('link', href);
            } else {
              this.quill.format('link', false);
            }
          }
        }
      }

      var quill = new Quill('#editor', {
        modules: {
          toolbar: toolbarOptions
        }
      });

      // Handlers can also be added post initialization
      var toolbar = quill.getModule('toolbar');
      toolbar.addHandler('image', showImageUI);
      ```

- Quill的 module大多都是在对 quill实例进行事件监听绑定回调函数
    ```javascript
    // 这个option来自于 注册 quill的时候传入的option的对应的module的option
    Quill.register('modules/counter', function counter(quill, options) {
      const { container, unit } = options
      quill.on('text-change', (options) => { 
        const text = quill.getText();
        console.log(text, options);
      });
    });

    //比如：
    var quill = new Quill('#editor', {
      modules: {
        counter: { // 注意，即使这里不是对象，也需要使用true，注册这个方法
          container: '#counter',
          unit: 'word'
        }
      }
    });
    ```

