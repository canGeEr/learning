# API规范之RESTful
API写的好，前端甚至都不需要接口文档（当然是在前端懂后端的业务逻辑的前提下）

> 之前也是写过一篇关于RESTful的博客的，说明了一些规则，那接下来写的将是实际情况的！

## （1）规范数据body
- **规定返回状态变量（封装在utils/RES_CODE.js）：** 
  ```javascript
    /**
    200 OK - [GET]：服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）。
    201 CREATED - [POST/PUT/PATCH]：用户新建或修改数据成功。
    202 Accepted - [*]：表示一个请求已经进入后台排队（异步任务）
    204 NO CONTENT - [DELETE]：用户删除数据成功。
    400 INVALID REQUEST - [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
    401 Unauthorized - [*]：表示用户没有权限（令牌、用户名、密码错误）。
    403 Forbidden - [*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。
    404 NOT FOUND - [*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
    406 Not Acceptable - [GET]：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
    410 Gone -[GET]：用户请求的资源被永久删除，且不会再得到的。
    422 Unprocesable entity - [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误。
    500 INTERNAL SERVER ERROR - [*]：服务器发生错误，用户将无法判断发出的请求是否成功。
    */

    module.exports  = {
      CODE: {
        OK: 200,  //成功返回数据
        NOT_FOUND: 404, //申请资源不存在，一般针对id获取
        CREATED: 201, //新建或者更新
        NO_CONTENT: 204,//删除
        Not_Acceptable: 406, //用户字段有误
        Unauthorized: 401 //无权限
      },
      STATUS: {
        SUCCESS: 'success',
        FAIL: 'fail',
        ERROR: 'error'
      }
    }
  ```
  我一般只是使用STATUS，继续往下看

- **规定初步响应数据（封装在utils/Response.js）：**
  ```javascript
    const {STATUS: {SUCCESS}} = require('./RES_CODE')

    class Response {
      //构造函数
      constructor(
        {status = SUCCESS, data = null, message = ''} = 
        {status: SUCCESS, data: null, message: ''}) {
        this.status = status
        if(status != SUCCESS) {
          this.message = message
        }
        this.data =data
      }
    }

    class ResponseError extends Error{
      constructor(message) {
        super(message)
      }
      toJSON() {
        return "ResponseError: " + this.message
      }
    }

    module.exports = {
      Response,
      ResponseError
    }
    /*
      Response : {
        data: null,
        message: ''
      }
      ResponseError : {
        message: 'ResponseError: ' + *****
      }
    */
  ```
  这只是第一步的规范，具体在使用时真正返回的东西不一样。

- **规定返回结果（业务逻辑中）：**
  ```javascript
    async show() {
      const { ctx, service } = this;
      //把上面的所有封装的结合到extend/context 做拓展
      const { Response, ResponseError, query, session, params } = ctx
      const res = new Response()
      try {
        const validateRule = { access_token: 'string' } //验证字段
        ctx.validate(validateRule, query)
        const {access_token} = query //获取信息
        const { id } = params //user_id
        const { user_id } = session //session.user_id

        //注意这一段， 如果这里判断错误，那么直接跳转返回错误信息，这也是为什么需要 ResponseError 去标识是否是开发者的错误返回
        if(id != user_id) {
          throw new ResponseError('用户没有登入信息，没有权限')
        }

        let user = await service.user.findByFields({id}, 'include') //获取到user
        if(user.access_token != access_token) { //令牌验证
          throw new ResponseError('用户令牌无法识别，没有权限')
        }

        await service.user.updateToken(user)
        user = user.toJSON() //转换对象
        changeObjectField(user, ['user_title_record_models', 'user_titles']) //转换头衔字段
        const { user_titles } = user
        user.user_titles = user_titles.map((user_title_record_model)=>{ //过滤头衔字段
          const { title_model } = user_title_record_model
          return title_model
        })
        filterObjectField(user, ['password','role_id'], 'remove')

        // 注意，res是将来需要返回的数据，如果有需要返回的数据，一律放到res.data下面
        res.data = {
          user
        }
        //信息返回
        res.message = '获取用户信息成功'
      }catch(e) {
        console.log(e.message)
        res.status = ctx.STATUS.ERROR;
        res.message = e;
      }
      //注意这一步，最终返回的是res
      ctx.body = res
    }
  ```
  上面其实一大段和今天的主题无关，你可以仔细的阅读响应数据部分，看究竟如何响应

## （2）规范router路由挂载路径
- **官方的[RESTful](https://eggjs.org/zh-cn/tutorials/restful.html)：** 
  ```javascript
    /* 四个动作 
      GET => 获取资源     DELETE => 删除资源
      POST => 创建资源    PUT =>    更新资源
    */
  ```
  **在原博客中提到太多种动作，以至于难以选择，所以直接规范为四个 => 对应增删改查**，
  ```txt
    Method(动作)	Path(真正的路径)	Route Name(路由名称，用不太上)	Controller.Action(控制器的方法名)
  1  GET	    /articles	        articles	    app.controllers.articles.index
  2  GET	    /articles/new	    new_article	app.controllers.articles.new
  3  GET	    /articles/:id	    article	    app.controllers.articles.show
  4  GET	    /articles/:id/edit	edit_article	app.controllers.articles.edit
  5  POST	    /articles	        articles	    app.controllers.articles.create
  6  PUT	    /articles/:id	    article	    app.controllers.articles.update
  7  DELETE	/articles/:id	    article	    app.controllers.articles.destroy

  1 是获取所有的资源（article）
  2 是获取所有资源下的某种资源（比如一一对应的，获取所有写过文章的用户）
  3 获取以 id （id是Egg.js的库规范的，后面讲路由会提到）为标识的某个资源（比如id为2的文章）
  4 获取资源下的某个资源对应的某些资源（这里的article不好举例，你可以试者换成user（资源）
    /users/1/articles 获取某个用户所有文章
  5. 创建文章
  6. 更新
  7. 删除
  ```
  需要注意的是Egg.js的 [router.resources](https://eggjs.org/zh-cn/basics/router.html#restful-%E9%A3%8E%E6%A0%BC%E7%9A%84-url-%E5%AE%9A%E4%B9%89)只能有这7个规范的，不能说和路径类似也可以自动挂载！比如：     
  **/articles/:id/fuck	edit_article	app.controllers.articles.fuck**     
  即使这样写，Cntroller的fuck也不会绑定改路径的路由
  ```javascript
    //实际操作
    //controller/home.js
    'use strict';
    const Controller = require('egg').Controller;

    class HomeController extends Controller {
      //@GET /homes
      async index() {
        const {ctx} = this;
        ctx.body = '响应方式：GET' + '/homes' + 'to获取所有'
      }

      //@GET /homes/:id
      async show() {
        const {ctx, params} = this;
        const { id } = params
        ctx.body = '响应为：POST' + '/homes/:id' + 'to获取单个资源'
      }

      //@POST /homes
      async create() {
        const {ctx} = this;
        ctx.body = '响应为：POST' + '/homes' + 'to创建资源'
      }

      //@PUT /homes
      async update() {
        const {ctx} = this;
        const {params, request: {body: request}} = ctx
        const {id} = params;
        ctx.body = '响应为：PUT  ' + '/homes/:id' + ' ' + 'id为' + id
      }

      //@DELETE /homes
      async destroy() {
        const {ctx} = this;
        const {params, request: {body: request}} = ctx
        const {id} = params;
        ctx.body = '响应为：DELETE' + '/homes/:id' + ' ' + 'id为' + id
      }
    }

    module.exports = HomeController;
  ```
- **自己的路由挂载：**    
  Egg.js的router.js负责挂载路由
  ```javascript
    module.exports = app => {
      const { router, controller } = app;
      router.get('/home', controller.home);
      router.get('/user/:id', controller.user.page);
      router.post('/admin', isAdmin, controller.admin);
      router.post('/user', isLoginUser, hasAdminPermission, controller.user.create);
      router.post('/api/v1/comments', controller.v1.comments.create); // app/controller/v1/comments.js

      // 注意RESTful 映射只需写一条 这也是为什么用RESTful的原因
      router.resources('homes', '/api/v2.0/homes', controller.front.home)
    };
  ```
  如果觉得一直在写 router.get 不够优雅区分模块，且大量重复，那就找一些其它的库或者包方便编写路径。这里我自己写了一个工具函数（utils/mountRouterMap.js）方便挂载 => [mountRouterMap](https://gitee.com/cangeer/blog_back_v2.0/blob/master/app/utils/mountRouterMap.js) 。 看看写法

  ```javascript

    const mountRouterMap = require("./utils/mountRouterMap");

    const User = {
      controllerMethodPath: "/front/user",
      mountPath: "/api/v2.0/users",
      mount: {
        get: [
          ['system_messages', '/:user_id/system_messages'],
          ['baseInfoByVertify', '/:vertify/base_info'],
          ['articles', '/:user_id/articles'],
          ['collections', '/:user_id/collections']
        ],
        post: ["vertify"],
        delete: ['off_line'],
        put: [['updatePassword', '/:vertify/password']]
      }
    }

    const File = {
      controllerMethodPath: "/file",
      mountPath: "/api/v2.0/files",
      mount: {
        post: ["avatar", 'article_image', 'article_cover', 'banner_image', 'functionality_image']
      }
    }

    const Tag = {
      controllerMethodPath: "/front/tag",
      mountPath: "/api/v2.0/tags",
      mount: {
        get: [['getArticleByTagId', '/:id/articles']]
      }
    }

    const Article = {
      controllerMethodPath: "/front/article",
      mountPath: "/api/v2.0/articles",
      mount: {
        get: [['getRankListByProperty', '/:property/rank_list']],
        put: [['lookArticle', '/:id/look_times']]
      }
    }

    const routerMap = {
      User,
      File,
      Tag,
      Article,
    }

    module.exports = app => {
      const { router, controller } = app;
      mountRouterMap(router, controller, routerMap);
    }
  ```
  个人觉得清晰了很多，没办法我当时直接硬着头皮封装的，没想到社区其实已经有很多很好用的资源，
  **以后还是先多找找资源，你走过的路和坑别人走过，且有解决方法，这大概就是社区丰富**


## （3）最后的接口文档
我选择[showdoc](https://www.showdoc.com.cn/)      
[我的博客API地址](https://www.showdoc.com.cn/wczix)