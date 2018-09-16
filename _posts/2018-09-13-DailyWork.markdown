---
layout: post
title:  "Ubuntu环境下，查看硬盘资源占用情况"
date:   2018-09-12 20:54:38 +0800
categories: 日常碰到的一些小问题
---

### 硬盘资源占用情况
#### 第一种是查看服务器所有硬盘的使用情况，输入`df -h`，就可以查看到以下内容：  
![]({{'/assets/3.png'| absolute_url }})  
#### 第二种是查看所有用户硬盘的使用情况，输入`sudo du -sh *`，此时会要求有sudo权限，可以看到以下内容：  
![]({{"/assets/4.png"| absolute_url }})  
内容简单明了，无需解释。