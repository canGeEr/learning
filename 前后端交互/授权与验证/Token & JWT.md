# Token and JWT
> 主要参考文章  
@秋天不落叶     
[傻傻分不清之 Cookie、Session、Token、JWT](https://juejin.im/post/5e055d9ef265da33997a42cc)    
阮一峰日志    
[JWT](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)

## Token（令牌）
什么是token **=>** 访问资源接口（API）时所需要的资源凭证    
最为突出的两个特点就是：  
1. 服务端无状态化、可扩展性好
2. 支持移动端设备
3. 支持跨程序调用

### (1) token的验证流程
<image src="https://user-gold-cdn.xitu.io/2019/12/29/16f523a04d9c745f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" />

1. 客户端使用用户名跟密码请求登录
2. 服务端收到请求，去验证用户名与密码
3. 验证成功后，服务端会签发一个 token，（这个token可以存储在数据库要进行验证） 并把这个 token 发送给客户端
4. 客户端收到 token 以后，会把它存储起来，比如放在 cookie 里或者 localStorage 里
5. 客户端每次向服务端请求资源的时候需要带着服务端签发的 token
6. 服务端收到请求，然后去验证客户端请求里面带着的 token ，如果验证成功，就向客户端返回请求的数据

### (2) token的特性
1. 每一次**鉴权**（只有需要访问权限）请求都需要携带 token
2. 基于 token 的用户认证是一种**服务端无状态的认证方式**，**服务端不用存放 token 数据**。**用解析 token 的计算时间换取 session 的存储空间**，从而减轻服务器的**内存**压力（仍然可能需要和服务器数据库或其它服务（redis等）配合）
3. token 完全由应用管理，所以它可以避开同源策略（ajax，可跨域）

### (3) token 真正了解
  1. 如果你真正了解了什么叫检验权限，那你可能已经有一定的理解了。session和cookie都是对资源权限的访问的本人的 **指纹** ，那么token是 **钥匙** 一样的东西。token给了谁，谁就要资格访问数据权限，但是指纹只能房主本人身上（这也是为什么说token是解决跨程序调用，单点登入，授权其它软件的解决方案）。如果你的 **门** 是两张方式都可以用的话，不久共存了吗。    
  2. 作为一个需要跨程序，支持移动设备，那其实用session的意义已经不大了，即是web，不如直接用token鉴权，那自然客户端就不会用cookie，只是直接用localStorage存储就可
  3. session实现是通过内存实现的，因此当用户足够大时有性能问题（当然可以通过外部存储redis解决），那token是怎么解决
  4. token是在后端签发，一般存储在数据库以便验证（当客户端鉴权请求时，携带token，需要根据请求数据验证token），后端会将user对应一个token（也可以另外建表，最好另外建表，可能需要保存token的有效时间），通过用户信息查询数据库，再对比token就知道鉴权是否成功。
  5. **token的实质要求就是一个不能重复的字符串**，可以自己生成，可以利用社区资源包


### (4) JWT（JSON Web Token 一种token通信方式标准）
> **JWT 的原理是**，服务器认证以后，生成一个 JSON 对象（token），发回给客户端。用户与服务端通信的时候，都要发回这个 JSON 对象。服务器完全只靠这个对象认定用户身份。为了防止用户篡改数据，服务器在生成这个对象的时候，会加上签名（可以使用 HMAC 算法或者是 RSA 的公/私秘钥对 JWT 进行签名。因为数字签名的存在，这些传递的信息是可信的。

#### 1. 特性
1. JSON Web Token（简称 JWT）是目前最流行的跨域认证解决方案。
2. 是一种认证授权机制。
3. JWT 是为了在网络应用环境间传递声明而执行的一种基于 JSON 的开放标准（RFC 7519）。JWT 的声明一般被用来在身份提供者和服务提供者间传递被认证的用户身份信息，以便于从资源服务器获取资源。比如用在用户登录上。
4. 可以使用 HMAC 算法或者是 RSA 的公/私秘钥对 JWT 进行签名。因为数字签名的存在，这些传递的信息是可信的
5. 最大的特点就是通过加密解密方式在控制层就能签发或者验证token，无需将token存储，实现真正的减轻服务器压力。


#### 2. 后端node实现
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

3. 完整：
```javascript
// 引入模块依赖
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
// 创建 token 类
class Jwt {
    constructor(data) {
        this.data = data;

    }

    //生成token
    generateToken() {
        let data = this.data;
        let created = Math.floor(Date.now() / 1000);
        let cert = fs.readFileSync(path.join(__dirname, '../pem/private_key.pem'));//私钥 可以自己生成
        let token = jwt.sign({
            data, //数据
            exp: created + 60 * 30, //有效时间
        }, cert, {algorithm: 'RS256'});
        return token;
    }

    // 校验token
    verifyToken() {
        let token = this.data;
        let cert = fs.readFileSync(path.join(__dirname, '../pem/public_key.pem'));//公钥 可以自己生成
        let res;
        try {
            let result = jwt.verify(token, cert, {algorithms: ['RS256']}) || {};
            let {exp = 0} = result, current = Math.floor(Date.now() / 1000);
            if (current <= exp) {
                res = result.data || {};
            }
        } catch (e) {
            res = 'err';
        }
        return res;
    }
}
```

## 刷新token
以上说的token如果有仔细看的话就会注意到，token都是有时限的，那你可能会说，本地存储localStorage又没有时间要求，为什么不一直存储。如果是这样那安全性就降低了，它就可以媲美密码一样。所以要不能设置长时间的token。

1. 过期之前刷新：根据用户最后一层访问网站资源时间，延长token时间。简单的说，假设默认每个token都只能存储一个星期，那么第一次登入存储token，还有当前时间。第二次访问时，验证token，如果失效重新鉴权（需要重新登入），否则记录当前时间，验证数据库token，更新数据库的有效期限

> 如果你了解这种模式的目的，你自然也该对Jwt刷新有所想法，**jwt的payload其实就相当于数据库**，利用好它
添加字段，也能帮你解决问题

2. 签名验证：第一点是基于时间上来平衡安全，那么是否可以基于token次数验证token。假设只能使用一次token。    
- 对前端来说：有个全局的属性（单例模式）token，当发送鉴权请求，带上token，并当请求成功后，获取数据，数据中包含了一个新的token，用改token重写全局属性token
- 对后端来说：当用户登入后，第一次签发token，在其后的鉴权资源访问中，检验token，鉴权成功重新生成token，再做一系列的处理，最后返回token