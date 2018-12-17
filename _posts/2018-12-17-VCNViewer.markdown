---
layout: post
title:  "VNCViewer配置的一些问题"
date:   2018-12-17 21:54:38 +0800
categories: Linux
---

vncviewer配置的一些问题已经有很多人说过了，总的来说没有太大困难。  
但是我碰到了一个很有意思的问题，就是怎么修改远程桌面的分辨率。我的xstartup文件配置如下：  
```
#!/bin/sh

# Uncomment the following two lines for normal desktop:
# unset SESSION_MANAGER
# exec /etc/X11/xinit/xinitrc

#!/bin/sh

# Uncomment the following two lines for normal desktop:
#unset SESSION_MANAGER
#unset DBUS_SESSION_BUS_ADDRESS
#exec /etc/X11/xinit/xinitrc
[ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
[ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
xsetroot -solid grey
vncconfig -iconic &
x-terminal-emulator -geometry 1980x1020 -ls -title "$VNCDESKTOP Desktop" &
#x-window-manager &
if test -z "$DBUS_SESSION_BUS_ADDRESS" ; then
        eval `dbus-launch --sh-syntax`
        echo "D-BUS per-session daemon address is: \
        $DBUS_SESSION_BUS_ADDRESS"
fi
gnome-session &
gnome-panel &
gnome-settings-daemon &
metacity &
nautilus &
```
但是桌面看起来很小，跟我的显示器明显不配。  
![]({{'/assets/5.png'| absolute_url }})  
无论怎么修改xstartup都没有用，搜了很多方法，发现了一个很简单的方法：  
在启动vncserverd的时候，设置参数就行：  
>> vncserver -geometry 1980x1020:5   

1980x1020是分辨率，5是指定的端口号。当然，在执行之前需要先关掉现在的端口*vncserver -kill :5* 。最后的结果就是如下图所示：  
![]({{'/assets/6.jpeg'| absolute_url }})  
