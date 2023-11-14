
## 开启后白屏问题排查

### 报错问题是什么
Error: APP-SERVICE-Engine:Please do not register multiple Pages in pages/packageA/index2p5/index.js

同时注册了Component和Page（webpack打包完成之后的代码）

### Taro3.x是否做额外处理
1. Taro3源代码中并没有和 lazyCodeLoading相关
2. 开启lazyCodeLoading前后两次打包之后的代码并没有差距（Git记录）

## 最终解决方案
把所有usingComponents 使用的组件改成 import模式，这样Taro不会把React组件转换成原生组件（调用Component）