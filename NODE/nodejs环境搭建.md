# 如何快速搭建nodejs环境无坑版

## 下载nodejs(最好去官网)下载稳定版, 安装完成后

打开命令行 cmd 
```bash
npm -v //查看当前npm 版本，并验证是否安装成功
```

## 新建存储模块文件夹

先在node安装目录下 新建 **node_global** 和  **node_cache** 文件夹  
node_global 是以后npm i -g [name] 安装的目录  
cache 是缓存

## 配置npm config
配置 :

```bash
npm config set prefix  ['node_global模块路径']
npm config set cache   ['node_cache模块路径']
```
备注 : 

```bash
npm config get [proname] //获取对应配置信息
npm config set [proname] .... //配置对应的信息
npm config list //查看全部配置
```
### 以下是配置nodejs环境

#### npm直接配置
```bash
npm config set registry [https://registry.npm.taobao.org
```
#### 安装cnpm(不推荐，一般一些项目的初始化默认npm,无法进行加速)
```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

#### 零时使用 (不推荐)
```bash
npm --registry https://registry.npm.taobao.org install express
```

## 配置环境变量

在电脑找到环境变量, 配置user(用户)环境变量的path将 node_global路径夹入

备注:  
*为了保证Visual Studio Code 能够在终端运行包命令一定要将 VS 的 code.exe 文件夹路径配置成环境变量*

## 自此环境搭建完成