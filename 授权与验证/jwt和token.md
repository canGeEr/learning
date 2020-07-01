# Token VS JWT

## JWT 的原理
JWT 的原理是，服务器认证以后，生成一个 JSON 对象，发回给客户端。用户与服务端通信的时候，都要发回这个 JSON 对象。服务器完全只靠这个对象认定用户身份。为了防止用户篡改数据，服务器在生成这个对象的时候，会加上签名（可以使用 HMAC 算法或者是 RSA 的公/私秘钥对 JWT 进行签名。因为数字签名的存在，这些传递的信息是可信的。）。

### 后端node实现
1. **"jsonwebtoken": "^8.3.0"** 包
2. 签名
```javascript
/*
payload 是一个json对象或者是一个可以json化的buffer或字符串 
secretOrPrivateKey是加密的key或者叫做密匙,不知道密匙是无法解析payload参数的.
options 参数 是一个json对象
*/
jwt.sign(payload, secretOrPrivateKey, [options, callback])
```
3. 解析验证
```javascript
/*token: 就是token字符串 由jwt.sign()方法生成的

secretOrPublicKey:是加密的key,用于解析生成token时的payload参数

options: 设置一些解密的方法....
*/
jwt.verify(token, secretOrPublicKey, [options, callback])
```



## Token
流程其实和session差不多，但是token存储到redis中，可以集群处理

## 学习
阮一峰日志
>http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html


傻傻分不清之 Cookie、Session、Token、JWT @秋天不落叶
> https://juejin.im/post/5e055d9ef265da33997a42cc