# sequelize-automate
自动生成ORM 文件  (基于sequelize 框架)


## 安装
```bash
//先全局安装
npm install sequelize-automate mysql2 -g
//mysql2 链接数据库
```

## 导出生成Model


### 命令参数导出
```bash

Usage: sequelize-automate -t [type] -h <host> -d <database> -u <user> -p [password] -P [port]  -e [dialect] -o [/path/to/models] -c [/path/to/config]

// sequelize-automate -t egg -h localhost -d glod_bag -u root -p -P 3306 -e mysql -o ./
-t js|egg  -h localhost -d blog_back -u root -p 
-P 3306 -e mysql -o ./model
```
### 命令config导出
```bash
sequelize-automate -c "./sequelize-automate.config.json"
```

```json
{
  "dbOptions": {
    "database": "blog_back",
    "username": "root",
    "password": "",
    "dialect": "mysql",
    "host": "localhost",
    "port": 3306,
    "logging": false
  },
  "options": {
    "type": "js",
    "dir": "./model"
  }
}
```