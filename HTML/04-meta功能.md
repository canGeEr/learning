# meta标签的妙用
meta是一个常备新手忽略掉的标签，因为它对你的页面效果展示没有帮助。但是面试却很容易被问道，比如《你是如果优化网站的SEO》

## meta元数据 之 SEO
SEO主要通过 name + content组合实现
```html
<meta name="author" content="shepijcanwu" />
```
- author 作者
- copyright 版权
- description 描述
- keywords 关键字
- robots 机器人（爬虫引擎）robots用来告诉爬虫哪些页面需要索引，哪些页面不需要索引
  - none 搜索引擎忽略此网页，以及所有的该网页链接的网页
  - noindex 只忽略此网页
  - nofollow 只忽略此网页所有链接的网页
  - index 只链接此网页
  - follow 链接网页所有链接的网页
- revisit-after

## meta元数据 之 网页信息
- 