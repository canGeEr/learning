# vue的初步配置及其扩展
## 配置打包环境
1. 在**build**目录下的**utils.js**大约**51**行 *(版本请参考vue-cli入门)*  
```javascript
if (options.extract) {
  return ExtractTextPlugin.extract({
    use: loaders,
    fallback: 'vue-style-loader'
    publicPath: '../../' // + 
  })
} else {
  return ['vue-style-loader'].concat(loaders)
}
```
2. 在**config/index.js**大约**54**行  

```javascript
assetsRoot: path.resolve(__dirname, '../dist'),
assetsSubDirectory: 'static',
assetsPublicPath: './', //改 不改会白屏(可能)
```
3. 在**build/webpack.base.conf.js**的大约29行
```javascript
//在其它编辑器可能失效
alias: {
  'vue$': 'vue/dist/vue.esm.js',
  '@': resolve('src'),
  //配置到 ‘components’ 的路径具体字符可按自己喜欢配置
  '@componets': resolve('src/components),
  '@router': '' ;//省略
}
```

4. 以上的alias路径配置只有在转化为node依赖(在html里的src请求)(*靠node解析才有用*)因此多用于嵌套组件的引入  
> 我一般会用img代替背景图片去省略长路径


## 扩展
备注: 根据个人喜好建立(在src下)文件夹以整理资源
### pages
存放单页型组件
### service / api
把所有的数据接口导出为方法，以便使用
### mock
模拟数据  *参考vue-mockjs使用文档*
### store
状态管理
### utils
一些杂乱的插件或组件的整理
存放axios文件配置