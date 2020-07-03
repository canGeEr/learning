# egg-sequelize ORM
> 暂时不考虑版本迁移

## 安装和使用
1. 
```bash
// egg-sequelize 和 mysql2 包
npm install --save egg-sequelize mysql2
```

2. 在plugin.js中.........省略

3. config.default.js
```javascript
config.sequelize = {
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: "root",
  password: "",
  //你的数据库名
  database: 'egg-sequelize-doc-default',
};
```

4. app/model 写model逻辑文件

5. 自动生成model sequelize-automate

6. 在model 里的option
```javascript
const options = {
  tableName: "users",
  comment: "",
  //字段替换
  createdAt: "create_time",
  //字段替换
  updatedAt: "update_time",
  indexes: []
};
```

7. model初步建立，在controller层使用
```javascript
const { ctx } = this;
const users = ctx.model.User.findAll();
```