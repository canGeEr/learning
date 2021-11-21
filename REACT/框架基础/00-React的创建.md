# 00-React的创建

## 创建
1. npm install create-reaact-app -g //全局安装
2. 在要创建项目的目录下 create-react-app + 项目名
3. cd 项目名 => npm start(npm run dev 不是启动方式)

## 路径别名

>*( react-app-rewired@^2.0.0+ 版本需要搭配 customize-cra 使用，因此要下载两个包)*

1. 准备下载npm包 **react-app-rewired** **customize-cra**
```bash
npm install react-app-rewired -D
npm install customize-cra -S
```


2. 在项目根目录创建 config-overrides.js

3. config-overrides.js 内

```javascript
//addWebpackAlias 更改别名项
const { override, addWebpackAlias } = require('customize-cra')

//集成路径函数
const path = require('path')
const resolve = dir => path.join(__dirname, '.', dir)


//override 覆写函数
module.exports = override(
  addWebpackAlias({
    ['@']: resolve('src')
  }),
)
```
## Proxy

1. 准备 npm **http-proxy-middleware** 包
```bash
npm install http-proxy-middleware -S
```

2. 在src目录下创建：setupProxy.js
```javascript
const proxy = require("http-proxy-middleware")

module.exports = function(app) {
  app.use(
    proxy.createProxyMiddleware(
      '/API', {  //带有api是需要转发的请求 
      target: 'http://192.168.1.105:8080',  // 这里是服务器地址
      changeOrigin: true,//值为布尔值, 为true时, 本地就会虚拟一个服务器接收你的请求并代你发送该请求,
      pathRewrite: {
        '^/API': ''
      }
    })
  )
}
```