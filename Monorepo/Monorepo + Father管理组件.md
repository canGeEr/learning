## 一、私有化仓库
根目录下package设置private为true，防止发布当前仓库

## 二、[声明NPM包](https://pnpm.io/pnpm-workspace_yaml) 
创建pnpm-workspace.yaml文件，声明npm包匹配规则
- packages/\*，文件夹下的直属子目录
- components/\*\*，文件夹下的所有子目录
- \!\*\*\/test\/\*\*，排除对应的文件夹

## 三、配置规范化文件
- eslint、prettier、stylelint
- cd packages，npx create-father **hooks**
- husky、lint-stage

## 四、创建NPM包文件
- cd packages，npx create-father **hooks**
- cd packages，npx create-father **utils**

这里可以尝试简化创建过程，因为
- 大部分时候文件名就决定了包名称
- 作者名是一致的，可以使用root的package的author
- description和npm配置可以统一配置
- 可能还需要动态写入script

基于以上：
- ~~在root添加script~~：cd packages & npx create-father $dir，很遗憾 create-father 指定cwd目录创建，其次每次 create-father启动器需要开发者交互形式输入参数，麻烦
- 在create.js中实现run方法，写入所有的参数data，同样执行 new BaseGenerator，并安装依赖

基于第二点思路，我们做了什么：
- 看完create-father代码，发现逻辑蛮简单的
	- 在create.js中实现run方法，通过prompts收集data，同样执行 new BaseGenerator，并安装依赖
	- 安装依赖
- 在create.js中实现run方法，约定data.json（约定式），然后同 create-father 动态生成文件

## 五、PNPM 相关指令
- install：当前仓库和所有的packages（**pnpm-workspace.yaml声明**）依赖安装
- --filter npm_package_name：执行指令时过滤对应的包名（注意一般参数尽量写在前面）
```bush
// --filter 等等pnpm的参数尽量前提
pnpm --filter @author/package_name run build
```
- --recursive, -r：所有的packages，依次执行对应的指令
```bush
// 依次执行所有npm包的dev script
pnpm -r run dev
```

## 六、Lerna自动解套依赖
lerna能识别packages之间的依赖关系，因此在包发布的时候，两种可选模式：
- 全量：所有packages都更新到一个目标版本
- 自动寻找发布：找到依赖的入口package先发布更新版本，其它依赖该package的NPM包更新对应的依赖，并发布自己，依次递归

## 七、集成对应的发布日志工具