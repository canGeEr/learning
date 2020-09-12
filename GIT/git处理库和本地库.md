# GIT REMOTE && LOCAL

## 问题1：本地仓库版本落后
分析需求: 从远程仓库获取最新代码合并到本地分支 (本地分支相对又有所改动)  

### 发生冲突
解决方法: 
```bush
$ git fetch origin master //获取远程仓库并建立分支 origin
//$ git log -p master.. origin/master //获取对比不同信息
$ git merge origin/master //合并分支

//注意现在最全的版本在master(local)
git add -> commit  -> psuh 
//完成
```

### 不发生冲突
```bush
git pull origin master
```

## 问题2：删除本地分支和远程分支
```bush
git branch -d 分支名 //删除本地
git push origin -d 分支名 //删除远程
```


## 问题3：如何克隆指定的分支
```bush
git clone -b branchName(分支名) URL(路径) foldName(文件名)
```