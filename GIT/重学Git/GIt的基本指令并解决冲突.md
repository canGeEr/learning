# GIt的基本指令并解决冲突

## 基础操作
- git init： 初始化git
- git status: 查看本地仓库的工作区和缓存区的状态
    - 如果工作区修改内容，提示git add
    - 如果缓冲区内容修改，提示git commit
- git add [文件名/.(代表全部)]: 添加记录到缓冲区
- git commit 
    - -m: 提交记录到分支
    - --amend 对最新的commit进行修改，即不会生成新的commit记录，而是对上一次进行修改
- git reset 恢复
    - --hard [commit'SHA] 恢复到对应的commit记录，比如HEAD^（当前的上一条）；重置工作目录
    - --soft 不同点：保留工作目录和暂存区中的内容，并把重置 HEAD 所带来的新的差异放进暂存区（其实这个有点像commit --amend）
    - 不加参数：保留工作目录，并清空暂存区（一般这样的才喜欢，它的功能可以认为是清除缓存区，但是有副作用）
- git checkout -- [文件名] 可以丢弃工作区的修改，回到最近一次的commit或者add（注意这条命令针对的是工作区）

## 分析记录
- git log 查看记录
    - git log -p 在该指令上，更加细致的展示commit的变化
    - git log --stat 查看的不详细，只是看一下大致内容
    - git show [commit's SHA] [文件名] 查看commit具体该的内容
- git diff 对比
    - git diff --staged 和 上一条提交对比
    - git diff 工作区和缓存区对比
    - git diff [HEAD/commit's SHA] 工作区和对应的commit的对比
- git reflog
    - 无参数 查看整个仓库的记录
    - [分支] 查看当前分支的记录
## 分支

### 操作分支
- 创建分支：
    - git branch [分支名] 
    - git checkout -b [分支名] 创建并切换分支

- 切换分支：
    - git checkout [分支名] 
    - git switch [分支名] 更符合语义

- 查看分支：
    - git branch
    - git branch -v 包含分支的更多信息（最新的commit）

- 删除分支：
    - git branch -d 删除分支（如果没有和master合并过不允许删除，保证不会误删）
    - git branch -D 强制删除分支
- 合并分支
    - git merge [分支名] 将当前的分支和指定分支合并
    - git merge --abort

### 远程分支
- 建立连接：    
    - git remote add    origin [URL]  添加远程分支
- 断开连接：
    - git remote remove origin []
- 查看远程分支
    - git remote 
    - git remote-v 查看远程分支的信息（地址）
- 拉取远程分支：
    - git clone [-b + 远程分支名] [地址] [克隆到本地的仓库的名称]
    - git pull 将远程分支拉取并自动和本地分支合并
- 更新远程分支
    - git push -u origin [分支名] 自动更新远程长裤对应的分支（分支第一次创建，一定要指定分支名）



## 日常中合并分支的几种情况

### 产生冲突的原因
- 如果增加不同文件不会冲突
- 相同文件**改**了不同的地方（注意，修改的是已经已经提交过的部分），也可以合并
- 同一文件里，添加内容不同，修改相同的地方，会产生冲突

### 冲突解决



- 多人共用一分支master，合并远程分支
    - 每次更新本地分支之前先pull一次，再进行commit和push，只要保证先pull，再push就不会有冲突，因为一个分支上，必然能够合并
    - 一旦先commit和push就会导致冲突，这个时候就需要手动去现在保留部分，再次做出commit和push

- 本地工作，合并分支
    - 当本地工作，开启多个分支时，如果多个分支都有commits记录，那么在合并两个分支的时候极有可能产生冲突（冲突原则看上一段解析）
    - git merge进入合并状态时，两个分支内容能合并的会合并，但是发生冲突的地方会标记出来，让我们自己进行选择
    - 选择完成后，再次进行add + commit

- 远程仓库，分支合并
    - 本人：分支先提交到远程仓库
    - 同事：pull分支到本地，审阅代码是否需要修改
    - 同事：确认无误之后进行本地分支合并，发生冲突解决冲突
    - 同事：删除本地分支，删除远程分支，push主分支到远程
- 本地分支应为需要修改，导致和远程仓库冲突
    - 出错的内容在你自己的 branch，git push origin [分支] -f（--force）
    - 出错的内容已经合并到 master，git revert HEAD^（反向的做上一个commit的操作）


## 额外的一些小细节
- git log 需要一直划到底，可以尝试输入q结束
- git reset HEAD [还可以指定文件] 能够利用它的机制，将工作区保留，将缓冲区情况