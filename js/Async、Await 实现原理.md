# Async、Await 实现原理

## 简介

- async 用于声明一个函数是异步的
- await 用于等待异步完成
- await 只能在 async 函数中使用
- async 返回一个 promise
- await 后边永远跟的是一个 promise，如果是一个非 promise，则会自动转换为 promise
- Async、Await 是通过 Generator + Promise 实现

## babel 转码

```js
async function data1() {
  const aa = await new Promise(function(recolve) {
    setTimeout(function() {
      recolve()
    }, 3000)
  })
  console.log(1)
  console.log(2)
  await console.log(3)
  var bb = await (1 + 1)
}
```

```js
// 通过 babel 转码之后的 ES5 代码
var data1 = (function() {
  var _ref = _asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
      var aa, bb
      return regeneratorRuntime.wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                _context.next = 2
                return new Promise(function(recolve) {
                  setTimeout(function() {
                    recolve()
                  }, 3000)
                })
              case 2:
                aa = _context.sent
                console.log(1)
                console.log(2)
                _context.next = 7
                return console.log(3)
              case 7:
                _context.next = 9
                return 1 + 1
              case 9:
                bb = _context.sent
              case 10:
              case 'end':
                return _context.stop()
            }
          }
        },
        _callee,
        this
      )
    })
  )

  return function data1() {
    return _ref.apply(this, arguments)
  }
})()

function _asyncToGenerator(fn) {
  return function() {
    var gen = fn.apply(this, arguments)
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg)
          var value = info.value
        } catch (error) {
          reject(error)
          return
        }
        if (info.done) {
          resolve(value)
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step('next', value)
            },
            function(err) {
              step('throw', err)
            }
          )
        }
      }
      return step('next')
    })
  }
}
```

通过上述代码，babel 把我们原本的 async/await 代码，转换成了一个 Generator + Promise 的代码。我们来看一下代码：

- 将 async/await 转换为 \_asyncToGenerator 包装的 Generator
- \_asyncToGenerator 自动执行 next 方法
- 第一次 \_context.next = 0，执行对应的方法得到对应的 value `var info = gen[key](arg); var value = info.value`。这个 value 是一个 promise，因此当 value resolve 之后才会执行下一个 next 的，并将对应的值传递给 next 方法，这时候 \_context.next = 2，在这里将我们 resolve 的值传递给了 \_context.sent，并在对应的 case 中赋值给我定义的变量 aa
- 当所有迭代器完成之后 resolve 最外层的 promise
