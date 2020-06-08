# 并查集（Disjoint Set）

## 简介

并查集是一种非常精巧而实用的数据结构，它主要用于处理一些不相交集合的合并问题。一些常见的用途有求连通子图、求最小生成树的 Kruskal 算法和求最近公共祖先（Least Common Ancestors, LCA）等。

常常在使用中以**森林**来表示。集就是让每个元素构成一个单元素的集合，也就是按一定顺序将属于同一组的元素所在的集合合并。

详细内容可以参考视频：[视频地址](https://www.bilibili.com/video/BV13t411v7Fs?p=1)

## 思路

- 初始化将所有的元素都独立为一个集合/树，形成**森林**
- 循环处理
  - x -> y 组成一个路径，表示 x y 是一个集合
  - 分别查找 x y 的根节点，并将对应的两个树合并

## 实现

[990. 等式方程的可满足性](https://leetcode-cn.com/problems/satisfiability-of-equality-equations/)

以上述题目为例子：

```js
/**
 * 使用数组来表示森林，-1 表示该元素为根节点
 * 例如：
 * [-1, 0, -1, -1] 表示 1 元素的父节点是 0 元素
 * [-1, 0, -1, 1]  表示 1 元素的父节点是 0 元素，3 元素的父节点是 1 元素
 *
 * 初始化全部为 -1
 */
function DisjointSet(num) {
  this.parents = new Array(num).fill(-1);
}

DisjointSet.prototype.getRoot = function getRoot(x) {
  if (-1 === this.parents[x]) return x;
  return this.getRoot(this.parents[x]);
};

DisjointSet.prototype.union = function union(x, y) {
  const xR = this.getRoot(x);
  const yR = this.getRoot(y);
  if (xR !== yR) {
    // 如果不是同一个根节点，将两个根节点合并，也就是将两个树合并
    this.parents[yR] = xR;
  }
};

/**
 * @param {string[]} equations
 * @return {boolean}
 */
function equationsPossible(equations) {
  const noEq = [];
  const ds = new DisjointSet(26);
  equations.forEach((item) => {
    if ("=" === item[1]) {
      // 将所有的 x==y 的元素处理，生成一个集合
      // 将字母转换为对应的数字 0 - 26
      ds.union(item.charCodeAt(0) - 97, item.charCodeAt(3) - 97);
    } else {
      noEq.push(item);
    }
  });
  // 从不相等的集合中，分别查找 x y 的根节点
  // 如果一致则表示两个元素相等，也就是再同一个集合中。
  // 如果找到返回 false
  // 没有找到返回 true
  return !noEq.find(
    (item) =>
      ds.getRoot(item.charCodeAt(0) - 97) ===
      ds.getRoot(item.charCodeAt(3) - 97)
  );
}
```

## 优化

> 在 union 函数中，我们合并的时候不能随便合并，因为有可能会出现非常长的一侧（不平衡树），这样查找节点就会影响效率。因此我们应该尽量生成一个相对平衡的树。

例如：分别有两个集合进行合并，如下：

```
0 3
  45
```

如果随便合并就会出现：3 指向 0

```
0
3
45
```

其实我们应该这样合并：0 指向 3

```
3
045
```

```js
function DisjointSet(num) {
  this.parents = new Array(num).fill(-1);
  // 用来表示当前根节点树的高度
  this.heights = new Array(num).fill(0);
}

DisjointSet.prototype.getRoot = function getRoot(x) {
  if (-1 === this.parents[x]) return x;
  return this.getRoot(this.parents[x]);
};

DisjointSet.prototype.union = function union(x, y) {
  const xR = this.getRoot(x);
  const yR = this.getRoot(y);
  if (xR !== yR) {
    // 高度低的树指向高度高的树
    if (this.heights[xR] >= this.heights[yR]) {
      this.parents[yR] = xR;
      if (this.heights[xR] === this.heights[yR]) {
        // 如果高度一样，这个时候合并则对应的树高度加一
        this.heights[xR] += 1;
      }
    } else {
      this.parents[xR] = yR;
    }
  }
};
```
