
## tarojs/cli 新架构分析
- tarojs/cli：
	- 配置收集：minimist 收集验证执行参数 => process.env.NODE_ENV 根据watch 决定 => 收集环境变量配置.env文件（后续注入到 definePlugin） => 获取用户配置 config =>  初始化 kernel 调度插件
	- 收集kernel需要调度的插件/预设，doctor 是否存在 => @tarojs/plugin-doctor，不同的command运行指令 => 获取对应的预设 path.resolve(commandsPath, targetPlugin)
	- 匹配对应的command，根据不同的平台platform，收集kernel 对应的插件 @tarojs/plugin-platform-\${platform}；匹配对应的framework，注入对应的插件，比如@tarojs/plugin-framework-\${framework}
	- customCommand 开始执行指令 => 最终调用kernel.run

- tarojs/cli/src/presets/commands/build
	- 检查配置文件，检查平台是否合法
	- applyPlugins，触发onBuildStart（其实可以从这里开始记录时间）
	- applyPlugins，触发platform平台的hooks，预计是平台plugin开始执行
	- appltPlugins，触发onBuildComplete，这里开始记录结束时间

- @tarojs/plugin-platform-weapp
	- 初始化 Weapp 实例program，调用program.start
	- Weapp集成自TaroPlatformBase（来自@tarojs/service）
- @tarojs/service
	- 依次触发setup，build方法
	- setup，清空打包文件夹，生成project.config文件
	- build，调用getRunnder，根据compiler是否为webpack5，判断当前使用@tarojs/webpack5-runner / @tarojs/mini-runner
	- runder 调用

这里讲讲PlatformBase的设计，核心在Transaction（事务）的设计。
允许在调用callback方法的时候，向方法调用 前/后 执行 n 个 事务回调（wrappers），这样就能让外部方法包裹着内部方法，有点像洋葱模型中间件：
```typescript
type Wrapper {
	init: (scope) => void;
	close: (scope) => void;
}
```


## 构建时有哪些依赖
> [Taro3仓库概览](https://docs.taro.zone/docs/codebase-overview)
