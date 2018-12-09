---
layout: post
title:  "Tensorflow出现Couldn't open CUDA library libcupti.so.9.0. LD_LIBRARY_PATH: /usr/local/cuda-9.0/lib64
"
date:   2018-12-09 20:54:38 +0800
categories: Tensorflow
---
是当前环境没有配置cuda的路径，所以直接配置一下就好了。
> export LD_LIBRARY_PATH="/usr/local/cuda-9.0/lib64:/usr/local/cuda-9.0/extras/CUPTI/lib64"
