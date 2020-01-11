# vue-cli入门

## node环境的安装

> *请参考nodejs环境搭建 在node文件夹下*  
> *编辑器为Visual Studio Code*


## 安装vue-cli

```bush
npm i @vue/cli -g   //3.+++

vue init webpack (在4.0有所改动) (选择时最好不要选择严格模式语法)
//选择vue-router 推荐使用默认的
```

## 分析vue-cli文件目录

1. 在root下有一个index.html文件 (进过处理之后渲染的页面)
2. static为静态的资源
3. package.json的 **dependencies** 是用户手动安装的依赖包
4. build和config是经常需要更改的配置文件
5. node_mod... 是模块依赖
6. src就是编写vue的东西啦

## 分析vue-cli 的 src 目录下的文件

### asset 
放一些图标字体或者比较小的图片，该目录下的文件会被vue-cli(按照规则)直接压缩(一般解析成base64码),
### components 
自然就是组件的意思,用来放置各组件，其中的格式决定于个人开发喜好
### router
路由。在里面可以编写路由规则
### app.vue
一个app组件被main.js注入在index.html的id为app的div上,
其中的路由由router-view分发显示
### main.js
加载的入口文件

## 查看vue-cli首页页面
```bush 
npm run dev // npm start
```