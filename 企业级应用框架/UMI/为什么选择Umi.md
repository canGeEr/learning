## 资源

- [Umi 4设计思路](https://www.bilibili.com/video/BV1sL4y1b7ca/?spm_id_from=333.337.search-card.all.click&vd_source=0ea13118dff144cdb3dd0608af7fc70c)、[SSE Conf: Umi4 设计思路文稿](https://mp.weixin.qq.com/s?__biz=MjM5NDgyODI4MQ%3D%3D&mid=2247484533&idx=1&sn=9b15a67b88ebc95476fce1798eb49146&poc_token=HLQUHWWjonn2nCwHasoE14U_kD_S46t88wp82n4K)
- [蚂蚁金服前端框架探索之路](https://www.bilibili.com/video/BV1fb411G7pE/?spm_id_from=333.337.search-card.all.click&vd_source=0ea13118dff144cdb3dd0608af7fc70c)
- [前端框架的趋势和实践](https://www.bilibili.com/video/BV17d4y1r7Za/?spm_id_from=333.337.search-card.all.click&vd_source=0ea13118dff144cdb3dd0608af7fc70c)

## 什么是Umi

开箱即用的企业级前端开发框架，基于Webpack的构建应用(Umi4 开始支持 Vite)，集成大型应用**常用的成熟技术方案（最佳实践）**

## Umi诞生的背景

早期“刀耕火种”时代搭建一个完整的大型应用开发架子至少需要
- 打包配置(**Webpack**)，包括但不限于**资源打包**、**代码分割**、**热更新**、**Mock方案**、**兼容性**、**环境配置**（不同环境不同打包策略 **webpack-merge**）
- 技术栈选型，前端框架(**MVVM**)、SPA方案(**Router**)、状态管理(**Store**)、数据请求(**Request**) （特别对于React，社区的技术方案是百家争鸣，容易陷入选择困难）
- 工程化配置，**Eslint**、**Husky**、**ChangeLog**、Stylelint、Prettier、测试Jest
- 融入业务组件，**权限管理**、**国际化**、**布局方案**等等

这套流程长且复杂，每次从头搭建一遍 !!#ff0000 研发效能低!!，但是在开发中慢慢的总结出了一些最佳实践方案，**!!#ff0000 云谦!!**基于插件机制将这些最佳实践方案低耦合的串联在一起最终创作出Umi

<details>
	<summary style="color: red">
		为什么不是脚手架，如果是脚手架你觉得有什么缺点？				</summary>
 	<ol>
		<li>不符合高内聚低耦合的设计思路，如果今天需要更新权限管理相关的代码，但是我们需要更新整个脚手架的版本，改动大，并且衍生的应用同步更新不简单</li>
		<li>
			实现按需使用很难，参数收集膨胀，CLI在模板生成时做大量的条件判断		</li>
	</ol>
</details>

## React应用前端框架对比
> 资料：[Next.js增量静态渲染ISR指南](https://juejin.cn/post/6977783923099041800#heading-9)、[为什么说 Next.js 13 是一个颠覆性版本](https://www.infoq.cn/article/VbDui4DRa2Lhq3h0ad2Z)

| 框架  | [Umi](https://umijs.org/docs/max/request)  | [CRA(Create-React-App)](https://create-react-app.dev/) | [Next.js](https://nextjs.org/) | [Remix](https://remix.run/docs/en/main) |
| :--- | :--- | :--- | :--- | :--- |
| 渲染方式 | CSR \/ SSR \/ SSG | CSR | CSR \/ SSR \/ SSG \/ ISR | CSR / SSR  |
| 内置工程化工具 | Webpack(支持的更好) / Vite | Webpack | Webpack、Turbopack(beta) | Esbuild |
| 内置工程化配置 | 完善 | 完善 | 完善 | 相对简陋 |
| 修改工程化配置 | 简便 | 困难(react-app-rewired customize-cra) | 简便 | 简便 |
| 约定式路由 | 允许 | 不允许 | 允许 | 允许 |
| **插件系统** | !!#ff0000 特有!! | 无 | 无 | 无 |

Next和Remix是全栈框架，但是更注重在服务端渲染的优化，Umi在SSR和SSG都有借鉴Next和Remix（在[为什么不](https://v3.umijs.org/zh-CN/docs#%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E6%98%AF%EF%BC%9F)有提到），而且[SSR 目前还处于实验性特性，不建议在生产环境使用](https://umijs.org/docs/introduce/faq#ssr-%E9%97%AE%E9%A2%98)

## Umi的核心优势

Umi的核心是，确立应用搭建的技术选型（技术收敛）、集成一些最佳实践，围绕这两点Umi有三大特性：

- **插件系统**
- 基于路由
- HTML一等公民

插件的职责是做什么？应该把那部分功能分割成一个Plugin：比如我们选择React做MVVM框架

- 修改Webpack配置，React需要配置对应的热更新插件，Babel开启编译JSX选项等等
- 确立HTML的容器元素#app，获取DOM元素，createRoot().render 初始化

为此，Umi设计出能同时拓展**构建时**和**运行时**代码的插件系统，基于这种模式下，国际化、权限管理、微前端（qiankun）在Umi中都能做到开箱即用，而且没有心智负担、代码整洁

> Umi是编译型框架，在把资源交给构建工具（Webpack）前，先执行Umi内部的script，再接连调用插件用来处理文件和修改配置（给Webpack的配置）

## Umi插件系统
> 资源 [Umi3源码解析系列之插件架构](https://juejin.cn/post/7098588865325334564)，读者需要注意的是下面讲解的都是Umi4，它实现和Umi3略有差别

### [插件能做什么](https://umijs.org/docs/api/plugin-api)
常用包括以下：
- 修改打包配置(modifyWebpackConfig、modifyViteConfig等等)
- 修改启动配(modifyConfig等等)
- 约定目录结构(onGenerateFiles 根据约定式文件名生成文件)
- 修改HTML(modifyHTML)
- 修改运行时逻辑(addRuntimePlugin)

### [插件如何使用](https://umijs.org/docs/guides/use-plugins)
- 初始化UMI项目 pnpm dlx create-umi@latest
- 安装@umijs/plugins，在config里配置对应的插件

```javascript
// .umirc.ts
export default {
  // 加载对应的插件
  plugins: ['@umijs/plugins/dist/dva'],
  // 确定是否启用插件，并且注入插件配置，如果是false表示明确关闭插件
  dva: {}
}
```
启动项目可以看到添加插件之后.umi里面多出一个文件夹，plugin-dva

<details>
	<summary style="color: red">
		为什么需要给插件留一个开关，都配置了插件难道还有不用的时候吗？
	</summary>
 	因为Umi还有预设的概念presets，一个presets可以返回一组插件，React环境所需一套组合Plugins，但是并不使用每个场景，在某个场景不需要dva
</details>

<details>
	<summary style="color: red">
		怎么确定插件使用成功了呢？
	</summary>
 	1.  使用影响运行时的插件，一般会在.umi下生成对应的临时文件
	2.  [按照约定的格式编写代码能够生效](https://v3.umijs.org/zh-CN/plugins/plugin-dva)
</details>

### [插件如何开发](https://umijs.org/docs/guides/plugins)

```typescript
import { IApi } from 'umi';
export default (api: IApi) => {
  // 向config注册配置
  api.describe({
    // config 配置的名称
    key: 'dva',
	// 配置的类型
    config: {
	    schema({ zod }) {
        return zod
          .object({
            extraModels: zod.array(zod.string()),
            immer: zod.record(zod.any()),
            skipModelValidate: zod.boolean(),
          })
          .deepPartial();
      },
    },
	// 确定启动方式：自动启动 / config配置启动
    enableBy: api.EnableBy.config
  });
  // 注册hook，当umi执行流程触发modifyConfig Hook的时候会调用方回调函数
  api.modifyConfig((memo)=>{
	// import from dva
    memo.alias['dva$'] = pkgPath;
    return memo;
  });
};
```

### 了解[@umi/plugin-dva](https://github.com/umijs/umi/blob/master/packages/plugins/src/dva.ts)
> 什么是[dva](https://dvajs.com/)，dva-core集成了redux 和 redux-saga 简化了繁琐代码，dva 结合 React-Router封装了start和router方法，简化了 dva-core 初始化、挂载App函数等过程

我们先看下[dva的官方用例](https://dvajs.com/guide/examples-and-boilerplates.html)，可以看到几乎没有dva初始化的过程代码，怎么做到的？

封装在start和router两个方法里 => [dva/index](https://github.com/dvajs/dva/blob/master/packages/dva/src/index.js#L96C95-L97C3)，start方法对开发者屏蔽了初始化代码操作

[@umi/plugin-dva](https://github.com/umijs/umi/blob/master/packages/plugins/src/dva.ts) 是如何工作的？
- api.describe为config配置注册
- getAllModels 收集所有合法的model.ts文件 => **models**
- 修改appData，注入models，允许开发者通过useAppData访问到所有的models
- 注册 **onGenerateFiles** hook，在.umi的plugin-dva生成模板文件，注意.umi/plugin-dva/models生成信息包括 **models**
- 注册 **addTmpGenerateWatcherPaths** hook，把所有的models文件添加到watch监听文件变化
- 注册 **addRuntimePlugin** hook，运行时修改代码，执行dva初始化逻辑
- registerCommand 在控制台输出当前注册的model信息

### 插件是怎么运作的

### Umi构建时插件做了什么
> [插件的生命周期](https://umijs.org/docs/guides/plugins#umi-%E6%8F%92%E4%BB%B6%E7%9A%84%E6%9C%BA%E5%88%B6%E5%8F%8A%E5%85%B6%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)

这里我们通过npm run start指令来debuger，看看Umi的大致执行过程：

1. npm run start => umi dev，找到 node_modules/bin的umi执行，调用 umi/bin/umi.js
2. 进入cli指令（umi/src/cli/cli）执行run方法，在run中有初始化 **Service** 实例（集成@umijs/core 中的Service）这里指定了默认的plugins（src/plugin.js）和presets（@umijs/preset-umi），也是调用run方法
3. service.run真正调用开始，进入**插件生命周期系列**，这里只说几个重要的
	- 插件注册阶段：插件的注册顺序决定了注册的hooks在被调用的时候的顺序，Umi保持从做往右，先遇到先注册的顺序 这对 plugins来说很简单，但是presets可以返回plugins和presets。具体的做法是：其中 presets 将添加到 presets 队列的队首，而 plugins 将被添加到 plugins 队列的队尾；先一次注册完所有的presets，并收集了plugins，再注册所有的plugins
	- runCommand阶段：最终调用service.commands[name]()，commands是从哪里来的？插件API registerCommand 可以向service.commands 注册对应的指令和执行方法
4. 对于umi dev真正执行的是dev command，在preset-umi/src/commands/dev/dev.ts，执行fn回调
	- 清理删一次的.umi临时文件夹
	- 触发onCheckPkgJSON、onGenerateFiles、addTmpGenerateWatcherPaths 等等 Hooks 生成临时文件
	- 触发addBeforeMiddlewares、addMiddlewares、chainWebpack、modifyWebpackConfig、modifyViteConfig 等等 Hooks 收齐打包工具的配置信息
	- 触发modifyEntry，修改入口文件
5. 组装获取到的配置成opts，交给 bundlerVite / bundlerWebpack


**小结：Umi在Webpack/Vite启动前做了什么**
1. 初始化预设presets，初始化插件plugins
2. 触发对应的hooks，生成临时文件及配套文件 src/.umi
3. 把插件中约定的文件添加到watch，修改之后热更新，重新生成临时文件
4. 中间件中 修改HTML结构
5. 有些插件可以影响构建流程，比如babel/middlewares等插件会将生成的配置丢给webpack/vite

### Umi运行时插件做了什么
我们拿到src/.umi文件夹的入口.umi文件开始看，核心方法在render的调用：
- createPluginManager 创建插件管理器，并注册好所有的插件（所有的插件的runtime.tsx在构建时被加载到core/plugin.ts中）
- 收集routes信息（构建时生成的core/route.tsx）
- 触发patchRoutes、modifyContextOpts等hook
- createHistory 创建React历史记录对象
- 调用render插件，真正在执行plugin的地方在initialValue的 **renderClient**
- renderClient 是在 renderer-react 这个包下，里面有调用所有的注册插件

概念有点抽象？本质上上一次Plugin返回的结果ReactElement，作为下一次Plugin的children节点渲染
```jsx
// 假设经历插件 plugin-dva、plugin-model，初始化的 initialValue 为组装好的 
let initialValue = <BrowserRoutes />
// 调用 plugin-dva 插件
initialValue = (
	<DvaProvider value={app._store}>
		<BrowserRoutes />
	</DvaProvider>
)

// 调用 plugin-model
initialValue = (
	<ModelProvider>
		<DvaProvider value={app._store}>
			<BrowserRoutes />
		</DvaProvider>
	</ModelProvider>
)
```
- 最终，[renderClient](https://github.com/umijs/umi/blob/master/packages/renderer-react/src/browser.tsx) 调用 ReactDOM.createRoot(rootElement).render 渲染


## Umi还做了什么

- 构建依赖（Webpack、Babel）预打包，让你的应用10年之后还能运行
- 构建提速三包：Native Code（ESbuild、SWC）、缓存、延时处理（MFSU）
- 基于路由
	- 约定式路由 + 可配置式
	- 自动懒加载完成代码分割
	- 按需编译
	- 标题切换、埋点入口（暴露监听路由变化的方法）
	- clientLoader 路由数据加载

## 我们能用Umi做什么
> 蚂蚁在内部的框架Bigfish就是基于Umi开发了一套umi-plugin-bigfish插件预设，服务于各个业务场景

- 如果团队喜欢用Redux + Redux Toolkit，我们可以尝试写一个类似 @umi/plugin-dva 的插件，屏蔽初始化集成代码，并约定目录下的 slice.js 是 createSlice 单个数据流管理文件
- Umi 插件在React、Webpack的实践更多，我们可以尝试针对Vue、Vite发力，比如四力里面有一套成熟的权限控制，可以尝试写一个类似的 @umi/plugin-access插件，输出对应的Vue组件
- 我们可以基于集成监控插件，启动时自动生成aegisId（参考[Aegis 开放API](https://aegis.woa.com/open-api/#%E9%A1%B9%E7%9B%AE%E7%9B%B8%E5%85%B3)），插件中也自动生成aegis SDK接入的初始化代码

Umi的核心是通过插件化集成开发的最佳实践，因此我们可以基于Umi开发一些适合业务中自己的插件集/预设集


