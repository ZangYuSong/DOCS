# git-bash 常用命令

## 基本配置

- `git config --global user.name "name"` : 配置用户名
- `git config --global user.email "email"` : 配置邮箱
- `git remote` : 查看当前远程库
- `git remote add <name> <url>` : 添加远程仓库
- `git remote remove <name>` : 删除远程仓库
- `git remote rename <old> <new>` : 修改远程库的名字
- `git remote show <name>` : 查询远程库主机信息
- `git init` : 初始化本地仓库
- `git init --bare` : 初始化一个空目录，用于搭建自己的远程仓库
- `git clone <url> <path>` : 克隆一个远程库到对应路径下，path 未指定时候指当前目录
- `git diff` : 查看提交和工作树等之间的更改，可以是指定某个文件。也可以指定两个分支之间对比等
- `git status` : 检查文件状态

## git add

- `git add` : 将修改的文件提交到暂存区
- `git add [<path>]` : 将路径中的文件提交到暂存区（1.x 版本中：修改、新增，2.x 版本中：修改、新增、删除）
- `git add --ignore-removal [<path>]` : 将路径中的文件提交到暂存区（2.x 版本中：修改、新增、删除）
- `git add -u [<path>]` : 将路径中的文件提交到暂存区（修改、删除）
- `git add -A [<path>]` : 将路径中的所有文件提交到暂存区（修改、新增、删除）

## git commit

- `git commit` : 提交暂存区的内容
- `git commit -m <msg>` : 提交暂存区的内容，并添加提交信息
- `git commit --amend` : 合并暂存区的内容到上一次的提交内容中。使用场景：提交代码之后发现漏掉了几个文件，再次提交并合并。
- `git commit [-a -m] | [-am]` : 提交所有修改的内容（暂存区和工作区），并添加提交信息。

## git push

- `git push <远程主机名> <远程分支名>:<本地分支名>` : `git push origin master`将 master 分支的代码推送到 origin 远程的 branch 分支中
- `git push -u origin master` : 指定一个默认远程，将本地的 master 分支推送到远程主机的 master 分支中。如果 master 不存在，则会被新建。**首次提交的时候需要执行该命令，指定一个默认的远程**
- `git push` : 将当前分支的代码推送到对应的远程分支中。**指定了默认远程或者只存在一个远程则可以省略主机名。当前分支与远程分支之间存在追踪关系则可以省略分支名**
- `git push origin --delete master | git push origin :master` : 删除 origin 远程的 master 分支

## git pull

- `git pull <远程主机名> <远程分支名>:<本地分支名>` : `git pull origin master`从 origin 远程拉去 master 分支代码并和本地 master 分支合并。**指定了默认远程或者只存在一个远程则可以省略主机名。当前分支与远程分支之间存在追踪关系则可以省略分支名**
- `git pull` 等同于 `git fetch` 和 `git merge` 两个操作
- `git pull --rebase` : 抓去代码合并的同事，剔除一些毫无意义的 merge commit 信息。例如：比如：Merge banchA into branchB.

## git stash

**使用场景：1、修改了部分代码之后又不需要了，想保存起来方便以后查看。2、本地有修改的内容，在同步数据的时候可以临时暂存，随后释放。**

- `git stash` : 将工作区的内容全部存储起来。**只是在本地操作，不会随着 push 发布到远程**
- `git stash save <name>` : 将工作区的内容全部存储起来，并添加标注信息。
- `git stash pop` : 释放上一次的存储信息到工作区
- `git stash <name>` : 释放对应信息的存储数据到工作区
- `git stash list` : 查看所有的暂存信息
- `git stash drop <name>` : 删除对应的存储信息
- `git stash show <name>` : 查看对应存储信息的 diff 数据
- `git stash show -p <name>` : 查看对应存储信息的所有 diff 数据

## git branch

- `git branch` :
- `git branch` : 列出本地已经存在的分支，并且在当前分支的前面用"\*"标记
- `git branch -r` : 查看远程版本库分支列表
- `git branch -a` : 查看所有分支列表，包括本地和远程
- `git branch <name>` : 创建分支
- `git branch -d <name>` : 删除分支
- `git branch -vv` : 查看本地分支对应的远程分支
- `git branch -m <old> <new>` : 分支重命名
- `git checkout <fileName>` : 放弃单个文件的修改
- `git checkout .` : 放弃当前目录下的修改
- `git checkout <name>` : 切换分支
- `git checkout -b <name>` : 分支存在则只切换分支，若不存在则创建并切换

## git reset

- `git reflog` : 查询每次的提交记录
- `git reset HEAD <file>` : 撤销 add 的 file 文件。**HEAD 指当前修改，HEAD^指最近一次的提交，HEAD^^^指最近 3 次的提交等同于 HEAD~3**
- `git reset [HEAD^ | CommitID]` : 回退到上一个版本或者指定版本，保留最近的修改内容
- `git reset --hard [HEAD^ | CommitID]` : 回退到上一个版本或者指定版本，最近的修改记录会丢失，如果还原需要执行 `git reflog` 查找对应的 commit 信息，再 reset 一次
- `git reset --soft [HEAD^ | CommitID]` : 回退到上一个版本或者指定版本，最近的修改内容保存在 stage 中

## git log

- `git log` : 以默认格式和顺序输出提交历史，上下键翻页，Q 键退出
- `git log --oneline` : 每条日志的输出为一行
- `git log -[length]` : 输出几条日志
- `git log –skip=[skip]` : 跳过前几条日志
- `git log -p` : 输出提交信息中的所有 diff 数据
- `git log --name-status` : 输出日志中包含每次提交对应的文件改动
- `git log --author <name>` : 输出对应提交人的提交日志
- `git log --grep <keywords>` : 输出包含该关键字的提交日志
- `git log [commit] | [commit1 commit2] | [commit1..commit2]` : 查询 commit 之前的记录，包含 commit。查询 commit1 与 commit2 之间的记录，包括 commit1 和 commit2。查询 commit1 与 commit2 之间的记录，不包括 commit1
- `git log --stat` : 列出文件的修改行数
- `git log --numstat` : 列出文件的添加 删除行数
- `git log --name-only` : 仅在提交信息后显示已修改的文件清单
- `git log --relative-date` : 使用较短的相对时间显示（比如 2 weeks ago）
- `git log --since '2018-01-01' --until '2018-07-07'` : 显示在 2018-01-01 和 2018-07-07 之间的提交记录，不包括 2018-01-01。或者使用 befor 和 after
- `git log --pretty=format:"%an %ae %ad %cn %ce %cd %cr %s"` : 格式化输出的内容
  - `%H` : 提交对象（commit）的完整哈希字串
  - `%h` : 提交对象的简短哈希字串
  - `%T` : 树对象（tree）的完整哈希字串
  - `%T` : 树对象（tree）的完整哈希字串
  - `%t` : 树对象的简短哈希字串
  - `%P` : 父对象（parent）的完整哈希字串
  - `%p` : 父对象的简短哈希字串
  - `%an` : 作者（author）的名字
  - `%ae` : 作者的电子邮件地址
  - `%ad` : 作者修订日期（可以用 -date= 选项定制格式）
  - `%ar` : 作者修订日期，按多久以前的方式显示
  - `%cn` : 提交者(committer)的名字
  - `%ce` : 提交者的电子邮件地址
  - `%cd` : 提交日期
  - `%cr` : 提交日期，按多久以前的方式显示
  - `%s` : 提交说明

## 常用集合命令

- 获取对应时间内对应提交人的提交代码量 : `git log --since '2018-06-01' --until '2018-07-01' --author="$(git config --get user.name)" --pretty=format: --numstat | gawk '{ add += $1 ; subs += $2 ; loc += $1 - $2 } END { printf "added lines: %s, removed lines : %s, total lines: %s.\n", add, subs, loc }'`
- 显示本仓库中提交次数排名前五的作者 : `git log --pretty='%an' | uniq -c | sort -k1 -n -r | head -n 5`
