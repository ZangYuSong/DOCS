# React 16.x+版本的生命周期变化

[官方文档](https://github.com/reactjs/reactjs.org/blob/master/content/blog/2018-03-27-update-on-async-rendering.md)
[参考](https://www.imooc.com/article/27954?block_id=tuijian_wz)

## 简介

- `componentWillMount` : 实例挂载之前
- `componentWillReceiveProps` : props 发生变化时执行，初始化 render 时不执行
- `componentWillUpdate` : 每次页面更新之前调用

这些生命周期经常被误解和滥用。此外，我们预计他们的潜在滥用可能在异步渲染方面有更大的问题。因此，我们将在即将发布的版本中为这些生命周期添加一个“UNSAFE\_”前缀。 （这里，“不安全”不是指安全性，而是表示使用这些生命周期的代码将更有可能在未来的 React 版本中存在缺陷，特别是一旦启用了异步渲染）。

## 逐步迁移路径

- `16.3 之前` : 保持不变
- `16.3` : 在这些生命周期添加“UNSAFE\_”前缀，生成新的别名。（旧的生命周期名称和新的别名都可以在此版本中使用）
- `16.3 ~ 17.0` : 使用旧的别名会产生弃用警告、
- `17.0` : 移除旧的别名

## 新增的生命周期函数

- `static getDerivedStateFromProps` : 在组件实例化以及接收新 props 后调用。它可以返回一个对象来更新 state，或者返回 null 来表示新的 props 不需要任何 state 更新。与 `componentDidUpdate` 一起，这个新的生命周期应该覆盖传统 `componentWillReceiveProps` 的所有用例。
- `static getSnapshotBeforeUpdate` : 在更新之前被调用。此生命周期的返回值将作为第三个参数传递给 `componentDidUpdate`。与 `componentDidUpdate` 一起，这个新的生命周期将覆盖旧版 `componentWillUpdate` 的所有用例。

## 迁徙方案

- 初始化状态

```js
class component {
  componentWillMount() {
    this.setState({
      currentColor: this.props.defaultColor,
      palette: "rgb"
    });
  }
}
// 更改为
class component {
  state = {
    currentColor: this.props.defaultColor,
    palette: "rgb"
  };
}
```

- 获取外部数据

通常我们会在 componentWillMount 发送 ajxa 获取数据。有一个常见的错误观念认为，在 componentWillMount 中提取可以避免第一个空的渲染。在实践中，这从来都不是真的，因为 React 总是在 componentWillMount 之后立即执行渲染。如果数据在 componentWillMount 触发的时间内不可用，则无论你在哪里提取数据，第一个渲染仍将显示加载状态。这就是为什么在绝大多数情况下将提取移到 componentDidMount 没有明显效果。

- 添加监听

```js
class component {
  componentWillMount() {
    this.props.dataSource.subscribe(this.handleSubscriptionChange);
  }

  componentWillUnmount() {
    this.props.dataSource.unsubscribe(this.handleSubscriptionChange);
  }
}
```

上述实例中，在服务端渲染和异步渲染的情况下会导致内存溢出。人们经常认为 componentWillMount 和 componentWillUnmount 总是配对，但这并不能保证。只有调用 componentDidMount 后，React 才能保证稍后调用 componentWillUnmount 进行清理。出于这个原因，添加事件监听的推荐方式是使用 componentDidMount 生命周期。

- 基于 props 更新 state

```js
class component {
  componentWillReceiveProps(nextProps) {
    if (this.props.currentRow !== nextProps.currentRow) {
      this.setState({
        isScrollingDown: nextProps.currentRow > this.props.currentRow
      });
    }
  }
}
// 更改为
class component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentRow !== prevState.lastRow) {
      return {
        isScrollingDown: nextProps.currentRow > prevState.lastRow
      };
    }
    return null;
  }
}
```

- 通过 props 数据更新数据

```js
class component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.id !== prevState.prevId) {
      return {
        externalData: null,
        prevId: nextProps.id
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.externalData === null) {
      this._loadAsyncData(this.props.id);
    }
  }

  _loadAsyncData(id) {
    asyncLoadData(id).then(externalData => {
      this.setState({ externalData });
    });
  }
}
```

- 调用外部回调函数

```js
class component {
  componentWillUpdate(nextProps, nextState) {
    if (this.state.someStatefulValue !== nextState.someStatefulValue) {
      nextProps.onChange(nextState.someStatefulValue);
    }
  }
  // 改为
  componentDidUpdate(prevProps, prevState) {
    if (this.state.someStatefulValue !== prevState.someStatefulValue) {
      this.props.onChange(this.state.someStatefulValue);
    }
  }
}
```

在异步模式下使用 componentWillUpdate 都是不安全的，因为外部回调可能会多次调用只更新一次。相反，应该使用 componentDidUpdate 生命周期，因为它保证每次更新只调用一次。

- props 改变的副作用

```js
class component {
  componentWillReceiveProps(nextProps) {
    if (this.props.isVisible !== nextProps.isVisible) {
      logVisibleChange(nextProps.isVisible);
    }
  }
  // 改为
  componentDidUpdate(prevProps, prevState) {
    if (this.props.isVisible !== prevProps.isVisible) {
      logVisibleChange(this.props.isVisible);
    }
  }
}
```

与 componentWillUpdate 一样，componentWillReceiveProps 可能会多次调用但是只更新一次。出于这个原因，避免在此方法中导致的副作用非常重要。相反，应该使用 componentDidUpdate，因为它保证每次更新只调用一次。

- 在更新之前读取 DOM 属性

```js
class component {
  listRef = null;
  previousScrollOffset = null;

  componentWillUpdate(nextProps, nextState) {
    if (this.props.list.length < nextProps.list.length) {
      this.previousScrollOffset =
        this.listRef.scrollHeight - this.listRef.scrollTop;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.previousScrollOffset !== null) {
      this.listRef.scrollTop =
        this.listRef.scrollHeight - this.previousScrollOffset;
      this.previousScrollOffset = null;
    }
  }

  setListRef = ref => {
    this.listRef = ref;
  };
}
// 使用 getSnapshotBeforeUpdate
class component {
  listRef = null;

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (prevProps.list.length < this.props.list.length) {
      return this.listRef.scrollHeight - this.listRef.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot !== null) {
      this.listRef.scrollTop = this.listRef.scrollHeight - snapshot;
    }
  }

  setListRef = ref => {
    this.listRef = ref;
  };
}
```

在上面的例子中，componentWillUpdate 被用来读取 DOM 属性。但是，对于异步渲染，“render”阶段生命周期（如 componentWillUpdate 和 render）与“commit”阶段生命周期（如 componentDidUpdate）之间可能存在延迟。如果用户在这段时间内做了类似调整窗口大小的操作，则从 componentWillUpdate 中读取的 scrollHeight 值将失效。
