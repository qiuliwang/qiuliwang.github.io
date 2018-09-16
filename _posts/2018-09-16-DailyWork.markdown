---
layout: post
title:  "GitHub同步的一些问题"
date:   2018-09-16 20:54:38 +0800
categories: 日常碰到的一些小问题
---

### 添加了ignore但是文件的修改依然会被跟踪  
> git rm -r --cached .  
> git add .  
> git commit -m 'update .gitignore' 

### 因为本地做了修改而无法pull的时候  
注意：这个方法会使得本次修改消失
> git fetch --all   
> git reset --hard origin/master 