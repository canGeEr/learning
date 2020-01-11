# GIT INSTRUCTIONS

## Config-set
```bush
config --global user.name ""  
config --global user.email ""
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
rm
$ git rm <file>
```



## Dev(分支)
```bush
$ git checkout -b dev == $ git beanch dev + $ git checkout dev
$ git branch			//branch list
$ git check dev/master
$ git branch -d dev
```

