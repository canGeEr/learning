# 在react使用样式

> import 只支持src下文件的引入

## 普通的import
1. 作用于全局

## Css Modules
在react的cli有自动集成css-modules，但是匹配的是\.module\.css文件    
所以只能用xxx.module.css写    
在js文件导入css import style from 'xxx....'   
最后在jsx上写className={ style.xxx }

### 怎么配置自己要的名字
> **node_modules / react-scripts/ config / webpack.config.js**

getStyleLoaders 函数 传入的 cssOptions 就是其配置
```javascript
cssOptions = {
  test: cssModuleRegex, //\.module\.css
  use: getStyleLoaders({
    importLoaders: 1,
    sourceMap: isEnvProduction && shouldUseSourceMap,modules: true,
    modules: {
      //自定义组成类名
      localIdentName: '[name]-[local]',
    },
  }),
},

```