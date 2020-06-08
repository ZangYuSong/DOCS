# 动态规划 (Dynamic programming / DP)

## 简介

动态规划主要用来解决一些希望找到问题最优解的优化问题。

一种可以用动态规划解决的情况就是会有反复出现的子问题，然后这些子问题还会包含更小的子问题。相比于不断尝试去解决这些反复出现的子问题，动态规划会尝试一次解决更小的子问题。之后我们可以将结果输出记录在表格中，我们在之后的计算中可以把这些记录作为问题的原始解。

以下是两种不同的动态规划解决方案：

- 自上而下：你从最顶端开始不断地分解问题，直到你看到问题已经分解到最小并已得到解决，之后只用返回保存的答案即可。这叫做记忆存储。
- 自下而上：你可以直接开始解决较小的子问题，从而获得最好的解决方案。在此过程中，你需要保证在解决问题之前先解决子问题。这可以称为表格填充算法。
- 至于迭代和递归与这两种方法的关系，自下而上用到了迭代技术，而自上而下则用到了递归技术。

## 举例说明

有一座高度是 10 级台阶的楼梯，从下往上走，每跨一步只能向上 1 级或者 2 级台阶。要求用程序来求出一共有多少种走法。

现在我们来细化：

- 因为每一步可能是走一个台阶，或者两个台阶
- 我们用 F(n) 表示 走 n 个台阶可能的情况
- 假设我们只剩最后一步就走完所有的台阶
  - 如果走 1 个台阶现在就在台阶 n-1 处，1 到 n-1 处总共有 F(n-1) 种走法
  - 如果走 2 个台阶现在就在台阶 n-2 处，1 到 n-2 处总共有 F(n-2) 种走法
  - 因此 F(n) = F(n-1) + F(n-2)
- 我们知道 F(1) = 1 F(2) = 2，所以 F(3) = F(2) + F(1) = 3
- 这样我们就可以求出 F(n)

```js
// 递归 自上而下 记忆存储
function DP(n) {
  if (n == 1) return 1;
  if (n == 2) return 2;
  return DP(n - 1) + DP(n - 2);
}

// 迭代 自下而上 表格填充
function DP(n) {
  if (n == 1) return 1;
  if (n == 2) return 2;
  const result = [1, 2];
  for (let i = 2; i < n; i += 1) {
    result.push(result[i - 1] + result[i - 2]);
  }
  return result[n - 1];
}
```

## 实际示例

[198. 打家劫舍](https://leetcode-cn.com/problems/house-robber/)

- F(n) 表示 n 户可以窃取的最大金钱
- m(n) 表示 第 n 户的金钱
- 假设我们剩下一户人家
  - 这个时候 F(n-1) 表示 n-1 窃取的最大数
  - 这个时候 F(n-2) 表示 n-2 窃取的最大数
  - 如果 F(n-2) + m(n) 比 F(n-1) 多，那么 F(n) = F(n-2) + m(n)，否则 F(n) = F(n - 1)
  - 因此我们可以知道 `F(n) = Math.max(F(n-2) + m(n), F(n-1))`
  - 需要注意 `F(1) = m(1)` `F(2) = Math.max(m(2), F(1))`

```js
var rob = function (nums) {
  if (!nums || nums.length === 0) return 0;
  const len = nums.length;
  if (len === 1) return nums[0];
  const res = [nums[0], Math.max(nums[0], nums[1])];
  for (let i = 2; i < len; i += 1) {
    res.push(Math.max(res[i - 1], res[i - 2] + nums[i]));
  }
  return res[len - 1];
};

// 简化一下
var rob = function (nums) {
  if (!nums || nums.length === 0) return 0;
  const len = nums.length;
  const res = [0, nums[0]];
  for (let i = 1; i < len; i += 1) {
    res.push(Math.max(res[i], res[i - 1] + nums[i]));
  }
  return res[len];
};
```
