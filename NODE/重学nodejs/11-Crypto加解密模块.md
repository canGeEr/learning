# 11-Crypto加解密模块
Crypto 加密模块是 C／C++ 实现这些算法后，暴露为 javascript 接口的模块，包含对 OpenSSL 的哈希、HMAC、加密、解密、签名、以及验证功能的一整套封装。

## Cipher加解密
> 典型的对称加密            

### AES/ECB/PKCS5Padding 模式
- AES：代表算法
- ECB：代表模式
- PKCS5Padding：代表填充量


### 加/解密：使用一般三步：  
- 创建加密对象
- 加密对象调用加密方法，将需要加密数据进行加密
- 组合输出加密数据

### 使用示例
```javascript
const CryptoJs = require('crypto');

//注意私钥的长度
const key = '1111222233334444' //16位十六进制作为密钥
const iv = 'ABCDEF1234123412' //偏移量

function Encrypt(data) {
  var cipherChunks = [];
  var cipher = CryptoJs.createCipheriv('aes-128-cbc', key, iv);
  cipher.setAutoPadding(true);
  cipherChunks.push(cipher.update(data, 'utf8', 'base64'));
  cipherChunks.push(cipher.final('base64'));
  return cipherChunks.join('');
};


function Decrypt(data) {
  let cipherChunks = [];
  let decipher = CryptoJs.createDecipheriv('aes-128-cbc', key, iv);
  decipher.setAutoPadding(true);
  cipherChunks.push(decipher.update(data, 'base64', 'utf8'));
  cipherChunks.push(decipher.final('utf8'));
  return cipherChunks.join('');
}

module.exports = {
  Encrypt,
  Decrypt
}

```


## MD5加密
> 不可逆，即对原密钥复杂度做一个提升
```javascript
const crypto = require('crypto');
const md5 = str => {
    return crypto.createHash('md5').update(str, 'utf8').digest('hex')
};
// 默认输出长度为32位小写字母
// 25f9e794323b453885f5181f1b624d0b
console.log(md5('123456789')); 
// 以下转换为32位大写字母
// 25F9E794323B453885F5181F1B624D0B
console.log(md5('123456789').toUpperCase());
```