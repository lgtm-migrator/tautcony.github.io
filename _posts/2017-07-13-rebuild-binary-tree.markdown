---
layout:     post
title:      "重建二叉树"
subtitle:   "花式遍历，花式重建"
date:       2017-07-13
author:     "TautCony"
catalog:    true
header-img: null
image:
  credit: GeoPattern
  creditlink: https://github.com/btmills/geopattern
tags:
    - 数据结构
---

今天摸了一些二叉树相关的题目。效率低下。。。

<!--more-->

周知，二叉树能够被花式遍历，常见的有前中后和层序遍历，然后既然有了这些遍历序列，那些无聊的老头子们就能开始出题了。

而二叉树的重建有两类，一种是能唯一确定二叉树的，还有一种是不唯一的。

此处所举例的二叉树如下图:
```
      .1..      
     /    \     
    2      3    
   /      / \   
  4      5   6  
   \        /   
    7      8    
```

# 唯一确定一颗二叉树的序列组合

## 前/后序遍历与中序遍历

由于前序和后序并没有本质区别，此处以前序为例。

> 前序序列: `[1,2,4,7,3,5,6,8]` 和中序序列: `[4,7,2,1,5,3,8,6]`

1. 根据定义，我们可以知道前序遍历中的`1`是该树的根节点，剩下的序列由其左子树的前序序列和右子树的前序序列组成。

2. 根据定义，我们又可以知道在中序序列中，根节点被左子树的中序序列和右子树的中序序列夹在中间，而我们又从前序序列中获知了当前树的根节点为`1`，此时我们看节点`1`在中序序列中的位置，如此我们就能知道`[4,7,2]`和`[5,4,8,6]`分别是该树的左子树和右子树。

3. 再返回来看前序序列，我们可以知道，上一步所获得的左右子树的前序序列分别是`[2,4,7]`和`[3,5,6,8]`，到了这一步，我们就可以重新返回第一步分别对两个子树进行相同的操作直到整颗二叉树重建完毕。

## 层序遍历与中序遍历

思路也是相近的

1. 层序遍历的第一个值为当前树的根节点。

2. 到中序序列中找到该节点，从而获得左右子树的中序序列。

3. 再回到层序序列，遍历序列，获得左右子树的层序序列。重新回到第一步，重复操作直到整颗二叉树重建完毕。

# 不能唯一确定一颗二叉树的序列组合

而前序和后序的遍历序列的却无法唯一确定一颗二叉树。

> 前序序列: `[1,2,4,7,3,5,6,8]` 和后序序列: `[7,4,2,5,8,6,3,1]`

让我们先试着用相似的方式进行重建。

1. 根据定义，我们可以知道前序的第一个与后序的最后一个应为相同元素并且为该树的根节点，此处为`1`。

2. 那么效仿上面的方法，我们应该要在这一步中获取剩余序列中左子树和右子树分别为哪部分。很遗憾现在并没有一个根节点将左右子树分割开来，~~那么只能随缘判断了~~。现在剩余的序列是`[2,4,7,3,5,6,8]`和`[7,4,2,5,8,6,3]`，我们要找到一个分割点，使得能将序列分成左右子树两个部分，并且切出来的左右子树也应满足一颗二叉树前序和后序遍历的性质。稍作观察可以发现，可以在第三个元素后面划一条分割线，从而获得左右子树的序列。

3. 这样一看似乎并没有什么特别大的问题，继续做下去也能获得一颗二叉树。那么到底是什么阻碍了前序和后序唯一确定一颗二叉树呢？其实，在上面一步，还没触碰到其出现歧义的地方而已。当某颗子树只有一个子节点的时候，就会出现歧义了。如上面的例子再往后进行几步，可得`[2,4,7]`和`[7,4,2]`这两个序列，显然该子树的根节点为`2`，并且`4`和`7`不可能是`2`的两个子节点。稍作思考，还可以发现`4`为`7`的父节点。但是进一步，究竟`4`是在`2`的左边还是右边呢，`7`是在`4`的左边还是右边呢？毕竟二叉树不是度为`2`的树，还是有所不同的。

```
      2  |    2  |  2    |  2      
     /   |   /   |   \   |   \     
    4    |  4    |    4  |    4    
   /     |   \   |   /   |     \   
  7      |    7  |  7    |      7  
```

如上图的四个二叉树都符合给定的序列要求。
