# vue的基本实现

## 数据代理(vm._data , data)

理用definedPor...根据data的属性建立对应的getter和setter方法

## 数据劫持(Observer, Dep(通知更新器))

每一个data值对应一个Observer对象--->建立一个Dep通知更新器,等待和Watcher连接

## 模板解析

complie模板字符串，正则匹配表达式，事件绑定和    (数据初始化 <--- 调用bind-->启动对应的Updater,并建立Watcher )

## 很重要的事情

Updater是自身存在的


## Watcher
watcher是根据模板中的表达式建立的，Dep和Watcher是多对多的关系

watcher和dep是在watcher调用get方法间接的调用了 data对应属性的get方法 导致建立了关系
