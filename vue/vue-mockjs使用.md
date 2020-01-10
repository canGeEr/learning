# vue-mockjs使用

## 安装
```bush
npm install mockjs -S(--save)
```

## 使用
```javascript
import Mock from 'mockjs'

const data = [] //任意数据

/*
*@ param 路径 方式 数据
*
*/
Mock.mock('/data/content','post',data);
```