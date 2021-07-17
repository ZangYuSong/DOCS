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

// 再优化，因为我们只关心前两个数值
var rob = function (nums) {
  if (!nums || nums.length === 0) return 0;
  const len = nums.length;
  let a = 0;
  let b = nums[0];
  let c;
  for (let i = 1; i < len; i += 1) {
    c = b;
    b = Math.max(b, a + nums[i]);
    a = c;
  }
  return b;
};
```

## 示例 2

[10. 正则表达式匹配](https://leetcode-cn.com/problems/regular-expression-matching/)

- 1、`dp[i][j]` 表示 s 的前 i 个字符能否被 p 的前 j 个字符匹配
- 2、如果 `s[i] === p[j] || p[j] === '.'`，则 `dp[i][j] = dp[i-1][j-1]`
- 3、如果 `p[j] === '*'`，\* 表示零个或者多个 n，因此我么你需要看他的前一个字符
  - 3-1、如果 `s[i] === p[j-1] || p[j-1] === '.'`，则 `dp[i][j] = dp[i-1][j] ||dp[i][j-1] || dp[i][j-2]`
  - 3-2、否则我们将 n 设置为 0，也就是看下一个字符 `dp[i][j] = dp[i][j-2]`

着重讲一下 3-1 的情况：

- \* 表示零个或者多个，用 n 表示
- 目前 p 在 j-1 位置上
- `n === 0`，这种情况则看他下一个字符，也就是 `dp[i][j] = dp[i][j-2]`
- `n === 1`，也就是 `dp[i][j] = dp[i][j-1]`。我们本身已经在讨论 j 的前一个字符(j - 1)来判断 `dp[i][j]` 状态，在 3-1 条件下 j-1 已经匹配成功，所以 `dp[i][j] = dp[i][j-1]`
- `n > 1`，也就是 `p[j-1]` 这个字符可能会匹配多个 `s[i]` 之前的字符，这是我们就看 `dp[i-1][j]` 的状态
  - `dp[i][j] = dp[i-1][j]`
  - 假设 n === 2，这时候我们求 `dp[i-1][j]`。类似现在求 `dp[i][j]` n === 1 的情况
  - 以此类推

优化：

为了方便处理我们都加个空字符用来处理特殊情况和简化操作

并且设置 `dp[0][0] = true`

同时因为多加了一个空字符串，因此需要将 `dp[0]` 的内容处理一下。遇见 \* 将这个字符的前前一个状态赋值给他

```js
var isMatch = function (s, p) {
  s = " " + s;
  p = " " + p;
  const ls = s.length;
  const lp = p.length;
  const dp = new Array(ls);
  for (let i = 0; i < ls; i += 1) {
    dp[i] = new Array(lp).fill(false);
  }
  dp[0][0] = true;
  for (let i = 1; i < p.length; i += 1) {
    if (p[i] === "*") {
      dp[0][i] = dp[0][i - 2];
    }
  }
  for (let i = 1; i < ls; i += 1) {
    for (let j = 1; j < lp; j += 1) {
      if (s[i] === p[j] || p[j] === ".") {
        dp[i][j] = dp[i - 1][j - 1];
      } else if (p[j] === "*") {
        if (s[i] === p[j - 1] || p[j - 1] === ".") {
          dp[i][j] = dp[i - 1][j] || dp[i][j - 1] || dp[i][j - 2];
        } else {
          dp[i][j] = dp[i][j - 2];
        }
      }
    }
  }
  return dp[ls - 1][lp - 1];
};
```
