# VSCode 下怎么配置 eslint 对 js 和 ts 的校验

> 实现的功能：当前工作区保存文件时，自动的对 js 或者 ts 文件进行 eslnt 校验和恢复（依据当前最外层目录下的配置文件）

## VSCode

- 需要下载 ESlint 插件（不需要 TSlint 与它无关）
- 配置 ESlint 插件在 VSCode 的运行时机

```json
"editor.codeActionsOnSave": { //在编辑器进行保存的动作时
	"source.fixAll.eslint": true, //fix表示修复，自动修复所以的eslint问题（尽量）
},
```

## 当前项目校验 JS

```bush
eslint --init （但是需要全局下载eslint包；也可以npm install eslint -D 然后 npx eslint --init）
```

执行该命令是为了生成**ESlint 插件**在校验时读取的配置文件，.eslintrc.js/json 等等。

> 如果没有该配置文件，ESlint 相当于没有规则读入，自然表现的像“没有做任何事情”

此时，你在工作区编辑代码并保存时，ESLint 插件自动的读入最近的（离该文件）的 eslint 配置文件，根据配置文件进行校验（进而提示）和修复

## 当前项目校验 TS

同校验 TS 的原理，但是校验 TS 不需要 VSCode 下载额外的插件，只需要对 eslint 的配置文件做一些扩展和配置（eslint 的插件）

```js
module.exports = {
  env: {
    browser: true,
  },
  extends: ["standard"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {},
};
```

上面的配置文件也看出来了，我们需要两个包：

```bush
npm i @typescript-eslint/parser @typescript-eslint -D
```

> 本质上依然时 ESlint 插件校验的 TS，只不过在那之前会调用 parser 包先进行解析，再通过@typescript-eslint 扩展功能。还有类似的就是 React 和 Vue 的 eslint 校验都是类似的

## tsconfig.json 无法找到

> tsconfig.json 如果不是在工作目录的最外层，那么可能会扫描失败

如果你的 problems 那栏报错：

```bush
Parsing error: Cannot read file 'e:\first-project\tsconfig.json'.eslint
```

请在你的.eslintrc.js/json 等 eslint 配置文件，添加以下代码：

```json
parserOptions: { //parserOptions 选项添加
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname, //这个__dirname + project的路径即 path.reslove(__dirname, project)需要为tsconfig.json的路径
    sourceType: 'module',
}
```
