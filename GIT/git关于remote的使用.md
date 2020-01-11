# remote (远程仓库)

## 增
```bush
$ git remote add [origin](默认) [address]
```

## 删
```bush 
$ git remote remove [origin]  //删除即可 (@params 仓库名)
```

## 改
```bush
$ git remote set-url origin [address] //@params 新的仓库地址
```

## 查询信息
```bush
$ git remote (show 可加可不加) //查看关联的远程仓库的名称 (git默认这个名称创建的)
$ git remote -v //查看关联的远程仓库的地址
$ git remotw show master //查看远程仓库具体信息 > $ git remote -v
```