# UI框架 iview 的使用

## 为什么选它
简约易上手

## 如何使用

```bush
npm install view-design --save
babel-plugin-import           //vue已经直接支持
```
说明:  
在vue只能用一种方式引入它(暂时对它不了解，只能这样记着)  

1. 全局引入
```javascript
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
```
```javascript
//对应.babelrc配置
"plugins": [
  *****,
  [
    "import", 
    // {
    // "libraryName": "view-design",
    // "libraryDirectory": "src/components"
    // }
  ]
]
```


2. 按需引入

```javascript
import { Notivce } from 'view-design';
Vue.use(Notivce);
import 'view-design/dist/styles/iview.css'; //任然必须
```


```javascript
//对应.babelrc配置
"plugins": [
  *****,
  [
    "import", 
    {
    "libraryName": "view-design",
    "libraryDirectory": "src/components"
    }
  ]
]
```


## 总结
1. 样式是可以被用户样式覆盖的，因为先加载的是

2. 注意两者选其一
