# FS基操



## 创建目录
**fs.mkdir([path], [options], [callback])**
```javascript
option = {
    recursive //<boolean> 默认值: false。
    mode //<integer> Windows 上不支持。默认值: 0o777。
}
```




## 删除目录
**fs.rmdir([path], [options], [callback])** （当前时间为2020/1/14递归删除不稳定)
```javascript
option = {
    emfileWait //<integer> 如果遇到 EMFILE 错误，则 Node.js 将会在每次尝试时以 1 毫秒的线性回退重试该操作，直到超时持续时间超过此限制。 如果 recursive 选项不为 true，则忽略此选项。默认值: 1000。
    maxBusyTries //<integer> 如果遇到 EBUSY、 ENOTEMPTY 或 EPERM 错误，则 Node.js 将会在每次尝试时以 100 毫秒的线性回退等待重试该操作。 此选项代表重试的次数。如果 recursive 选项不为 true，则忽略此选项。默认值: 3。
    recursive //<boolean> 如果为 true，则执行递归的目录删除。在递归模式中，如果 path 不存在则不报告错误，并且在失败时重试操作。默认值: false。
}
```


## 读路径下目录
**fs.readdir([path], [options], [callback])**
```javascript
option = {  
    encoding //<string> 默认值: 'utf8'。
    withFileTypes //<boolean> 默认值: false。
}
如果 options.withFileTypes 设置为 true，则 files 数组将包含 fs.Dirent 对象。
```

### **fs.Dirent**
```javascript
fs.
dirent.isDirectory() //是否是目录
dirent.isFile()      //是否是文件
dirent.name          //名称
```



## 写文件(包括了新建文件)
**fs.writeFile([filename], [data],[options], [callback])**
```javascript
option = {
    encoding //<string> | <null> 默认值: 'utf8'。
    mode //<integer> 默认值: 0o666。
    flag //<string> 参阅支持的文件系统标志。默认值: 'w'。   
}
```



## 读文件
**fs.readFile([path], [option], callback)**
```javascript
//注意这个
option= {  
    encoding    //<string> | <null> 默认值: null。  如果为指定返回buffer
    flag        //<string> 参阅支持的文件系统标志。默认值: 'r'。  
}
```



## 删除文件
**fs.unlink([path], [callback])**





## 一些其他的操作
1. 检测路径是否存在
**fs.stat(path[, options], callback)**
```javascript
option = {
    bigint //<boolean> 返回的 fs.Stats 对象中的数值是否应为 bigint 型。默认值: false。
}
```

> 当 flag 选项采用字符串时，可用以下标志：

'a' - 打开文件用于追加。如果文件不存在，则创建该文件。

'ax' - 与 'a' 相似，但如果路径已存在则失败。

'a+' - 打开文件用于读取和追加。如果文件不存在，则创建该文件。

'ax+' - 与 'a+' 相似，但如果路径已存在则失败。

'as' - 以同步模式打开文件用于追加。如果文件不存在，则创建该文件。

'as+' - 以同步模式打开文件用于读取和追加。如果文件不存在，则创建该文件。

'r' - 打开文件用于读取。如果文件不存在，则出现异常。

'r+' - 打开文件用于读取和写入。如果文件不存在，则出现异常。

'rs+' - 以同步模式打开文件用于读取和写入。指示操作系统绕过本地的文件系统缓存。

这对于在 NFS 挂载上打开文件时非常有用，因为它允许跳过可能过时的本地缓存。 它对 I/O 性能有非常实际的影响，因此除非需要，否则不建议使用此标志。

这不会将 fs.open() 或 fsPromises.open() 转换为同步的阻塞调用。 如果需要同步的操作，则应使用 fs.openSync() 之类的。

'w' - 打开文件用于写入。如果文件不存在则创建文件，如果文件已存在则截断文件。

'wx' - 与 'w' 相似，但如果路径已存在则失败。

'w+' - 打开文件用于读取和写入。如果文件不存在则创建文件，如果文件已存在则截断文件。

'wx+' - 与 'w+' 相似，但如果路径已存在则失败。