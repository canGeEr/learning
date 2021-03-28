# 01-node的简单内容和安装

## nodejs是REPL
> 相对于浏览器来说，浏览器运行环境 = ECMAScript + DOM + BOM；nodejs运行环境 = ECMAScript + 内置模块（各种API）

nodejs是一个基于v8的REPL环境，能执行JS脚本，并提供一写内置的对象

node的初心是为了做一个高性能的web服务器

## 高性能的优势
- 事件模型
- 非阻塞的异步I/O操作

## 为什么选择Javascript
- Javascript没有任何后端语言的背景（历史包袱，向下兼容0
- 单线程的异步语言

## 和ECMAScript 比 node优势
- CommonJS 模块系统规范
- 标准库 多
- 标准接口
- 管理包系统 package => npm => cnpm && node => nrm

## 安装node
直接去官网下载即可，下载完成之后，可以到对应文件夹找到node.exe可执行文件，点击弹出小窗，可以输入js代码执行

安装完成可以再cmd窗口使用node -v查看node版本
```bash
node -v //查看node版本
npm -v  //node自带的包管理工具npm
```

## 使用node
你也可以通过以下方式进入node运行环境：
- window + r 输入指令 cmd，输入node进入node环境，两次ctrl+c就能退出
- 在各个编辑器里，进入对应的目录，也可以输入指令

```bash
node //直接进入环境
node filename.js//使用node直接解析js文件，并输出结果
```

## 使用npm
使用CommonJS规范使得每个js文件都可以单独的模块化，去封装一个功能。我们把一个拥有自己实现功能的单独的模块叫做包（package），我们可以创建自己的包，上传自己的包，当然也可以下载别人上传的包，为了方便管理这些包，就出现了npm：**包管理工具**

### Package 包规范
如果自己需要上传包，需要满足一些规范，因此我们需要了解一些信息
- package.json 整个包的信息（作者，版本，依赖包等等0
- bin 可执行文件（一般本地依赖包需要）
- lib 真正的包目录原代码
- doc 文档说明
- test 测试

### 建包 Package
- 初始化package.json文件
    - 手写一个
    - npm init [-y | --yes] -y 可以直接跳过选项
- README.md 阅读文档
- npm install [包名] -S / --save 安装包到该目录下，并写入依赖（package.json的依赖字段dependencies）
- 配置package.json入口文件，可以编写代码了

### npm 基本指令
- npm -v / version 查看信息
- npm install / i
    - 不带参数 根据当前目录下的package.json安装依赖到node_modules文件夹里
    - 包名 --save / -S 添加到依赖
    - 包名 --dev / -D 添加到本地依赖
    - 包名 --global / -G 添加到本机依赖
- npm remove / i 包名 + [-S/ -D/ -G] 删除包
- npm search 包名 联网查询包名，及其信息
- npm i [包名]@版本号 下载对应版本

## install global 存在的问题
npm i 包名 --global 不会像其它指令一样添加到package.json，而是直接下载到主机本地

- 如果对下载存储的包进行统一管理
- 怎么运行对应的包，使用包的功能服务

这个时候就是去配置，node_gloal和node_cache，新建两个文件夹到node安装目录下，一个是用来存储全局安装的包，另外一个包缓存
- 设置npm下载包路径
    ```bash
    npm config set prefix  ['node_global模块路径']
    npm config set cache   ['node_cache模块路径']
    ```
- 配置环境变量到node_global，这样的话，可以在cmd任意的路径下执行全局包

### 什么是环境变量
当我们在cmd中，打开一个文件时或者运行一个可执行文件时
- 默认先会在该目录下查找文件，如果没有找到
- 那么就回去系统的环境变量的path去找，path可以看成一个数组，数组的每个元素都是路径+";"
- 还没找到就会报错

## nrm 管理镜像
npm的下载或者上传资源的服务器在国外，速度相当缓慢，我们需要使用其它镜像来提高npm的速度

- npm直接配置
    ```bash
    npm config set registry [https://registry.npm.taobao.org
    ```

- 安装cnpm(不推荐，一般一些项目的初始化默认npm,无法进行加速)
    ```bash
    npm install -g cnpm --registry=https://registry.npm.taobao.org
    ```

- 零时使用 (不推荐)
    ```bash
    npm --registry https://registry.npm.taobao.org install express
    ```
上面两种都有一个问题，那就是需要更换镜像的时候复杂，因此我们使用nrm，方便管理镜像
```bush
nrm ls //列出可选择的镜像
nrm use 镜像名 //使用该镜像
nrm add ... //手动添加镜像
nrm del ... //手动添加镜像
```