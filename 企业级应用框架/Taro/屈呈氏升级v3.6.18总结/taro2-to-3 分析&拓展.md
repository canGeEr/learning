## taro2-to-3 流程
- 第一阶段：入口文件收集
	- taro 根据内置的平台属性收集各种入口文件 app.platform.js，作为Entry实例
	- entry 在初始化的时候读取js内容（通过jscodeshift），本质上通过查找AST语法树对应的标识，比如pages和subPackages，然后收集内容到 entry.pages 上
	- entry 需要做一次 transform（同样使用jscodeshift） 包括：render 函数需要重写，不再需要手动调用Taro.render函数

- 第二阶段：转换entry的pages
	- 将一个entry的pages拼接成参数、依次使用 transforms 目录下的脚本文件（taro-import、page-config、router）转换pages的内容并输出

- 第三阶段：检查babel配置是否需要更新

- 第四阶段：更新对应的依赖

## 为什么屈呈氏抽离page.config.js失败
上面说过一个Entry是平台的入口文件，通过该文件内容分析平台的主包页面、分包页面和其它配置

```javascript
// 找到taro component组件的 AST 节点对象
const taroClassComponents = TaroUtils.findComponentES6ClassDeclaration(this.root, '@tarojs/taro');
if (!taroClassComponents || taroClassComponents.size() === 0) {
  return;
}

this.entryComponent = taroClassComponents.at(0);
// 找到TaroComponent对应的config类属性 AST节点对象
const properties = this.entryComponent.find(j.ClassProperty, {
  type: 'ClassProperty',
  key: {
	type: 'Identifier',
	name: 'config'
  },
  value: {
	type: 'ObjectExpression'
  }
});
if (properties.size() === 0) {
  return;
}

// 找到config类属性是否存在pages属性（主包页面）
const mainPkgPagesPath = this.configPath.value.value.properties.find(x =>
  x.type === 'ObjectProperty' &&
  x.key.type === 'Identifier' &&
  x.key.name === 'pages' &&
  x.value.type === 'ArrayExpression'
);
```

关键的异常点在 mainPkgPagesPath 获取上，x.type 不一定只是Identifier 表示
```javascript
{
	// pages是标识符Identifier
	pages: []
}
```
可能是字符串形式：StringLiteral
```javascript
{
	"pages": []
}
```

因此mainPkgPagesPath收集需要改成：

```javascript
const mainPkgPagesPath = this.configPath.value.value.properties.find(x =>
  x.type === 'ObjectProperty' && (
	(x.key.type === 'Identifier' && x.key.name === 'pages') ||
	(x.key.type === 'StringLiteral' && x.key.value === 'pages')
  ) &&
  x.value.type === 'ArrayExpression'
);
```

**!!#ff9900 同理，分包pages路径的收集也需要如此修改!!**