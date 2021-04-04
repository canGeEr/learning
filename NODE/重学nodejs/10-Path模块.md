# Path模块
path模块主要是为了处理操纵系统的文件路径
```bush
// 注意文件路径的分隔符是"\"
C:\users\joe\file.txt 
//URL资源路径
http://nodejs.cn/learn/nodejs-file-paths
```

## 分割路径
- dirname: 获取参数文件路径的父文件夹
- basename： 获取参数文件路径的文件名部分
    ```javascript
    //如果basename第二个参数存在，则返回文件名去掉后缀
    const notes = '/users/joe/notes.txt'
    path.basename(notes, path.extname(notes)) //notes
    ```
- extname：获取参数文件路径的拓展部分（文件后缀）
- parse：解析对象的路径为组成其的片段
    - root
    - dir
    - base = name = ext
- isAbsolute：是否为绝对路径

## 合成路径
- join： 连接路径，如果每个文件夹或者文件名都需要手动拼接，那得相当麻烦，而且还要做特别多的字段过滤
    ```javascript
    console.log(path.join('user/', '/fuck', '//you', '!'));
    //user\fuck\you\!
    //自动完成拼接、转换、过滤
    ```
- resolve：获取相对路径参数的绝对路径
    ```javascript
    //在e:\nodeDemo下执行index.js脚本
    path.resolve('index.js') // e:\nodeDemo\index.js
    ```
- normalize：解析相对路径字符
    ```javascript
    path.normalize('/nodeDemo/index.js/../') // \nodeDemo\
    ```