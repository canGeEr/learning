> 当前文章是写入2023-10-18，以下信息都是father4.x的功能

## [Father.js](https://github.com/umijs/father)
father 是一款 NPM 包研发工具，相对于webpack和rollup开发npm包更加便捷，心智负担更小

## 基于 Webpack5
- 双模式构建：支持 Bundless 及 Bundle 两种构建模式，ESModule 及 CommonJS 产物使用 Bundless 模式，UMD 产物使用 Bundle 模式，优先 **Bundless**
- 自动开启缓存
- 双模式构建：支持 Bundless 及 Bundle 两种构建模式，ESModule 及 CommonJS 产物使用 Bundless 模式，UMD 产物使用 Bundle 模式，优先 **Bundless**

## 优化开发流程
- src/cli/cli.ts： run 方法执行，检查环境，收集参数，new Service.run
- [发布指南](https://github.com/umijs/father/blob/master/docs/guide/release.md)：优化发布流程
- CoreService 继承于 @umijs/core 的 CoreService，关键点在于实例化的时候注册了 src/preset.ts 一组预设

## father dev 发生了什么
针对father包源码
- src/cli/cli.ts： run 方法执行，检查环境，收集参数，new Service.run
- src/commands/dev：registerCommand 配置的 回调 fn 执行：builder 做一次构建， 监听src

至此，可以看出father.js支持插件机制，具体执行 dev 这个command 指令，那肯定是某个plugin执行了[registerCommand](https://umijs.org/docs/api/plugin-api#registercommand)

- 根据配置确定是否为 Bundless / Bundle，如果是 Bundless 那么使用 @umijs/bundler-webpack 使用 webpack 打包（**值得注意的是，father允许同时支持boundless和boundle，也就是双构建**）
- src/commands/dev：registerCommand 配置的 回调 fn 执行：builder 做一次构建， 监听src
- 内容的变化，同时监听配置的变化重新构建
- 根据配置确定是否为 Bundless / Bundle，如果是 Bundless 那么使用 @umijs/bundler-webpack 使用 webpack 打包
- 执行script的指令build，发现生成dist文件，存在esm目录，使用的boundless模式

## 示例项目打包@shepijcanwu/custom-math
- 通过create-father初始化一个项目 my-father-project
- 更新src内容：
```typescript
export const Math = {
  sub(a: number, b: number) {
    return a - b
  },
  add(a: number, b: number) {
    return a + b
  },
  multi(a: number, b: number) {
    return a * b
  },
  div(a: number, b: number) {
    return a / b
  }
}
```
- 执行script的指令build，发现生成dist文件，存在esm目录，使用的boundless模式
- 更新.fatherrc.ts，新增umd导出模式，dist文件夹下多出来umd目录，是使用webpack打包的结果
```typescript
import { defineConfig } from 'father';

export default defineConfig({
  esm: {},
  // 新增umd导出模式
  umd: {
    entry: 'src/index'
  }
});
```
- npm login 输入对应的用户名和token灯笼裤
- npm publish，发布npm包之前自动执行 prepublishOnly 指令：对项目进行检查和构建
