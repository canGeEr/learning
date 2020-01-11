# GIT REMOTE && LOCAL

## 问题1 : 本地仓库版本落后
分析需求: 从远程仓库获取最新代码合并到本地分支 (本地分支相对又有所改动)  

解决方法: 
```bush
$ git fetch origin master //获取远程仓库并建立分支 origin
$ git log -p origin..master/master //获取对比不同信息
$ git merge origin/master //合并分支

//注意现在最全的版本在master(local)
git add -> commit  -> psuh 
//完成
```