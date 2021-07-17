# 1. Vue2.6新特性

`2019-02-05(正月初一)` 这天尤大大发布了 2.6 版本，`v2.6.0 Macross (直译：超时空要塞)`。截至到今天 `2019-2-21` 这16天已经发布到了 `v2.6.6`。（春节都不休息，此处应该是捂脸和生无可恋表情）

主要包括下面几方面的优化：

* 新特性
* 重要的内部变动
* Bug修复
* 性能优化

我们需要关注的是 `新特性` 与 `重要的内部变动`

[官网地址](https://github.com/vuejs/vue/releases)

## 1.1. 重要的内部变动

### 1.1.1. 将 nextTick 恢复为 alaways 使用 microtask

当 Vue 检测到数据变化时，它会异步地将 DOM 更新推迟到下一个 `tick`，以便多个变化只触发一个更新周期。在2.5之前的版本中，Vue 一直使用所谓的 `Microtask` 推迟更新

但是存在一种边缘问题：

* 现在有两个组件 A 和 B，A 是父组件，B 是子组件
* B 组件有个 click 方法可以触发组件更新
* A 组件监听了这个方法，同时执行的时候也会触发更新
* 点击 click，`Microtask` 任务会在事件还没有冒泡到 A 组件的时候执行。当到达 A 组件的时候 `Microtask` 会再次执行

在 2.5 版本中为了解决这个问题，对 `Microtask` 做了特殊处理。但是这种改变带来了更多的问题，超出了修复的好处。

在 2.6 版本中找到了一种更加合适的解决方案，用来保证 nextTick 总是使用 `Microtask`

[官网地址](https://gist.github.com/yyx990803/d1a0eaac052654f93a1ccaab072076dd)

### 1.1.2. 确保 `$scopedSlots` 调用总是返回数组

这个变更只影响 render 函数用户。

在 render 函数中，scoped slot 通过 this.$scopedSlots 暴露为函数。在之前版本，调用 scoped slot 函数会根据父组件传入内容返回单个 VNode 或 VNode 数组。这种设计实际上是一种疏忽，因为它返回值的类型不确定，可能会导致意外的边界情况。

在 2.6 版本，scoped slot 函数确保只返回 VNode 数组或 undefined。如果您的现有代码中如果有些地方返回的是数组但没有被检查出来，可能会出问题，需要进行相应的修正。

[官网地址](https://gist.github.com/yyx990803/f5cba7711ab57b5d0dd1f8261ebee278)

## 1.2. 新特性

[具体的内容请去官网查看](https://gist.github.com/yyx990803/d1a0eaac052654f93a1ccaab072076dd)，在这里说一下我们需要知道的几个新特性。

### 1.2.1. slots 新语法、性能优化、向 3.0 看齐

新语法统一了单个指令中普通 slot 和 scoped slot 的使用，并强制使用了更明确和可读性的命名 slot。**并且目前兼容旧写法**

1、作用域插槽

``` html
<foo v-slot="{ msg }">
  {{ msg }}
</foo>

<foo>
  <template v-slot:header="{ msg }">
    <div class="header">
      Message from header slot: {{ msg }}
    </div>
  </template>
</foo>
```

2、具名插槽

``` html
<foo>
  <template v-slot:header>
    <div class="header"></div>
  </template>

  <template v-slot:body>
    <div class="body"></div>
  </template>

  <template v-slot:footer>
    <div class="footer"></div>
  </template>
</foo>
```

3、简写

``` html
<TestComponent>
  <template v-slot:one="{ name }">Hello {{ name }}</template>
  <template v-slot:two="{ name }">Hello {{ name }}</template>
  <template v-slot:three="{ name }">Hello {{name }}</template>
</TestComponent>
<TestComponent>
  <template #one="{ name }">Hello {{ name }}</template>
  <template #two="{ name }">Hello {{ name }}</template>
  <template #three="{ name }">Hello {{name }}</template>
</TestComponent>

<foo v-slot="{ msg }">
  {{ msg }}
</foo>
<foo #default="{ msg }">
  {{ msg }}
</foo>
```

* 所有使用新 v-slot 语法的 slot 都将被编译为 scoped slot，这意味着所有使用新语法的 slot 都会自动获得性能提升
* 现在所有普通的 slot 也通过 this.\$scopedSlots 暴露出来，这意味着使用 render 函数而不是模板的用户现在也可以使用 this.\$scopedSlots，而不用担心传入的 slot 是什么类型
* 在 3.0 中，将不再区分 scoped 与非 scoped slot——所有 slot 将使用统一的语法，被编译为相同的格式，并具有相同的性能

### 1.2.2. 异步错误处理

主要是对生命周期钩子和 v-on 处理程序添加异步错误处理

``` js
export default {
  async mounted() {
    this.posts = await api.getPosts()
  }
}
```

### 1.2.3. 动态指令参数

``` js
<a v-bind:[attributeName]="url"> ... </a>
```

这里的 `attributeName` 会被作为一个 JavaScript 表达式进行动态求值，求得的值将会作为最终的参数来使用。例如，如果你的 Vue 实例有一个 data 属性 `attributeName`，其值为 `href`，那么这个绑定将等价于 `v-bind:href`。

同样地，你可以使用动态参数为一个动态的事件名绑定处理函数：

``` js
<a v-on:[eventName]="doSomething"> ... </a>
```

同样地，当 `eventName` 的值为 `focus` 时，`v-on:[eventName]` 将等价于 `v-on:focus`。

动态参数预期会求出一个字符串，异常情况下值为 null。这个特殊的 null 值可以被显性地用于移除绑定。任何其它非字符串类型的值都将会触发一个警告。

``` html
<!-- 这会触发一个编译警告 且 无效 -->
<a v-bind:['foo' + bar]="value"> ... </a>
```

**变通的办法是使用没有空格或引号的表达式，或用计算属性替代这种复杂表达式。**

### 1.2.4. 显式创建独立的响应式对象

2.6 版本引入了一个新的全局 API，可以显式创建独立的响应式对象：

``` js
const reactiveState = Vue.observable({
  count: 0
})
```

生成的对象可以直接用在计算属性或 render 函数中，并在发生变化时触发对应的更新。