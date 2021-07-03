# Nginx 基本指令和配置服务

第二点说了要在域下访问 '/' ，因此 nginx 配置的服务端口、地址一定要和你访问需要代理访问项目的端口、地址相同，这样发出 "/" 开头请求时，才能被 nginx 监听到。比如你开了一个服务，可以在"localhost:8080" 下访问到你的项目，那么你应该对 nginx 配置的 server 的 listen 设置为 8080；server_name 设置为 localhost

### (1) 基本指令

> 记住 这些指令要进入 cmd 才可用运行

- **启动**
  start nginx

- **关闭**
  nginx -s stop
  nginx -s quit

- **重新加载配置**
  nginx -s reload

### (2) 配置服务

在 nginx 的根目录下，有个 conf 文件夹，里面的 nginx.conf，接下来我们要对它进行修改

- 打开文件，找到 http 选项，它有一个大括号，其中的内容表示 http 的配置信息

  ```conf
  http {
      ... # 配置信息，并且#表示注释
  }
  ```

- 在 http 里面添加一个 server 配置如下：

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

- 对于一些静态资源如果需要处理的话，可以通过 alias 处理：

  ```conf
  # 如果你不想要每次写css都需要一大串的路径，你可以将其href="/MYCSS/..."，nginx服务监听到将请求重写到alias指定位置
  location /MYCSS/ {
      alias   html/assets/css/;
  }
  ```

- 对于一些 ajax 请求，通过设置 proxy_pass 做反向代理：

  ```conf
  location /UPLOAD/ {
      # 按照格式写就行
      rewrite ^/UPLOAD/(.*)$ /$1 break;
      # 真实地址
      proxy_pass https://www.jianshu.com;
  }
  ```

- 如果你需要显示一些静态的外部资源比如图片，特别是外联 CSS 的背景图片，需要设置 proxy_set_header：

  ```conf
  location /MYIMAGE/ {
      # 真实路径
      proxy_pass https://upload-images.jianshu.io/;
      # 可以访问图片的 referer
      proxy_set_header referer "https://upload-images.jianshu.io";
  }
  ```
