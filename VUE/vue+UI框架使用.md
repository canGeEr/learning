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
import 'view-design/dist/styles/iview.css';//注意加在 引入APP之前,不然样式顺序反掉

import ViewUI from 'view-design';

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
import 'view-design/dist/styles/iview.css'; //任然必须

import { Notivce } from 'view-design';
Vue.use(Notivce);


Vue.prototype.$Notice = Notivce  //可以选择注入，但是上一种已经注入了
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
