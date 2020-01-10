# 安装说明(当前的wampserver不全)
## 按照官网

来不过必须翻墙的google才有反应,提示可以下载,(可以下载谷歌助手，油猴或者skyZIP等插件辅助),不过谨记必须按照文档提示的每一步包括VC的升级等

## 当前版本wamp只有在VC++2015下才能运行

不然会报一系列文件未找到

## mysql, apache的重新初始化

一般按照上述操作后没有问题(报错,但wamp只到橙色,点击查看mys,apa的service选项可以看见服务未开启,mysql需要手动开启)

## mysql具体初始化

在mysql按照目录下 例如 'F:\WAMP\bin\mysql\mysql5.7.28\bin' 运行 cmd 指令

```cmd
mysqld --remove
//删除数据库,该指令可不用
mysqld  --initialize 
//数据库初始化,主要是这一条
mysqld --install
//数据库安装
mysql -uroot
//链接数据库
```
## 完成重启
