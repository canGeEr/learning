# GIT INSTRUCTIONS

## Config-set
```bush
config --global user.name ""  
config --global user.email ""

git config core.ignorecase true //是否忽略大小写 (默认)
```

## Config-read
```bush
config	user.name
config	user.email
```

## Creat a new repository(local)
```bush
mkdir	name		//made a directdory
cd name
pwd					//show the way to this directdory
git init			//initialize
git status          
git log 
git diff
git log	--pretty=oneline
git reset --hard HEAD^
.................HEAD~n	//(last n times)
git reflog			//command
```

## RM (删除)
```bush
git checkout <file>


//删除远程仓库的,不会影响到本地
$ git rm  -r --cache <file>
$ git commit -m "delete ..."
# git push -u origin master
```



## Dev(分支)
```bush
$ git checkout -b dev == $ git beanch dev + $ git checkout dev
$ git branch			//branch list
$ git check dev/master
$ git branch -d dev
```

