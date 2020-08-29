# Buffer 

## 一、为什么需要buffer
Buffer如其名字，作为一个缓冲作用
- 在传统上仅处理字符串而不是二进制文件的生态系统中，引入了缓冲区以帮助开发人员处理二进制数据
- **缓冲区与流紧密相连**。当流处理器接收数据的速度快于其消化速度时，它将数据放入缓冲区。
- 缓冲区的简单可视化是红线超出了可视化点：您下载数据的速度比查看数据的速度快，并且浏览器会对数据进行缓冲。

## 二、操作Buffer
> buffer 就和数组很想，可以直接操作数组一般
### 1. 创建
使用创建的缓冲区Buffer.from()，Buffer.alloc()和Buffer.allocUnsafe()方法

### 2. 访问
```javascript
const buffer1 = Buffer.from('wczix')

console.log(buffer1[0])         // [] 访问

console.log(buffer1[0].length)  // length 属性

for (const item of buf) {       //迭代器
  console.log(item) 
}

buffer1.slice(0)                //切片复制

buffer1.write('wcsp')           //重写内容，注意是重写，覆盖
```
