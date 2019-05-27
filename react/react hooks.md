# React 新特性 React Hooks

## 解决的问题

- 目前我们的 react 组件分为两种，无状态组件(Function)和状态组件(Class)。**Hook 可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性**

  ```js
  // 状态组件
  import React, { Component } from 'react'
  class Demo extends Component {
    state = {
      data: 0
    }
    render() {
      const { data } = this.state
      return <input value={data} />
    }
  }

  // 无状态组件
  function Demo() {
    return <input />
  }
  ```

- 使用 Class 模式，则需要考虑的 this 的指向问题

  ```js
  // 状态组件
  import React, { Component } from 'react'
  class Demo extends Component {
    onChange1 = () => {}

    onChange2() {}

    render() {
      return (
        <div>
          <input onChange={this.onChange1} />
          <input onChange={this.onChange2.bind(this)} />
        </div>
      )
    }
  }
  ```

- 生命周期钩子函数里的逻辑太乱：我们通常希望一个函数只做一件事情，但我们的生命周期钩子函数里通常同时做了很多事情。比如我们需要在 componentDidMount 中发起 ajax 请求获取数据，绑定一些事件监听等等。同时，有时候我们还需要在 componentDidUpdate 做一遍同样的事情。当项目变复杂后，这一块的代码也变得不那么直观。**Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）**，而并非强制按照生命周期划分。你还可以使用 reducer 来管理组件的内部状态，使其更加可预测

## 简介

- React 采用了渐进模式，并没有将 Class 移除。Hook 和现有代码可以同时工作，你可以渐进式地使用他们
- 只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用
- 只能在 React 的函数组件中调用 Hook。不要在其他 JavaScript 函数中调用

## 常用 Hook

### useState

useState 会返回一对值：当前状态和一个让你更新它的函数，你可以在事件处理函数中或其他一些地方调用这个函数

```js
import React, { useState } from 'react'

function Demo() {
  const [count, setCount] = useState(0)
  const [str, setStr] = useState('a')
  const [bool, setBool] = useState(true)
  return (
    <div>
      <button
        onClick={() => {
          setCount(count + 1)
        }}
      >
        加
      </button>
      <button
        onClick={() => {
          setCount(count - 1)
        }}
      >
        减
      </button>
      <input value={count} />
    </div>
  )
}
// 等同于
// this.setState({ str: 'b' })
// setStr('b')
// this.setState({ bool: false })
// setBool(false
class Demo extends Component {
  state = {
    count: 0,
    str: 'a',
    bool: true
  }
  render() {
    const { count } = this.state
    return (
      <div>
        <button
          onClick={() => {
            this.setState({ count: count + 1 })
          }}
        >
          加
        </button>
        <button
          onClick={() => {
            this.setState({ count: count - 1 })
          }}
        >
          减
        </button>
        <input value={count} />
      </div>
    )
  }
}
```

### useEffect

- 在 React 组件中执行过数据获取、订阅或者手动修改过 DOM。我们统一把这些操作称为“副作用”，或者简称为“作用”
- useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被合并成了一个 API
- 当你调用 useEffect 时，就是在告诉 React 在完成对 DOM 的更改后运行你的“副作用”函数。由于副作用函数是在组件内声明的，所以它们可以访问到组件的 props 和 state
- 默认情况下，React 会在每次渲染后调用副作用函数 —— 包括第一次渲染的时候
  ```js
  import React, { useState, useEffect } from 'react'
  function Example() {
    const [count, setCount] = useState(0)
    useEffect(() => {
      document.title = `You clicked ${count} times`
    })
    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>Click me</button>
      </div>
    )
  }
  ```
- useEffect 传递第二个参数，它是 effect 所**依赖的值数组**。除了第一次外只有当对应的状态发生变化的时候才会调用对应的 useEffect
  ```js
  import React, { useState, useEffect } from 'react'
  export default function() {
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(1)
    const [dataSource, setDataSource] = useState([])
    const [total, setTotal] = useState([])
    useEffect(() => {
      // 加载数据或者处理数据
      setTotal(current * pageSize)
      setDataSource(new Array(current * pageSize))
    }, [current, pageSize])
    return (
      <div>
        {total}
        {dataSource.length}
        <button onClick={() => setCurrent(current + 1)}>点击页码</button>
        <button onClick={() => setPageSize(pageSize + 1)}>改变页面大小</button>
      </div>
    )
  }
  ```
- 可以使用多个 useEffect
  ```js
  import React, { useState, useEffect } from 'react'
  export default function() {
    useEffect(() => {
      // 处理
    })
    useEffect(() => {
      // 处理
    })
    useEffect(() => {
      // 处理
    })
  }
  ```
- 清除副作用，useEffect 可以返回一个函数。当我们组件注销的时候会自动执行这个函数
  ```js
  import React, { useState, useEffect } from 'react'
  export default function() {
    useEffect(() => {
      document.addEventListener
      return () => {
        document.removeEventListener
      }
      // 注意我们出入了一个空数组，以为这他只会执行一次
    }, [])
  }
  ```

#### 总结

```js
// componentDidMount
function demo() {
  useEffect(() => {}, [])
}
// componentDidMount 和 componentDidUpdate
function demo() {
  useEffect(() => {})
}
// 依赖某个状态
function demo() {
  useEffect(() => {}, [a, b])
}
// componentWillUnmount
function demo() {
  useEffect(() => {
    return () => {
      // 注销时候执行
    }
  })
}
```

### useRef

- useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数
- ref 对象在组件的整个生命周期内保持不变
- useRef 会在每次渲染时返回**同一个** ref 对象
- ref 对象内容发生变化时，useRef 并不会通知你。变更 .current 属性不会引发组件重新渲染

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null)
  const onButtonClick = () => {
    inputEl.current.focus()
  }
  return (
    <div>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </div>
  )
}
```

### 其他

[官网地址](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecallback)

- 基础 Hook
  - useState
  - useEffect
  - useContext
- 额外的 Hook
  - useReducer
  - useCallback
  - useMemo
  - useRef
  - useImperativeHandle
  - useLayoutEffect
  - useDebugValue

## 自定义 Hook

- 自定义 Hook 是一个函数，其名称以 “use” 开头，函数内部可以调用其他的 Hook
- 自定义 Hook 是一种自然遵循 Hook 设计的约定，而并不是 React 的特性
- 自定义 Hook 必须以 “use” 开头吗？必须如此。这个约定非常重要。不遵循的话，由于无法判断某个函数是否包含对其内部 Hook 的调用，**React 将无法自动检查你的 Hook 是否违反了 Hook 的规则**
- 在两个组件中使用相同的 Hook 不会共享 state

```js
function useXXXX(arg) {
  const [xxx, setXxx] = useState(null)
  useEffect(() => {})
  return xxx
}

function demo() {
  const xxx = useXXXX('')
  // 在这里使用
}
```

## 使用 ESLint 对 Hook 进行校验

```json
// npm install eslint-plugin-react-hooks --save-dev
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error", // 检查 Hook 的规则
    "react-hooks/exhaustive-deps": "warn" // 检查 effect 的依赖
  }
}
```

[Hook 常见问题](https://zh-hans.reactjs.org/docs/hooks-faq.html)
