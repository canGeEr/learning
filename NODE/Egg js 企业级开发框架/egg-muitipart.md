# egg-multipart 文件上传

## File 模式
> 如果你完全不知道 Nodejs 中的 Stream 用法，那么 File 模式非常合适你（**但是不推荐**）

1. config 配置
```javascript
// config/config.default.js
exports.multipart = {
  mode: 'file',
  //上传文件白名单
  whitelist
};
```

2. 接受文件参数
```javascript
  const file = ctx.request.file[0];
  const filename = file.filename;
  // file ["encoding", "mime"]
  //fullPath 文件要存储路径 file.filepath文件缓存路径
  fs.writeFileSync(fullPath, fs.readFileSync(file.filepath));
  ctx.cleanupRequestFiles();
```

## Stream流方式
1. config 配置
```javascript
// config/config.default.js
exports.multipart = {
  mode: 'stream',
  //上传文件白名单
  whitelist
};
```


2. 单文件上传
```javascript
//获取文件流
let stream = await ctx.getFileStream();
//创建文件名
const filename 
//文件生成绝对路径
//当然这里这样市不行的，因为你还要判断一下是否存在文件路径
const target = path.join(this.config.baseDir, 'app/public/uploads', filename);
//生成一个文件写入 文件流
const writeStream = fs.createWriteStream(target);



////////////////方案一
//故名思意 异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write;
//管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');
try {
    //异步把文件流 写入
    await awaitWriteStream(stream.pipe(writeStream));
} catch (err) {
    //如果出现错误，关闭管道
    await sendToWormhole(stream);
    throw err;
}

////////////////方案二
const pump = require('mz-modules/pump');
await pump(stream, writeStream);
```