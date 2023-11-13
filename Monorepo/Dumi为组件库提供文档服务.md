## 什么是Dumi
本质上提供静态稳定站点搭建能力，优势
- 提供MD文件引用并识别React组件的服务，特别适合组件库为组件提供demo示例
- 基于上面一点，使用约定式路由，root/src下的路径对应路由，加载对应的xxx.md文件作为页面内容展示
- 抽象页面渲染配置，拓展MD标识符，比如 title 代表标题，features是多列表块功能描述

## [如何使用](https://d.umijs.org/guide/initialize)
通过脚手架指令初始化，如果选择React Library，那么提供father.js打包src资源的能力
- build：father 打包当前src下资源，可以将当前仓库发布为NPM包
- build:watch：father dev，监听资源重新build
- dev: 启动dumi服务，dumi识别约定式路由配置，为NPM包提供本地文档服务
- docs:build：构建生产环境下的文档服务文件
- lint等等其它规范校验指令

Dumi本质上是umi的二次封装，专门提供静态站点文档生成能力，因此允许umi配置格式进行配置，比如.umirc.ts、config/index.ts 等等文件都能生效，并修改服务配置

## 如何为Monorepo提供文档服务
脚手架选择React Library只是简单的为单个NPM包提供服务，多NPM包应该如何组织代码呢？

- pnpm-workspace.yaml设置 src/\* 为 packages
- 比如hooks，hooks目录通过create-father类似指令创建，最终为了适应dumi的约定式路由文件，我们需要修改对应的README.md文件即可表示npm包对应的文档
- 如果你想细分hooks/src/xxx不同文件对应不同文档，可以通过 resolve 配置 **docDirs**、**atomDirs**、**conventionRoutes.exclude** 等等修改识别约定式路由的配置
