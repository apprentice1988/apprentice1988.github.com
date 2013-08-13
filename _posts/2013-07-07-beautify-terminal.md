---
layout: post
category: tools
---

### 1. 美化terminal

原生的bash样子是这样的

<img src="/css/images/old-terminal.png">

在～/.bashrc 中复制粘贴如下代码：

```
parse_git_branch() {  git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/'}
c_1="\[\e[0m\]"c0="\[\e[30m\]"
c1="\[\e[31m\033[1m\]"
c2="\[\e[32m\033[1m\]"
c3="\[\e[33m\]"
c4="\[\e[34m\]"
c5="\[\e[35m\]"
c6="\[\e[36m\]"
c7="\[\e[37m\]"
PS1="$c2\W $c3(\$(~/.rvm/bin/rvm-prompt v g)) $c1\$(parse_git_branch) $c_1$ "
```

重开terminal，看看是不是好看点了。

<img src="/css/images/new-terminal.png">

### 2. 美化git log

美化之前是这样的

<img src="/css/images/old-log.png">

在terminal中执行

```
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative"
```

输入

```
git lg
```

效果如下

<img src="/css/images/new-log.png">

每行表示一个commit,有graphic, 分支，名字，时间，用户。