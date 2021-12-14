# ansyc

## 它是给函数用的
ansyc function() {
    .....
}

## 对应的await
**await只能在有ansyc标记的函数中使用**  

await针对所跟不同表达式的处理方式：  
Promise 对象：await 会暂停执行，等待 Promise 对象 resolve，然后恢复 async 函数的执行并返回解析值。  
非 Promise 对象：直接返回对应的值。


## 异步文件处理
```javascript
const fs = require('fs');

function getFileAnsyc(url, encodeType){
    return new Promise((reslove, reject)=>{
        fs.readFile(url, encodeType, function(err, data) {
            if(err) reject(err);
            else reslove(data);
        })
    })
}

async function readData() {
    const data1 = await getFileAnsyc('./data1.txt', 'utf-8');
    console.log(data1)
    const data2 = await getFileAnsyc('./data2.txt', 'utf-8');
    console.log(data2)
    const data3 = await getFileAnsyc('./data3.txt', 'utf-8');
    console.log(data3)
}
readData()
```