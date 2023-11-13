> 资源链接

- [HTTP 的请求字段和响应字段](https://www.cnblogs.com/jycboy/archive/2017/02/17/http_head.html)
- [web 安全](./Web安全.md)
- [HTTP 断点续传（分块传输）](https://www.cnblogs.com/findumars/p/5745345.html)

## 基本结构

- 起始行（start line）
- 头部（header）
- 空行（分割作用）
- 消息正文（entity/body 实体部分）

## start line

请求和响应有很大不同：请求有请求方式，响应有响应状态码

```bush
// 请求方式 + 空格 + 请求路径 + http协议版本
GET / /HTTP/1.1
```

```bush
// http协议版本 + 响应码 + 响应状态（Ok、bad request等等）
HTTP/1.1 200 OK
```

## header

头部主要是 key-value 形式：例子

```bush
Host: blog.51cto.com
Connection: keep-alive
Content-Length: 0
sec-ch-ua: " Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"
Accept: application/json, text/javascript, */*; q=0.01
X-Requested-With: XMLHttpRequest
sec-ch-ua-mobile: ?0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36
Origin: https://blog.51cto.com
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://blog.51cto.com/u_11009785/2448286
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cookie: PHPSESSID=cb6ncj6p1cq8iprmkaej11kkh3;
```

头部按作用可分四类：

- 通用字段：请求头和响应头都有
  - 普通信息字段
  - 实体字段：属于通用字段，但专门描述实体部分的额外信息
- 请求字段：仅出现在请求头里
- 响应字段：仅出现在响应头里

## header 请求首部

- Host(required) 服务器域名
- User-Agent：发起请求的客户端的信息
- Referer: 跳转的来源，即从哪个地址跳过来的，可用于统计分析和防盗链
- Cookie 当前路径的域 下的 cookie
- Authorization 身份字段
- Accept 系列：
  - Accept：客户端可识别的响应内容类型列表 MIME
  - Accept-Language：客户端可接受的自然语言;
  - Accept-Encoding：客户端可接受的编码压缩格式
  - Accept-Charset：可接受的应答的字符集
- Origin 当前页面的域（来源域）
- Range 指定第一个字节的位置和最后一个字节的位置（断点续传）

## header 响应首部

- Server: 提供 Web 服务的软件名称和版本号，为了安全不告诉具体的
- Set-Cookie: 服务器回写的 cookie 字段，浏览器识别到了自动写入 cookie 存储
- Access-Control 系列 CROS
- Refresh 多久刷新一次
- Transfer-Encoding 告诉浏览器数据的传送格式
- Content-Range 服务器会在 Content-Range 头部返回当前接受的范围和文件总大小（断点续传）

## 通用字段

- Pragma 报文指令
- Date 报文创建时间
- Connection 连接方式：长连接/短连接
- Cache-Control **也是一绝**
- Content 系列：
  - Content-Language
  - Content-Encoding
  - Content-expires
  - Content-Md5
  - Content-Range
  - Content-length 实体长度（未指定则自动计算）
  - Content-Type 实体类型
    - application/x-www-form-urlencoded 基础表单
    - application/json
    - multipart/form-data 文件

## 响应状态码

### 2XX Success 成功状态码

- 200、OK：表示从客户端发来的请求在服务器端被正确处理
- 204、No Content：表示请求成功，但响应报文不含实体的主体部分
- 206、Partial Content：进行范围请求

### 3XX Redirection 重定向状态码

- 301、Moved Permanently: 永久性重定向，表示资源已被分配了新的 URL（连带书签都会更新）
- 302、Found: 临时性重定向，表示资源临时被分配了新的 URL（不会更新书签）
- 303、See Other: 表示资源存在着另一个 URL，应使用 GET 方法获取资源
- 304、Not Modified: 附带条件的请求是指采用 GET 方法的请求报文中包含 If-Match，If-Modified-Since，If-None-Match，If-Range，If-Unmodified-Since 中任一首部(服务器端允许请求访问资源，但未满足条件的情况)
- 307、temporary redirect：临时重定向，和 302 含义类似，但是期望客户端保持请求方法不变向新的地址发出请求

### 4XX Client Error 客户端错误状态码

- 400、Bad Request: 请求报文中存在语法错误。需修改请求的内容后再次发送请求。另外，浏览器会像 200 OK 一样对待该状态码
- 401、Unauthorized: 示发送的请求需要有通过 HTTP 认证(BASIC 认证、DIGEST 认证)的认证信息。另外若之前已进行过 1 次请求，则表示用 户认证失败
- 403、Forbidden: 请求资源的访问被服务器拒绝了
- 404、Not、Found: 找不到
- 405、Method Not Allowed: 客户端请求的方法虽然能被服务器识别，但是服务器禁止使用该方法
- 413: 表示 http 请求实体太大

### 5XX Server Error 服务器错误状态码

- 500、Internal Server Error: 服务器端在执行请求时发生了错误。也有可能是 Web 应用存在的 bug 或某些临时的故障
- 502、Bad Gateway: 扮演网关或代理角色的服务器，从上游服务器中接收到的响应是无效的
- 503、Service Unavailable: 务器暂时处于超负载或正在停机维护，无法处理请求

  <!-- Referrer Policy 是什么意思？ -->

        <!-- http缓存 -->
