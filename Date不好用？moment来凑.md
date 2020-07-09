# Date不好用？moment来凑
moment同时支持浏览器和Nodejs运行环境
> moment.js提供非常强大的日期功能，包括日期解析与格式化、日期操作、日期比较、英文转换、区间计算等功能，基本上可以满足绝大多数日期使用需求

## 为什么Date不好用
Date只能简单的获取时间或者时间的各项数据，对于其它操作全部无感
例如怎么对时间映射，怎么判别当前月有几天，是否是闰年，初始化之后怎么前进时间


## moment简单操作时间
> https://momentjs.com/docs/#/use-it/     
  http://momentjs.cn/docs/ 推荐

1. 获取时间
```javascript
const current = moment();//默认获取当前时间
```

2. 获取天/年/月
```javascript
const currentDay = current.get("date");//获取当前的天
const currentMonthMaxDay = current.daysInMonth();//获取当前月最大天数
```

3. 获取几天前
```javascript
const range = 11;
const lastTime = current.subtract(range, "days");
```