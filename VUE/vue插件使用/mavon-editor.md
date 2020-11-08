# mavon-editor
mavon-editor不错的编辑器，不过不普遍适应于用户，只是写一些博客会比较好用（比较火，但并不流行）

## 安装
```bush
$ npm install mavon-editor --save
```
> 全局注册
```javascript

// import with ES6
import Vue from 'vue'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// use
Vue.use(mavonEditor)
//这里直接全局注册，但我并不推荐·这种用法，应为会加长首页进入的时间
new Vue({
    'el': '#main',
    data() {
        return { value: '' }
    }
})
```

> 组件引入
```javascript
<template>
    <div id="editor">
        <mavon-editor style="height: 100%"
            
        ></mavon-editor>
    </div>
</template>
<script>
// Local Registration
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    name: 'editor',
    components: {
        mavonEditor
        // or 'mavon-editor': mavonEditor
    }
}
</script>
<style>
#editor {
    margin: auto;
    width: 80%;
    height: 580px;
}
</style>
```

## 写
默认是可以读写编辑，但只读的话看下一段。  
数据绑定用 v-model

## 读
默认大小样式为 min-height: 300px , min-width: 300px 可自行覆盖  
基础z-index: 1500  
仅用作展示可以设置props传入: toolbarsFlag: false , subfield: false, defaultOpen: "preview"  
(注意要JS的false和true不然接收到的是字符串)


## 处理事件

处理事件可以分发布和修改，两者在一些方面处理显得不同  
注意: (即使一次点击选择多张，该方法也是一次一次的调用，所以不存在多文件上传)
### 发布 
组件基础: 
```javascript
{
  images: [], //默认这是要全部上传的
  value: ''
}
```
1. 如果添加文件（图片），后端返回路径（到项目名），手动加上API路径，生成完整路径，调用方法，生成UI,
2. 删除文件，获取图片路径名（上面拼接的即是），返回后端删除图片，(自动做的： 正则匹配替换 value的路径),删除images里的对应路径
3. 假设点击发布: 正则匹配检查value中是否仍然含有 images中的路径字符，如果匹配不到那么触发 和 ‘2’情况下的删除图片反式
4. 假设没有点击发布而是跳转或其他销毁页面，则触发 钩子函数destroy,将images传给后端删除全部

### 修改

//exitImages = []  接受本来的图片
1. 修改大部分和发布相同，由于它本身就有自己的图片记录（已经上传）
(
  用户删除了已经上传的图片路径的字符,
)
因此，在点击修改时，也要正则匹配，是否删除图片


## 一些小细节，在处理这些问题的时候需要注意
1. 前后端在交流传送的东西尽量一致性，
2. 后端接受的东西一般都是字符串，只有经过转换后才可用列 : true -> 'true'