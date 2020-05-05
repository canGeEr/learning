# 搭建React(cli) 

## 创建
1. npm install create-reaact-app -g //全局安装
2. 在要创建项目的目录下 create-reaact-app + 项目名
3. cd 项目名 => npm start(npm run dev 不是启动方式)


## 配置

### 相对路径配置
> **node_modules / react-scripts / config / webpack.config**
找到alias给其添加值
```javascript
alias: {
  'react-native': 'react-native-web',
  ...(isEnvProductionProfile && {
    'react-dom$': 'react-dom/profiling',
    'scheduler/tracing': 'scheduler/tracing-profiling',
  }),
  ...(modules.webpackAliases || {}),
},

//推荐的方式是直接写
modules.webpackAliases = {
  "@": paths.appSrc
}

```

### 配置代理proxy
>**node_modules / react-scripts / config / webpackDevServer.config**
找到proxy给其添加对象
```javascript
proxy {
  '/API':{ 
    target:'http://192.168.1.105:8080',
    changeOrigin:true,
    pathRewrite:{
      '^/API':''
    }
  }
}
```

> 还有一种就是运行 npm run eject (注意git要长传至无更新状态),会在根目录下生成需要的配置文件