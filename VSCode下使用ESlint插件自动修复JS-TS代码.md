# VSCode下怎么配置eslint对js和ts的校验
> 实现的功能：当前工作区保存文件时，自动的对js或者ts文件进行eslnt校验和恢复（依据当前最外层目录下的配置文件）

## VSCode		
- 需要下载ESlint插件（不需要TSlint与它无关）
- 配置ESlint插件在VSCode的运行时机
```json
"editor.codeActionsOnSave": { //在编辑器进行保存的动作时
	"source.fixAll.eslint": true, //fix表示修复，自动修复所以的eslint问题（尽量）
},
```
## 当前项目校验JS
```bush
eslint --init （但是需要全局下载eslint包；也可以npm install eslint -D 然后 npx eslint --init）
```
执行该命令是为了生成**ESlint插件**在校验时读取的配置文件，.eslintrc.js/json等等。
> 如果没有该配置文件，ESlint相当于没有规则读入，自然表现的像“没有做任何事情”

此时，你在工作区编辑代码并保存时，ESLint插件自动的读入最近的（离该文件）的eslint配置文件，根据配置文件进行校验（进而提示）和修复

## 当前项目校验TS
同校验TS的原理，但是校验TS不需要VSCode下载额外的插件，只需要对eslint的配置文件做一些扩展和配置（eslint的插件）
```js
module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
  }
}
```
上面的配置文件也看出来了，我们需要两个包：		
```bush
npm i @typescript-eslint/parser @typescript-eslint -D
```
> 本质上依然时ESlint插件校验的TS，只不过在那之前会调用parser包先进行解析，再通过@typescript-eslint扩展功能。还有类似的就是React和Vue的eslint校验都是类似的



## tsconfig.json无法找到
如果你的problems那栏报错：
```bush
Parsing error: Cannot read file 'e:\first-project\tsconfig.json'.eslint
```
请在你的.eslintrc.js/json等eslint配置文件，添加以下代码：
```json
parserOptions: { //parserOptions 选项添加
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname, //这个__dirname + project的路径即 path.reslove(__dirname, project)需要为tsconfig.json的路径
    sourceType: 'module',
}
```