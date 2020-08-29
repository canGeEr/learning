# Stream

## 可读流
```javascript
const fs = require('fs')
const reader = fs.createReadStream(filename) //读管道
reader.on('data'), (data)=>{

})

reader.on('end'), ()=>{

})

const writer = fs.createWriteStream(filename) //读管道
writer.on('pipe'), (data)=>{

})
writer.on('unpipe'), ()=>{

})

reader.pipe(writer)
```