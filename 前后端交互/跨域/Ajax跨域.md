# Ajax跨域和Nginx反向代理
跨域是 **浏览器** 对其请求的过滤，保证安全

## 一、一种流行的跨域方式 CORS
CORS是后端配置，在前端请求时，后端的响应报文写入一些允许跨域字段来告诉浏览器不要拦截响应报文并允许跨域

优点：      
- 允许任何源访问服务，不产生跨域浏览器不会拦截，但是也不安全

缺点：
- CORS这种技术不允许前端携带Cookie，即使前端形式上设置允许携带，后端依然无法获取，也无法在响应报文设置setCookie回写cookie


**当然对于不能携带cookie不是没有解决办法** => 
- **前端要做：**  设置请求允许携带凭证

    ```javascript
    withCredentials: true
    ```
- **后端要做：**
    - header信息 Access-Control-Allow-Credentials:true

    - Access-Control-Allow-Origin不可以为 "\*"，因为 "\*" 会和 Access-Control-Allow-Credentials:true 冲突，需配置指定的特定的地址

## 二、最有效的解决方案 nginx 反向代理
明确：nginx代理是解决了什么？怎么解决的

- 浏览器访问资源是都有一个 **协议（http/https）+ ip + 端口号作为 域 ** 如果这些都相同的话，那说明就是同源

- 浏览器不能跨“域”请求，那我们就直接发出 **同域请求**；在当前访问的域访问的资源下，所以的以 "/" 开头的路径，浏览器都会自动的将当前 “域” 加上

  比如，在域为："http://191.16.86.81:80"下，某文件请求资源，路径为："/api/v1.0/homes" 的请求，浏览器最终的解析的请求URL为：''http://191.16.86.81:80/api/v1.0/homes"

- 如果你理解第二点，又对nginx有一定了解，那你可能已经知道怎么做了，我们只要对以特定形式的资源路径，通过 nginx 在对应域监听 ，就能拦截在该域发出的特殊请求，并对其进行处理（转发）

这样再通过nginx向指定的代理路径转发，就能实现骗过浏览器的同源策略，并向真实服务地址请求，并且不产生任何跨域（即后端甚至不需要配置CORS）    

## 三、Nginx 基本指令和配置服务

第二点说了要在域下访问 '/' ，因此nginx配置的服务端口、地址一定要和你访问需要代理访问项目的端口、地址相同，这样发出 "/" 开头请求时，才能被nginx监听到。比如你开了一个服务，可以在"localhost:8080" 下访问到你的项目，那么你应该对nginx配置的server的listen设置为8080；server_name  设置为localhost


### (1) 基本指令
> 记住 这些指令要进入cmd才可用运行
- **启动**
start nginx

- **关闭**
nginx -s stop
nginx -s quit

- **重新加载配置**
nginx -s reload

### (2) 配置服务
在nginx的根目录下，有个conf文件夹，里面的nginx.conf，接下来我们要对它进行修改

- 打开文件，找到http选项，它有一个大括号，其中的内容表示http的配置信息

    ```conf
    http {
        ... # 配置信息，并且#表示注释
    }
    ```

- 在http里面添加一个server 配置如下：

    ```conf
    server {
        # 监听当前电脑的80端口，任何访问该端口的请求，都会经过这里
        listen       80; 
        # 表示请求的地址路径名，可以理解当外部通过 该域名解析到当前电脑的80端口，以下的配置生效
        server_name  home.shepiji.top; 
    }
    ```

- 我们还未添加代理配置，现在添加一条，静态资源访问代理：

    ```conf
    # location 是一个关键词，表示匹配到什么， 如果匹配到 / 则发生如下转变
    location / { 
        # 将根目录设置未 html 即 nginx根目录下的html文件夹
        root   html; 
        # 默认访问html文件下的index.html文件如果没有则是 index.htm （linux）
        index  index.html index.htm; 
    }

    # 同理可做如下配置：
    location /blog { 
        root   html/blog;
        index  index.html index.htm;
    }
    # 不过需要说明的是，有了上一条 location / 配置后，/blog 明显也被包括在 / 内，你可以想象成正则匹配，因此有 location / 之后，如果访问 home.shepiji.top/blog ，自然的会转到 html/blog
    ```
- 对于一些静态资源如果需要处理的话，可以通过alias处理：

    ```conf
    # 如果你不想要每次写css都需要一大串的路径，你可以将其href="/MYCSS/..."，nginx服务监听到将请求重写到alias指定位置
    location /MYCSS/ {
        alias   html/assets/css/;
    }
    ```

- 对于一些ajax请求，通过设置proxy_pass做反向代理：

    ```conf
    location /UPLOAD/ {
        # 按照格式写就行
        rewrite ^/UPLOAD/(.*)$ /$1 break; 
        # 真实地址
        proxy_pass https://www.jianshu.com; 
    }
    ```

- 如果你需要显示一些静态的外部资源比如图片，特别是外联CSS的背景图片，需要设置proxy_set_header：

    ```conf
    location /MYIMAGE/ {
        # 真实路径
        proxy_pass https://upload-images.jianshu.io/;
        # 可以访问图片的 referer
        proxy_set_header referer "https://upload-images.jianshu.io";
    }
    ```
