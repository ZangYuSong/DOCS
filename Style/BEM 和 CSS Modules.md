# BEM 和 CSS Modules

## 简介

- CSS 入门简单，深入就比较难，样式简单维护难。
- 因为 CSS 是全局性的，所以很容易就出现样式冲突的问题。为解决这个问题。最通常的做法是 CLASS 命名写长一点或者加一层父级选择器从而降低冲突的几率。但是这样 CSS 的命名就变得很混乱。因此就出现了这样一种解决方案：命名约定。例如：BEM、OOCSS、AMCSS、SMACSS。其中使用最为广泛的是 BEM。
- CSS 的代码很难复用，需要大量编写重复的代码。因此出现了 less、scss 这样预编译语言。
- 前端已经模块化了，按理来说 CSS 也应该组件化。我们再引入组件的时候应该只用引入组件对应的 CSS 即可。这时候出来了一种解决方案：CSS Modules

在这里我们不来描述 less 和 scss。我们来看一下 BEM 和 CSS Modules

## BEM

BEM 是 Block（块） Element（元素） Modifier（修饰器）的简称

使用 BEM 规范来命名 CSS，组织 HTML 中选择器的结构，利于 CSS 代码的维护，使得代码结构更清晰（弊端主要是名字会稍长）。

规则说明：

- 一个独立的（语义上或视觉上），可以复用而不依赖其它组件的部分，可作为一个块（Block）
- 属于块的某部分，可作为一个元素（Element）
- 用于修饰块或元素，体现出外形行为状态等特征的，可作为一个修饰器（Modifier）
- 以双下划线 \__ 来作为块和元素的间隔，以单下划线 _ 来作为块和修饰器或元素和修饰器的间隔，以中划线 - 来作为 块|元素|修饰器 名称中多个单词的间隔
- 在样式文件中，仅以类名作为选择器，不使用 ID 或标签名来约束选择器，且 CSS（或者 SCSS 编译后的 CSS）中的**选择器嵌套不超过 2 层**，增加效率和复用性，减少选择器之间的耦合度
- BEM 规范虽然结构比较清晰，但有时候会产生代码冗余。为避免写太多重复性的代码，我们要学会善于利用预编译语言（适当地使用 @include @extend 等）。

更加详细的可以查看官网：[官网地址](https://github.com/Tencent/tmt-workflow/wiki/%E2%92%9B-%5B%E8%A7%84%E8%8C%83%5D--CSS-BEM-%E4%B9%A6%E5%86%99%E8%A7%84%E8%8C%83)

## CSS Modules

CSS Modules 不是将 CSS 改造的具有编程能力，而是加入了局部作用域、依赖管理。可以有效避免全局污染和样式冲突，能最大化地结合现有 CSS 生态和 JS 模块化能力。

webpack 自带的 css-loader 组件，自带了 CSS Modules，通过简单的配置即可使用：

```js
module.exports = {
  // ...
  module: {
    // ...
    rules: [
      // ...
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // 开启模块化
              modules: true,
              // 指定编译的 CSS 名
              localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          }
        ]
      }
    ]
  }
}
```

### 指定作用域

CSS module 将 class 转换成对应的全局唯一 hash 值来形成局部作用域。使用了 CSS Modules 后，就相当于给每个 class 名外加了一个 :local 这是默认的，也可以显式使用。当然，如果你想切换到全局模式，CSS Modules 允许使用:global(.className)的语法，声明一个全局规则。凡是这样声明的 class，都不会被编译成哈希字符串

```css
/* 全局样式 */
:global(.color-red) {
  color: red;
}
/* 等同于 :local(.color-warn) */
.color-warn {
  color: #e64340;
}
```

### 样式复用

对于样式复用，CSS Modules 提供了 composes 组合 的方式来处理。一个选择器可以继承另一个选择器的规则。

```css
.color-warn {
  color: #e64340;
}
.span {
  composes: color-warn;
  /* 继承来自其他文件的样式 */
  composes: shadow from './author.css';
  border: 1px soild #ccc;
}
```

### 如何使用

react 中使用

```js
import React, { Component } from 'react'
import styles from './styles.css'

class Demo extends Component {
  render() {
    return <span className={styles.span}>我是一串文字</span>
  }
}

export default Demo
```

vue 中使用

```html
<template>
  <div>
    <span :class="$style.red">我是一串文字</span>
  </div>
</template>
<style module>
  .red {
    color: red;
  }
</style>
```

vue 中的 scoped 和 module 不太一样。上边示例如果使用 scoped 则最终会打包成这个样子：`.red[data-v-0467f817]`。如果我有个 red 样式优先级很高则还是会影响这里的样式。使用 module 则更加彻底一些。

### 注意事项

- CSS Modules 只转换 class 和 id，此外的标签选择符、伪类等都不会被转换，建议只使用 class
- 所有样式通过 composes 组合来实现复用
- 不叠加多个 class
- 不嵌套多个 class
