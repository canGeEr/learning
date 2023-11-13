# Cookie 和 Seeion

## Cookie：

> 同源策略

存储于客户端电脑上的文本文件中，只要客户端 cookie 开放且有数据，每一次请求都会自动识别**当前请求的路径**，将电脑存储对于域下的 cookie 添加到 http 报文中，后台可以实时接收观察获取这些 Cookie

## 两种设置 Cookie

- 前端 JS 的 document.cookie 每次写入一条
- 后端响应的 httpResponse 头部 headers，setCookie，设置 Cookie 数组

## Cookie 的属性

属性有：name=value，domain、path、maxAge、expires、Secure、httpOnly

## 有效范围

- domain
- path

domain 被浏览器识别为 Cookie 对应 的域，将这条 Cookie 存储到本地文件里对应的域的 path 路径下，当再次发起该域的请求时，携带该 cookie

- 客户端 document.cookie 设置的默认的 domain 为当前站点的域名
- 服务端的 set-cookie 设置的 domain 默认值为 服务器运行的域

## 有效时间

- maxAge（相对时间）
- expires（过期时间、很容易被本地修改时间而失效）

maxAge 的优先级更高，如果两者都没有的话，Chrome 里过期时间会显示为 Session 或 N/A

## 安全

- Secure
- httpOnly
- SameSite

Secure 告诉浏览器，只要再次请求该服务器，并且协议为 https 的时候，才允许在请求携带 该 cookie

属性“HttpOnly”会告诉浏览器，此 Cookie 只能通过浏览器 HTTP 协议传输，禁止其他方式访问；

“SameSite”可以防范“跨站请求伪造”（XSRF），设置成 Strict 可以严格限定 Cookie 不能随着跳转链接跨站发送，而“SameSite=Lax”则略宽松一点，允许 GET/HEAD 等安全方法，但禁止 POST 跨站发送；还有一个属性叫“Secure”，表示这个 Cookie 仅能用 HTTPS 协议加密传输，明文的 HTTP 协议会禁止发送。但 Cookie 本身不是加密的，浏览器里还是以明文的形式存在

## Session：

- 基于 cookie 实现的，session 存储在服务器端，sessionId 会被存储到客户端的 cookie 中（当然也不是必须存储在 cookie 中）
- 客户端第一次访问，服务端记录，并生成唯一的标识 sessionId，写回给浏览器；浏览器收到信息后，存储在对应的域下；当浏览器再次发送的时候自动判断是否在该域下携带 cookie，并以 cookie 的 sessionId 识别身份信息

## Session 和 Cookie 区别：

- Session 是存储在服务器端的，Cookie 是存储在客户端的

  - Session 比 Cookie 安全，不是谁都能获取到服务器的 Session
  - Cookie 只支持存字符串数据，想要设置其他类型的数据，需要将其转换成字符串，Session 可以存任意数据类型

- Cookie 可设置为长时间保持，比如我们经常使用的默认登录功能，Session 一般失效时间较短，客户端关闭（默认情况下）或者 Session 超时都会失效

- 单个 Cookie 保存的数据不能超过 4K，Session 可存储数据远高于 Cookie，但是当访问量过多，会占用过多的服务器资源

> 主要两个方面：存储、时效
