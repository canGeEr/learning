# nodejs操作数据库
> [npm-mysql](https://github.com/mysqljs/mysql)

准备好mysql5.x/8.x：
1. 创建文件夹，npm init --yes
2. npm i mysql -S
3. 创建index.js
    ```javascript
    var mysql = require('mysql');
    // 链接数据库需要的认证信息
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'xxxx',
      database : 'code_sub_platform',
    });
    // 真正链接的方法
    connection.connect();

    connection.connect();

    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
      if (error) throw error;
      console.log('The solution is: ', results[0].solution);
    });

    connection.end();
    ```

## mysql 8.* 报错无法链接mysql client
> [ER_NOT_SUPPORTED_AUTH_MODE](https://github.com/mysqljs/mysql/issues/2499)

mysql用了新的加密方式，nodejs无法支持，因此暂时的我们需要改变Mysql的加密方式：
```bush
mysql> ALTER USER root@localhost IDENTIFIED WITH mysql_native_password BY '123456';
```
root@localhost 是 修改的用户；'123456' 是修改用户的密码