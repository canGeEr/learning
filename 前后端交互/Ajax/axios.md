# axios

> 如果你还是对Promise比较生疏，那你对axios的深入了解一定会存在一些壁垒，更是难以对Axios进行上层封装，因此推荐先阅读了解Promise，再上手axios

资料：

- [axios 中文说明](https://www.kancloud.cn/yunye/axios/234845)
- [axios 官网](http://axios-js.com/)

> axios 是一个基于 **Promise** 的 HTTP 库，可以用在**浏览器和 node.js** 中。在Web端本质上就是Ajax + Promise，服务端是htttp + Promise

## 一、理解axios为什么兴起

- 完美的结合Promise 的使用，在fetch兼容性不强的现在，axios几乎是最好的过渡方案
- 可以同时在浏览器和服务器上使用
- 支持非常多的人性化特性，可配置性强（封装的比较好）

## 二、怎么使用

### (1) axios 是对象也是函数
> 接下来可能涉及两个名词但是意义不一样：Axios，axios	

大部分的库都是通过闭包生成一个类，再向window对象绑定暴露，但是axios并没有，因此我认为有两个原因：
1. Axios 指的是 axios.prototype.constructor.Axios，它是真正能够单独的发送请求，拥有各种请求方法 get、delete、patch、put、post、request等方法，但是显然如果只是拥有这些方法，根本不够用户使用比如竞争和同时发送请求问题。然而一旦将这些方法耦合到Axios原型上，又先得Axios不够优雅，于是axios产生了，它能管理各个Axios实例，也能同时处理多个Axios实例比如 axios.all、axios.spread
2. axios如果只是有处理多个Axios实例实例的能力，如果只是希望单个请求任务，哪有多了一层访问``(new axios.prototype.constructor.Axios).method()`` 这显然不合理，于是Axios原型上的方法经过改造绑定在axios，至此axios功能齐全
3. 在接下来的使用中，你会发现axios的使用和jquery的ajax很像，这也许是设计者对于JQ使用量极大，在语法上兼容的考量吧（这只是笔者个人的猜想）
	
4. axios的结构图 => axios.prototype

    ![axios的结构图](https://img-blog.csdnimg.cn/20210103193126941.PNG?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3d1Y2FuMTEx,size_16,color_FFFFFF,t_70#pic_center)

5. axios是一个函数对象，但是文档并没有表明new axios可以产生新的axios实例（如果你细心一点，可以注意到axios的原型prototype几乎是一个空对象），而是通过	

```javascript
axios.create(config)
```

### (2) axios 为什么需要 create
axios是一个实例对象，axios.create相当于是这类对象的“构造函数”，每个实例应该保存内部属性，当调用方法时通过传入配置参数，将外部属性和实例内部属性合并，最后发送请求

因此，对axios来说是有很多内部属性都可以配置的，但是一旦改变axios属性，意味着以后所有的通过axios实例发出的请求，都会将外部配置和当前axios实例内部配置合并，这是非常可怕的。比如

```javascript
//假设最开始，由于服务器1网速比较快，连接时间就可以比较短，于是你设置axios内部属性timeout 为 3000
axios.defaults.timeout = 3000 
//但是由于新增业务，你要向服务器2网速比较慢，连接时间就可以比较长，于是你设置axios内部属性timeout 为 5000
axios.defaults.timeout = 5000
//但是现在你又发现，如果需要再次请求服务器1，超时时间也是5000毫秒，于是直接凌乱，不知所措
```
虽然axios每次发送请求都可以再次传入实时的外部配置，但是一旦请求多起来，你需要的外部配置就会越来越复杂		

因此，能够生产另外一个新的axios实例对象是非常重要的，axios.create解决了这一问题

```javascript
const axiosTimeOutSlow = axios.create({ //慢连接
	timeout: 5000
})
const axiosTimeOutFast = axios.create({//快连接
	timeout: 3000
})
```

但是还有一个问题，新建的axios实例真的是和原来的axios实例几乎一样吗？不是的！axios.create(config).prototype => 

![axios.create(config)](https://img-blog.csdnimg.cn/20210103200206302.PNG?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3d1Y2FuMTEx,size_16,color_FFFFFF,t_70#pic_center)

明显没有 create、all、spread等方法和一些属性

### (3) 提配置前还是先说一下axios实例的方法
- axios.request(config)
- axios.get(url[, config])
- axios.delete(url[, config])
- axios.head(url[, config])
- axios.options(url[, config])
- axios.post(url[, data[, config]])
- axios.put(url[, data[, config]])
- axios.patch(url[, data[, config]])

第一个参数都是URL，即请求资源地址路径；第二个是可选的配置信息，是时候的外部配置，决定这当前请求发出具体配置，并不会改变axios实例的

### (4) config配置选项包括：
[请求配置](http://axios-js.com/zh-cn/docs/#%E8%AF%B7%E6%B1%82%E9%85%8D%E7%BD%AE)


### (5) config配置优先级
axios.create产生的新的axios实例会包含axios的全部配置（这也是为什么通过create调用的方法不能再次调用create方法的原因之一，会使得配置太复杂而混乱）

当前请求实时的配置 > axios.create(config) 生成的实例配置 > axios的配置

当真正发出请求是，它们是从右向左进行合并，并且左边的优先级高于右边



## 三、axios真正有意思的地方

### (1) interceptors 拦截器

>  每个axios实例都有对应的拦截器，这也体现了它的强大，注意拦截器并不像配置一样，不会会合并也没有优先级之说

拦截器分为request请求拦截器和responce响应拦截器

```javascript
//interceptor 拦截器
const ceptors = httpService.interceptors
//requestCeptors 请求拦截器 在发送请求前做一些事
const requestCeptors = ceptors.request;
//requestCeptors 响应拦截器 在收到响应前做一些事
const responseCeptors = ceptors.response;
```

那怎么配置拦截器：

```javascript
requestCeptors.use(
	config => config, //在发送请求之前做些什么
    errorReason => Promise.reject(errorReason) //对请求错误做些什么
)
responseCeptors.use(
	response => response, //对响应数据做点什么
    errorReason => Promise.reject(errorReason) //对响应错误做点什么
)
```

**需要注意的是，拦截器可以多次调用use方法，就和addEventListener绑定一样，最后都会触发并且依次触发，并将上一次的结果作为实参传递给给下一次拦截**

当然也可以移除拦截器：

```javascript
const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor);
```

> use方法感觉和node的中间件使用差不多，不知道是不是有这种联系

### (2)  错误处理

axios调用请求方法后返回的是Promise实例对象，因此可以调用then、catch方法，当然对于其中的处理处理可以这么去做：

```javascript
axios.get('/user/12345')
  .catch(function (error) {
    if (error.response) { // 如果response存在说明至少浏览器发出了请求且存在响应，只是由于各种原因响应错误
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {//如果连响应都没有则很有可能请求都没有发出。检测是否有请求发出
      console.log(error.request);
    } else { // 设置请求发生了错误
        if(!window.navigator.onLine) {//如果断网，则带断网处理
            return
        }
      	// Something happened in setting up the request that triggered an Error
      	console.log('Error', error.message);
        return Promise.reject(errorReason)
    }
    console.log(error.config);
  });
```

这里有一个问题就是什么时候调用catch？它是在axios内部完成的，如果想要自己配置，可以通过配置 validateStatus 属性设置：

```javascript
axios.get('/user/12345', {
  validateStatus: function (status) {
    return status < 500; // 只有当 status 小于500时，才进入catch方法
  }
})
```

### (3) 序列化
[使用 application/x-www-form-urlencoded format](http://axios-js.com/zh-cn/docs/#%E4%BD%BF%E7%94%A8-application-x-www-form-urlencoded-format)

笔者一般使用qs