# Vue为什么不能直接通过下标给数组赋值

vue 通过 Object.defineProperty 为对象的每个值循环添加 set 和 get 方法。通过这种数据劫持的方式，配合观察者模式来达到数据的响应。

Vue 在组件 beforeCreate 和 created 两个周期之间进行这些处理操作

这就解释了下述情况无法生效的原因：

因为一开始的时候没有 obj.b 这个参数，所以并没有给他添加相应的 get set 方法。无法通知视图的更新等等。

```js
data (){
    return {
        obj: {
            a: 1
        }
    }
}
this.obj.a = 2
this.obj.b = 3 // 不生效
this.set(this.obj, 'b', 3) // 生效
```

## 数组

首先先说一下，不是不能对数组做 Object.definePropert 处理，而是没法做。具体原因如下：

```js
// 假设我们对数组做了 Object.definePropert 处理，如下：
Object.defineProperty(array, '0', {});
Object.defineProperty(array, '1', {});

data (){
    return {
        array: [0]
}
this.array[0] = 2
this.obj[1] = 3 // 不生效
this.set(this.array, '1', 3) // 生效
```

好了到了这里存在以下问题：

* 不可能一开始就知道数组的长度，所以必须使用 set 进行数据操作
* 改变了数组的顺序、改变了数组的长度、或者删除了数据。数组的下标全乱了。这时候怎么办？`Object.defineProperty(array, '0', {});` 我们这个定义到底谁是谁？
* 我们使用数组肯定是要对数组进行赋值、增加、删除、排序等等操作
* 其他原因：暂时没想到
  
综上所述所以**不是不能对数组做 Object.definePropert 处理，而是没法做**

根据上面的描述，我们对数组的操作就剩下以下唯一的一种方式：每次操作完或者操作前 将数组 copy 一份，最后重新赋值。

```js
data (){
    return {
        array: [0, 1, 2, 4]
    }
}

const data = this.array.slice()
// 操作数组 push filter map 等等
this.array = data
```

**但是我们不可能总是这种操作（消耗性能、写法不优美等等）**。因此 vue 除了 set 方法之外，还帮我们处理了一批可以操作数组且触发视图响应的方法。

``` js
// 源码 816 行
var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];
```

这些方法操作数组都会触发视图的响应