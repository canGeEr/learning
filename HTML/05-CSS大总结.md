# CSS大总结
CSS核心就是，有什么css、css规则（权重）、怎么用（有什么效果），还有样式特性（是否继承），当然从JS的角度还可以分类（回流、重绘）

## CSS总结

- 字体属性
  - font
    - size
    - family
    - weight
    - style
    - variant、size-adjust、stretch

- 文本属性
  - 可继承：color、line-height、letter-spacing、word-spacing、white-space、text-shadow、text-justify、text-transform（块级：text-algin、text-indent）
  - 不可继承: vertical-align、text-overflow、text-decoration、box-shadow

- 列表属性：list-style: type、image、position

- 属性可见性：visibility（可继承）、opacity、display、overflow （opacity强调视觉上的隐藏，即透明度 、visibility 强调功能和视觉上的同时隐藏）

- 光标属性：cursor

- 文档流：
  - 盒模型属性：
    - box-sizing、margin、border、padding
    - content：height、width、mix-系列、max-系列
  - BFC
    - 产生条件：Root 和 浮动元素、position absolute、fixed、 overflow: hidden、display: inline-block、flex、inline-flex、table-cell
    - 功能：新的层叠上下文 与其它元素内容隔开、计算浮动子元素的高度、边距不会合并
  - 定位属性：
    - position：static、sticky、fixed、absolute、relative、z-index（背景/边框、负z-index、正常文档流、浮动元素、文本内容、z-index为auto、正z-index
    - 浮动：float、clear
  - 布局display
    - flex / grid
      - 盒子：wrap、direction => flow，justify/align-content（纵轴方向相对盒子的整体排布）、align-items
    - table
    - block / inline-block / inline （宽高边距设置、独占一行、包裹性）

- 背景属性：
    - image：渐变、图片url
    - position、color、size、repeat、clip、attachment、origin

- 动画：
  - animation：name duration delay timing-function iteration-count direction file-mode


## 文本溢出
```css
.div {
  width: xxx; // 这点非常重要，overflow起作用的基础就是width有限制，文字的宽度大于父亲的100%
  white-space: nowrap; // 不换行
  overflow: hidden;
  text-overflow: ellipsis; // 文字超出省略号
}
```

## 元素高度计算规则
- 元素的高度由内部的多行行高决定（即 line-height）
- 行高由每行内部的内联元素的最大高度决定（最大行内框）
- ling-height => 顶线、中线、基线、底线