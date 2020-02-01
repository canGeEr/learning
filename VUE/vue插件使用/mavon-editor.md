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
        <mavon-editor style="height: 100%"></mavon-editor>
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
在这里只说一下关于图片上传和删除：  
为了完成这一功能必须先数据绑定一个 images 数组, 数组的元素是对象，对象记录的操作过的图片的路径和状态(是否删除)
```javascript
//添加 这里注意，即使一次点击选择多张，该方法也是一次一次的调用，所以不存在多文件上传
$imgAdd(pos, $file) {
  var formdata = new FormData();
  formdata.append("image", $file);
  Axios.fileUpload("api/article/saveImage", formdata)
    .then((data) => {
      this.images.push({
        path: data.path,
        legal: true
      });
      this.$refs.md.$img2Url(pos, "http://192.168.1.105:7001/" + data.path);
    })
    .catch(err => {
      console.log(err);
    });
},
$imgDel(file) {
  //万一上传文件失败，侧无效,现在能确认是整数，其它另外,这里的filePath就是上面替换的路径
  if (typeof file[0] !== "number") {
    const path = file[0].replace(/http:\/\/192\.168\.1\.105\:7001\//, "");
    const index =  this.images.findIndex((item, index)=>{
        return item.path === path
    });
    this.$set(this.images[index], 'legal', false)
  } else {
    this.$Notice.warning({
      title: "警告",
      desc: "您的文件上传未成功，或者功能无效，导致删除无意义",
      duration: 2.5
    });
  }
}
```


## 一些小细节，在处理这些问题的时候需要注意
1. 前后端在交流传送的东西尽量一致性，
2. 后端接受的东西一般都是字符串，只有经过转换后才可用列 : true -> 'true'