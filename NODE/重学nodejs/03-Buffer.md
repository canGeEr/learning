# 03-Buffer 缓冲区

## Buffer诞生的原因
- 作为后端服务，操作一些文件需要使用二进制数据，但是数组和字符串保存不了二进制数据
- 数组和字符串的性能太差（读取，操作）

## 创建Buffer
- new Buffer(bufferLength) 废弃了，因为性能不好
- Buffer.from(string | array) 将参数转换为buffer
- Buffer.alloc(size, [fill, encoding]) 分配一个size大小的buffer，并以fill填充，如果fill是字符串，则解析规则以encoding为准
- Buffer.allocUnsafe(size) 也是分配空间，但是没有初始化（所以可能不安全，但是比Buffer.alloc新能好）


## Buffer啥样的
```javascript
console.log(Buffer.from('aa'))
//<Buffer 61 61>
```
buffer默认对字符串使用utf-8编码格式转换，buffer的单位是字节，即8位，存储的数据就是0-255

## Butter和数组很类似，是可迭代类型
```javascript
var buffer = Buffer.from('aa')
for(let i=0; i<buffer.length; i++) {
    console.log(buffer[i])
}

for(let bfer of buffer) {
    console.log(bfer)
}
```

