# CSM架构抽离Base基础类
> 主要是Service和Model层的抽离

## （1）为什么分层CSM
- **为什么是CSM：** C => Controller；S => Service；M => Model。Controller 是当有其它终端先本机服务器发送对应请求时的处理方法入口；Service 是做大量的数据操作，有极强的**副作用**（改变数据）；Model是数据库的对象模式真正对数据操作的终点。

- **为什么要分层：** 如果没有S和M的话，一个Controller要复杂接受请求，转化参数，处理数据，存取数据库，返回响应，即使处理BaseController也无法分如此复杂的操作，于是，将不同阶段的操作从Controller分离。

- **怎么分层：** Controller 复杂请求入口，参数数据采集处理，决定是否处理 => 调用调用Model；Service；Service 进行数据分析、处理，决定是否存储 => 调用Model；最后Model处理完返回数据给Service，Service对数据进一步包装、处理返回给Controller，Controller更具结果决定返回什么数据结束请求。

- **总结：** 清晰的逻辑处理，大量复用的数据接口Service，专门处理数据库的Model各司其职，使得后端开发变得简单、清晰、优雅。

## （2）Service层的复用模块抽离
- **为什么是Service：** Model是一个基础数据库类，它的对象的方法都是比较基础的，无法满足复杂场景的情况（又是该频率发生），比如文章的分页请求；同时对多个字段分析、排序；多表连结查询等等。在Service调用Model，因此在Service抽离数据存取的方法基类。

- **怎么抽离：**    
  1.  对Model基础方法，并几个数据表规范特点进行封装基本增删改查
      ```javascript
        //service/base.js
        'use strict';

        const Service = require('egg').Service;

        const {getModelClassAttrs, filterArr} = require('./../utils/filters')

        class BaseService extends Service {

          constructor(primary_model, hiddenAttributes, ...props) {
            super(...props)
            //对于基础属性的过滤 如：status create_time, update_time, status
            this.primary_model = this.ctx.model[primary_model] //绑定model成this的属性
            const saveAttributes = filterArr(getModelClassAttrs(this.primary_model), hiddenAttributes) 
            this.primary_model.hiddenAttributes = hiddenAttributes
            this.primary_model.saveAttributes = saveAttributes
          }
          
          //查找
          async find(id, findWhere = {}){
            const {primary_model} = this
            const args = arguments
            if(arguments.length <= 1) {
              return await primary_model.findByPk(id)
            }else {
              const { where = {} } = findWhere
              return await primary_model.findOne({
                ...findWhere, where: {id, ...where}
              })
            }
          }

          //查找并创建
          async findOrCreate(defaults, whereArr){
            const {primary_model} = this;
            const where = {}
            if(typeof whereArr === 'string') {
              const value = whereArr
              where[value] = defaults[value]
            }else if(Array.isArray(whereArr)) {
              for(let value of  whereArr) {
                where[value] = defaults[value]
              }
            }
            const [record, created] = await primary_model.findOrCreate({where,defaults})
            return {record, created}
          }

          //查找全部可用
          async findAll(findWhere = {}) {
            const {primary_model} = this;
            return await primary_model.findAll({
              where: {status: "1"},
              ...findWhere
            });
          }

          //创建添加
          async create(newRecord) {
            const {primary_model} = this;
            return await primary_model.create(newRecord);
          }

          //更新
          async update(id, newRecord) {
            const {primary_model} = this;
            const user = await primary_model.findByPk(id);
            for(let pro in newRecord) {
              //自动过滤
              if(pro in user) user[pro] = newRecord[pro];
            }
            return await user.save();
          }

          //删除记录
          async softDestroy(id,){
            const {primary_model} = this;
            const record = await primary_model.findByPk(id);
            record.status = "0";
            return await record.save();
          }

          //恢复记录
          async softRecover(id){
            const {primary_model} = this;
            const record = await primary_model.findByPk(id);
            record.status = "1";
            return await record.save();
          }
        }

        module.exports = BaseService;
      ```

  2.  使用：
      ```javascript
        'use strict';

        const BaseService = require('./base');

        class LikeService extends BaseService {
          constructor(...props) {
            const hiddenAttributes = ['create_time', 'update_time']
            super('Like', hiddenAttributes ,...props)
          }
          async getByKeys(article_id, user_id) {
            const { ctx, primary_model } = this //注意这个
            return await primary_model.findOne({
              where: { article_id, user_id, status: '1' }
            })
          }
        }

        module.exports = LikeService;
      ```

## （3）优雅的Controller
```javascript
//@GET 
async index() {
  const { ctx, service } = this;
  const { Response, ResponseError, query } = ctx
  const res = new Response() //作为响应
  try {
    // let articles = null
    // if(Object.keys(query).length === 0) { //获取所有
    //   articles = await service.article.findAll()
    //   res.data = { articles }
    // }else { //条件匹配
    //   const { search, page, limit = 5 } = query
    //   const where = {}
    //   if('search' in query) where.search = search
    //   if('page' in query && 'limit' in query){
    //     where.page = +page
    //     where.limit = +limit
    //   }
    //   res.data = await service.article.findAllByKeyWord(where)
    // }
    res.message = '获取数据成功'
  }catch(e) {
    console.log(e)
    res.status = ctx.STATUS.ERROR;
    res.message = e;
  }
  ctx.body = res
}

//@GET /:id 根据文章id获取文章
async show() {
  const { ctx, service } = this;
  const { Response, ResponseError, query, session, params } = ctx
  const res = new Response()
  try {
    const validateRule = { id: 'string' } //验证字段
    ctx.validate(validateRule, params)
    const { id } = params //获取信息
    // let article = await service.article.getArticleById(id)
    // const {file_id} = article
    // const file = await service.file.getFileUPath(file_id)
    // const content = readFile(file.upload_path_model.value, file.filename).toString()
    // article = article.toJSON()
    // article.content = content
    res.data = {
      article
    }
    res.message = '获取用户信息成功'
  }catch(e) {
    console.log(e.message)
    res.status = ctx.STATUS.ERROR;
    res.message = e;
  }
  ctx.body = res
}
```
看非注释部分其实是基本相同的，只要Service功能模块越多越全，Controller越少。