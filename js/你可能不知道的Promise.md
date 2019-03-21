# 你可能不知道的 Promise

## 简介

- Promise 有三种状态：pending（进行中）、fulfilled（已成功）和 rejected（已失败）
- 只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态
- 一旦状态改变，就不会再变
- 状态只能 pending->fulfilled/rejected
- 如果状态改变已经发生了，你再对 Promise 对象添加回调函数，也会立即得到这个结果

## then

- 接受两个方法参数，第一个参数是 resolved 状态的回调函数，第二个参数（可选）是 rejected 状态的回调函数
- then 方法返回的是一个新的 Promise 实例（注意，不是原来那个 Promise 实例）
- then 方法可以采用链式回调，后一个 then 接收的参数是前一个的返回值
- 后一个 then 的状态取决于前一个 then 返回的状态

```js
var promise = new Promise((resolve, reject) => {
  reject(1)
})
promise.then(null, data => {
  console.log(data) // 1
})
promise.then(null, data => {
  console.log(data) // 1
})

// 第一个执行的是 rejected，第二个执行的是 resolved
new Promise((resolve, reject) => {
  reject(1)
})
  .then(null, data => {
    console.log(data) // 1
  })
  .then(data => {
    console.log(data) // undefined
  })

new Promise((resolve, reject) => {
  reject(1)
})
  .then(null, data => {
    console.log(data) // 1
    return Promise.reject(data + 1)
  })
  .then(null, data => {
    console.log(data) // 2
  })
```

## catch

- 指定发生错误时的回调函数
- rejected 状态或者 then 方法处理数据出错都会触发
- 拥有 then 的后三种状态

```js
new Promise((resolve, reject) => {
  reject(1)
})
  .catch(data => {
    console.log(data) // 1
    return Promise.reject(data + 1)
  })
  .then(null, data => {
    console.log(data) // 2
  })

new Promise((resolve, reject) => {
  resolve(1)
})
  .catch(data => {
    console.log(data) // 1
  })
  .catch(data => {
    console.log(data) // 不执行
  })

new Promise((resolve, reject) => {
  resolve(1)
})
  .catch(data => {
    console.log(data) // 1
  })
  .then(data => {
    console.log(data) // undefined
  })
```

## finally (ES2018 引入)

- 指定不管 Promise 对象最后状态如何，都会执行的操作
- 不接受任何参数
- finally 方法总是会返回原来的值，也就是在你的链式调用里边加不加它都不会影响原本的流程。在上述代码实例中任何一个位置添加 finally 都不会影响原本的输出

```js
const loading = true
http.get('/xxx').then(
  data => {
    // 处理
    loading = false
  },
  data => {
    // 处理
    loading = false
  }
)

const loading = true
http
  .get('/xxx')
  .then(
    data => {
      // 处理
    },
    data => {
      // 处理
    }
  )
  .finally(() => {
    loading = false
  })
```

## Promise.all()

`var p = Promise.all([p1, p2])`

- 将 p1, p2，包装成一个新的 Promise 实例 p
- 接受一个数组作为参数，参数可以试 Promise，也可以不是。不是的时候会自动转换为 Promise
- 当 p1, p2 都返回 resolve，p 才会 resolve。p 的接收值是 p1, p2 返回值组成的一个数组
- 当 p1, p2 其中有一个 reject，p 就会返回 reject。p 的接收值是 p1, p2 中第一个 reject 的返回值

## Promise.race()

与 `Promise.all` 类似，不同的是只要 p1, p2 其中有一个的状态发生变化，p 的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 p 的回调函数。

## Promise.resolve()

- 将现有对象转为 Promise 对象
- 参数是 Promise 实例，那么 Promise.resolve 将不做任何修改、原封不动地返回这个实例
- 参数是一个 thenable 对象，thenable 对象指的是具有 then 方法的对象。Promise.resolve 方法会将这个对象转为 Promise 对象，然后就立即执行 thenable 对象的 then 方法
- 如果参数是一个原始值，或者是一个不具有 then 方法的对象，则 Promise.resolve 方法返回一个新的 Promise 对象，状态为 resolved。并且将其接收的参数传递下去
- 如果没有参数，则 Promise.resolve 方法返回一个新的 Promise 对象，状态为 resolved。

## Promise.reject()

- 返回一个新的 Promise 实例，该实例的状态为 rejected
- 将接收的参数原封不动地作为后续方法的参数

## Promise.try()

- 不知道或者不想区分，函数 f 是同步函数还是异步操作，但是想用 Promise 来处理它。因为这样就可以不管 f 是否包含异步操作，都用 then 方法指定下一步流程，用 catch 方法处理 f 抛出的错误。
- Promise.try 就是模拟 try 代码块，就像 promise.catch 模拟的是 catch 代码块

## Promise + Generator

实现类似 async/await 功能，实际上他就是通过这两个结合实现的

```js
const g = function*() {
  const foo = yield new Promise(function(resolve, reject) {
    resolve('foo')
  })
  console.log(foo)
}
function run(generator) {
  const it = generator()
  function go(result) {
    if (result.done) return result.value
    return result.value.then(
      function(value) {
        return go(it.next(value))
      },
      function(error) {
        return go(it.throw(error))
      }
    )
  }
  go(it.next())
}
run(g)
```
