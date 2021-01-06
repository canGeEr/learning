# 基于Vue对axios进行上层封装
> 这的里的很多东西都是基于上一节 **axios** 讲解的，如果你不是对axios了解，请先看该文章
## 一、要真正拿axios进行实战之前要了解一些细节上的东西

### (1) 先搞清楚请求发送的配置和拦截问题

- axios的配置是可以合并的也有优先级，全局的axios.create创建的axios实例会自动吸取全局axios的配置

- 修改任意axios实例的配置，都可以通过axios实例的defaults属性获取配置对象，再修改对应的配置项

- axios的拦截器并不是可合并的，在每个单独的实例上的interceptor对应的过程（request，response）上调用use表示在单个实例添加对应拦截器；同样全局的axios.create创建的axios实例并**不会**吸收全局axios的拦截器

- axios的拦截器的传入的拦截器其实内部和调用then方法一样，一个onFulfilled和onRejected函数，所以要注意函数返回的结果，或者是否需要抛出错误以改变调用顺序

### (2) 令人头疼的Content-Type
axios默认是会自己对发送请求方法不同，和传入数据（请求体）的不同变更其 Content-Type，但是有的时候，这种默认的Content-Type并不是我们所期待的，于是需要手动配置。
先说一下不同方式axios的默认Content-Type     
- **GET** 没有，只有有请求体的请求方式才存在 Content-Type
- **POST**、**PUT**、**PATCH** application/x-www-form-urlencoded 如果传入的data请求体数据类型有文件或者FormData，那么自动转换为 application/form-data
- **DELETE** text/plain 比较奇怪的是 Params 和Data都能传递参数

如果你希望使用Restful规范，delete只是text/plain 方式的肯定在后台接受参数会产生问题，这里两种解决反式
- DELETE 的数据存放在 Params中，后端从URL获取，自然不会受到text/plain的影响
- DELETE 的数据存放在 Data 中，Content-Type设置为application/x-www-form-urlencoded，后端可以正常的从请求体获取数据


其它的请求方法表现的都计较正常（正常情况下，如果你有特殊需求另外分析）

### (3) 官网文档请求配置一些有点争议的地方

- **baseURL** 说是识别相对地址，如果是相对路径就自动的加上，否则不加。实际测试中 baseURL 对 请求路径是http/https/域名开头的直接忽略，识别为绝对地址；对请求其它请求路径通过类似于path.join函数一样，于是相对路径带 "/" 还是不带可以随意

- **transformRequest** 官方说只是最终影响POST、PUT、PATCH，但是实际测试有点奇怪：**无论什么方法都会调用transformRequest的函数队列**，但是只有拥有请求体的请求才会真正的处理数据并发出，得出结论：只要该请求允许携带请求体，transformRequest就有效


### (4) 值得注意的几个细节
- 请求配置中，**responseType** 默认是JSON，这也是为什么then返回的数据可以是对象

- 请求配置中，**paramsSerializer** 负责序列化 Params的函数，它是有默认值，这也是为什么传入的Params对象最终以字符串拼接在URL上

- **withCredentials** 这几乎是最重要的一点，很关键：withCredentials` 表示跨域请求时是否需要使用凭证，这个凭证就代表这Cookie和Token是否能被后端正确接受和写回给前端。默认的值为false表示跨域不携带。**注意的是：只有在跨域情况下这个字段才有效果，非跨域下一定携带凭证** （如果有的话，并且不是手动去除）

> 在 **Ajax跨域和Nginx反向代理** 那篇有说明 **withCredentials** 具体怎么使用

## 二、开始上层封装

### (1) 剥离拦截器
新建一个 **axios-interceptors.js** 文件
将你需要的拦截器写出这种形式
```javascript
//你可能对option参数不太理解，等看完下一小段，你就能明白
const reqCommon = {
    /**
     * 发送请求之前做些什么
     * @param config axios config
     * @returns {*}
     */
    onFulfilled(config, option) {
        return config
    },
    /**
     * 请求出错时做点什么
     * @param error 错误对象
     * @returns {Promise<never>}
     */
    onRejected(error, option) {
        return Promise.reject(error)
    }
}

//响应拦截
const resCommon  ={
    onFulfilled(response, option) {
        return response
    },
    onRejected(error, option) {
        const { response, request } = error
        if (response) { //响应是否存在
            switch (response.status) {
                case 400:
                    error.message = '错误请求'
                    break
                case 401:
                    error.message = '未授权，请重新登录'
                    break
                case 403:
                    error.message = '拒绝访问'
                    break
                case 404:
                    error.message = '请求错误,未找到该资源'
                    break
                case 405:
                    error.message = '请求方法未允许'
                    break
                case 408:
                    error.message = '请求超时'
                    break
                case 500:
                    error.message = '服务器端出错'
                    break
                case 501:
                    error.message = '网络未实现'
                    break
                case 502:
                    error.message = '网络错误'
                    break
                case 503:
                    error.message = '服务不可用'
                    break
                case 504:
                    error.message = '网络超时'
                    break
                case 505:
                    error.message = 'http版本不支持该请求'
                    break
                default:
                    error.message = `未知错误${error.response.status}`
            }
        }else if(request){// 响应不存在，很可能是请求都未发出
            if(!window.navigator.onLine) { //发现是断网了
                error.message = "网络未连接"
            }
        }else {
            error.message = "配置请求发生了错误"
        }
        return Promise.reject(error)
    }
}

export default {
    request: [reqCommon], // 请求拦截
    response: [resCommon] // 响应拦截
}
```
可以看到request队列中的元素是一个对象，对象有两个方法，都将在被axios实例拦截时调用use方法传入的两个参数，表示成功和失败；response队列也是如此


### (2) 生成 loadInterceptors => 加载拦截器函数

```javascript
//httpRequest => axios实例；interceptors => 分离出来的拦截器；option => 闭包参数
export function loadInterceptors(httpRequest, interceptors, option) {
    const {request, response} = interceptors
    // 加载请求拦截器
    request.forEach(item => {
        let {onFulfilled, onRejected} = item
        if (!onFulfilled || typeof onFulfilled !== 'function') {
            onFulfilled = config => config
        }
        if (!onRejected || typeof onRejected !== 'function') {
            onRejected = error => Promise.reject(error)
        }
        httpRequest.interceptors.request.use(
            //生成闭包!!!这样在拦截器调用的时候能够有option参数
            config => onFulfilled(config, option),
            config => onRejected(config, option)
        )
    })
    // 加载响应拦截器
    response.forEach(item => {
        let {onFulfilled, onRejected} = item
        if (!onFulfilled || typeof onFulfilled !== 'function') {
            onFulfilled = response => response
        }
        if (!onRejected || typeof onRejected !== 'function') {
            onRejected = error => Promise.reject(error)
        }
        httpRequest.interceptors.request.use(
            config => onFulfilled(config, option),
            config => onRejected(config, option)
        )
    })
}
```

### (2) 生成axios实例，并配置对应的拦截器
```javascript
//config生成新的axios实例的配置；interceptors要绑定的拦截器；
//requestMethods在实例上绑定的自定义方法数组
function createAxios({
    config, interceptors, requestMethods
}) {
    //创建axios实例
    const httpRequest = axios.create(config)
    //加载拦截器，并绑定到对于的axios实例
    loadInterceptors(httpRequest, interceptors) 
     //遍历方法数组
    for(let method of requestMethods) {
        if(method === 'upload') {
            httpRequest['$Upload'] = requestMethodCreator('post')
            continue
        }
        if(method === 'delete') {
            httpRequest['$' + method.toUpperCase()] = requestMethodCreator(method, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            continue
        }
        httpRequest['$' + method.toUpperCase()] = requestMethodCreator(method)
    }
    return httpRequest
}
```

### (3) 一次性的自定义拦截器 => beforeRequest、onRequest、atferRequest
```javascript
//导出请求方法创建器
function requestMethodCreator(method, outConfig) {
    return function baseRequestMethod(API, body, option = {}) {
        let { beforeRequest, onRequest, atferRequest, ...innerConfig } = option
        //写一个自己的拦截器
        const defaultConfig = {
            method,
            url: API,
        }
        //选择请求体
        defaultConfig[method === 'get'? 'params' : 'data'] = body
        //合并配置
        Object.assign(defaultConfig, innerConfig, outConfig)
        //执行自定义拦截
        beforeRequest && beforeRequest()
        let result = this(defaultConfig)
        //真正发送请求
        if(onRequest) {
            result = result.then(onRequest, errorReason => Promise.reject(errorReason))
            if(atferRequest) {
                result = result.finally(atferRequest)
            }
        }
        return result
    }
}
```

### (4) 使用导出utils的http-request.js文件
```javascript
import axios from "axios";
import qs from "qs";
import {createAxios} from './create-axios'
import interceptors from './axios-interceptors'

axios.defaults.timeout = 3000
axios.defaults.responseType = 'json'
axios.defaults.transformRequest = [function (data){
    console.log(data)
    data = {message: '被修改了'}
    if(data instanceof FormData) return data
    data = qs.stringify(data)
    return data;
}]

//服务请求路径前缀
const {
    VUE_APP_SERVICE_PROXY_URL: SERVICE_PROXY_URL,
    VUE_APP_SERVICE_API_PREFIX: SERVICE_API_PREFIX,
    VUE_APP_UPLOAD_PROXY_URL: UPLOAD_PROXY_URL,
    VUE_APP_UPLOAD_API_PREFIX: UPLOAD_API_PREFIX,
    VUE_APP_VERTIFY_PROXY_URL: VERTIFY_PROXY_URL,
    VUE_APP_VERTIFY_API_PREFIX: VERTIFY_API_PREFIX
} = process.env

// SERVICE_PROXY_URL 请求路径
export const $BASE_URL = '/' + SERVICE_PROXY_URL + '/' + SERVICE_API_PREFIX

export const $VERTIFY_URL = '/' + VERTIFY_PROXY_URL + '/' + VERTIFY_API_PREFIX

export const $UPLOAD_URL = '/' + UPLOAD_PROXY_URL + '/'

export const httpRequest = createAxios({
    config: {baseURL: $BASE_URL},
    interceptors,
    requestMethods: ['get', 'post', 'put', 'delete', 'upload']
})

export const httpVertify = createAxios({
    config: {baseURL: $VERTIFY_URL},
    interceptors,
    requestMethods: ['get']
})

export const httpUpload = createAxios({
    config: {baseURL: $UPLOAD_URL},
    interceptors,
    requestMethods: ['upload']
})

export default {
    httpRequest, httpVertify, httpUpload
}
```

### (5) vue.config.js和.env文件配置

**.env**
```.env
## 这里是配置环境变量，因为可能有多个代理，所以进行约束 =>  括号内表示你的代理地址 名称
## VUE_APP_[]_URL 代理目标地址
## VUE_APP_[]_PROXY_URL  代理使用 标识符
## VUE_APP_[]__API_PREFIX  代理真实API接口的前缀 标识符，默认为空

## 举例
VUE_APP_SERVICE_URL=http://localhost:3000
## 代理服务器地址路径
VUE_APP_SERVICE_PROXY_URL=BLOG_API
## 请求前缀
VUE_APP_SERVICE_API_PREFIX=api/v2.0/

## 简书身份认证
## 真实地址
VUE_APP_VERTIFY_URL=https://www.jianshu.com
## 代理服务器地址值路径
VUE_APP_VERTIFY_PROXY_URL=VERTIFY
VUE_APP_VERTIFY_API_PREFIX=

## 上传文件到简书的地址
## 真实地址
VUE_APP_UPLOAD_URL=https://upload.qiniup.com
## 代理服务器地址值路径
VUE_APP_UPLOAD_PROXY_URL=UPLOAD
VUE_APP_UPLOAD_API_PREFIX=

## 转发请求，安全获取简书的图片
## 真实路径
VUE_APP_JIANSHU_IMAGE_URL=https://upload-images.jianshu.io
## 代理字段
VUE_APP_JIANSHU_IMAGE_PROXY_URL=GET_JIAN_SHU_IMAGE
VUE_APP_JIANSHU_IMAGE_API_PREFIX=
```

***vue.config.js***
```javascript
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

//自动处理多个代理路径
const proxyArr = ['SERVICE','UPLOAD','JIANSHU_IMAGE', 'VERTIFY']
const proxy = {} //代理对象
proxyArr.forEach((proxyname)=>{
  const targetUrl= process.env['VUE_APP_' + proxyname + '_URL']
  const targetProxyUrl= process.env['VUE_APP_' + proxyname + '_PROXY_URL']
  proxy['/' + targetProxyUrl] = {
    target: targetUrl,
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      ['^/'+targetProxyUrl]: ''
    }
  }
})

module.exports = {
  ...config,
  devServer: {
    port: '3000',
    proxy
  }
}
```