# vuex 学习

## 简介

- Vuex 的状态存储是**响应式**的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新
- 你不能**直接改变 store 中的状态**。改变 store 中的状态的唯一途径就是**显式地提交 (commit) mutation**。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用
- 由于 store 中的状态是响应式的，在组件中调用 store 中的状态简单到仅需要在**计算属性中返回**即可。触发变化也仅仅是在组件的 methods 中**提交 mutation**
- **注意：**使用 Vuex 并不意味着你需要将所有的状态放入 Vuex。虽然将所有的状态放到 Vuex 会使状态变化更显式和易调试，但也会使代码变得冗长和不直观。如果有些状态严格属于单个组件，最好还是作为组件的局部状态。你应该根据你的应用开发需要进行权衡和确定

## 核心

### `State` : 单一状态树

#### 组件获取状态

```js
const app = new Vue({
  el: '#app',
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
});

const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count() {
      // 通过在根实例中注册 store 选项，该 store 实例会注入到根组件下的所有子组件中，且子组件能通过 this.$store 访问到
      return this.$store.state.count;
    }
  }
};
```

#### mapState : 将 state 映射到组件的计算属性中

- 当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些**重复和冗余**。为了解决这个问题，我们可以使用 mapState **辅助函数**帮助我们生成计算属性
- mapState 函数返回的是一个 **对象**，因此我们需要在 computed 属性中对 mapState 使用 **对象展开运算符**
- 当映射的计算属性的名称与 state 的子节点 **名称相同** 时，我们也可以给 mapState 传一个 **字符串数组**

```js
import { mapState } from 'vuex';
// 直接使用 mapState 返回的对象直接传递给 computed
export default {
  computed: mapState({
    // 常规写法，使用箭头函数使代码更加简洁
    count: state => state.count,
    // 传递一个字符串，等同于 state => state.count
    countAlias: 'count'
  })
};
// 计算属性中还有其他内容
export default {
  computed: {
    localCount: () => {},
    // 使用对象展开运算符
    ...mapState({
      count: state => state.count,
      countAlias: 'count'
    })
  }
};
```

### `Getter` : 可以认为是 store 的计算属性

- 当我们需要通过 state 派生出一些状态，且这些状态许多组件都会用到，这时候我们每个组件写对应的方法或者抽取成公共方法都不是很理想。这时候就需要使用到 `Getter`
- Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性）。就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算

```js
const store = new Vuex.Store({
  state: {
    todos: [{ id: 1, text: '...', done: true }, { id: 2, text: '...', done: false }]
  },
  getters: {
    // 接收的第一个参数是 state
    doneTodos: state => {
      return state.todos.filter(todo => todo.done);
    },
    // 接收的第二个参数是 getters
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length;
    },
    // 通过方法访问
    getTodoById: state => id => {
      return state.todos.find(todo => todo.id === id);
    }
  }
});
const Counter = {
  computed: {
    doneTodos() {
      return this.$store.getters.doneTodos;
    },
    doneTodosCount() {
      return this.$store.getters.doneTodosCount;
    },
    getTodoById(id) {
      return this.$store.getters.getTodoById(id);
    }
  }
};
```

#### mapGetters : 将 store 中的 getter 映射到局部计算属性

```js
const Counter = {
  computed: {
    // 常用方式
    ...mapGetters(['doneTodos', 'doneTodosCount', 'getTodoById']),
    // 需要重命名时候这样使用
    ...mapGetters({
      _doneTodos: 'doneTodos'
    })
  }
};
```

### `Mutation` : 改变 state 的状态

- 更改 Vuex 的 store 中的状态的 **唯一方法** 是提交 Mutation
- Mutation 回调函数中第一个参数是 state，第二个参数是额外传递的参数 - **提交载荷（Payload）**
- 可以使用 **常量** 替代 Mutation 事件类型，这里用到了 ES6+ 的 **计算属性命名** 功能。**用不用常量取决于你——在需要多人协作的大型项目中，这会很有帮助。但如果你不喜欢，你完全可以不这样做**
- Mutation 必须是 **同步函数**
- `mapMutations` 辅助函数和上面两个类似，不同的是他是需要映射到局部方法而非计算属性

```js
import Vuex from 'vuex';
import { SOME_MUTATION } from './mutation-types';

const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment(state, n) {
      state.count += n;
    },
    // 在 mutation-types 文件中 SOME_MUTATION === 'increment'
    [SOME_MUTATION](state, n) {
      state.count += n;
    }
  }
});

// 调用
store.commit('increment', 10);
// 或者
store.commit({
  type: 'increment',
  amount: 10
});
// 使用 mapMutations
const store = {
  methods: {
    ...mapMutations([
      // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
      'increment'
    ]),
    ...mapMutations({
      add: 'increment'
    })
  }
};
this.increment(10); // 调用
```

### `Action`

- Action 类似于 mutation
- Action 提交的是 mutation，而不是直接变更状态
- Action 可以包含任意异步操作
- Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters
- 使用 ES6+ 的参数解构来简化代码

```js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment(state, n) {
      state.count += n;
    }
  },
  actions: {
    // 使用 ES6+ 的参数解构来简化代码
    increment({ commit }, data) {
      // 异步操作
      setTimeout(() => {
        commit('increment', data);
      }, 2000);
    }
  }
});

// 调用
store.dispatch('increment', 10);
// 或者
store.dispatch({
  type: 'increment',
  amount: 10
});
// 使用 mapMutations
const store = {
  methods: {
    ...mapActions([
      // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
      'increment'
    ]),
    ...mapActions({
      add: 'increment'
    })
  }
};
this.increment(10); // 调用

// Action 通常是异步的，因此我们可以使用 Promise 来处理组合 Action
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment(state, n) {
      state.count += n;
    }
  },
  actions: {
    increment({ commit }, data) {
      new Promise((resove, reject) => {
        setTimeout(() => {
          commit('increment', data);
          resove();
        }, 2000);
      });
    }
  }
});
store.dispatch('increment', 10).then(() => {
  console.log('分发完成');
});

// 或者可以使用  async / await
const store = new Vuex.Store({
  actions: {
    actions: {
      async actionA({ commit }) {
        commit('gotData', await getData());
      },
      async actionB({ dispatch, commit }) {
        await dispatch('actionA'); // 等待 actionA 完成
        commit('gotOtherData', await getOtherData());
      }
    }
  }
});
```

### `Module` : store 模块化

- Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块
- 对于模块内部的 mutation 和 getter，接收的第一个参数是模块的 **局部状态对象**
- 模块内部的 action，局部状态通过 **context.state** 暴露出来，根节点状态则为 **context.rootState**。同样也有 **context.rootGetter**
- 对于模块内部的 getter，根节点状态会作为第三个参数暴露出来

```js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment(state) {
      // 这里的 `state` 对象是模块的局部状态
      state.count++;
    }
  },
  getters: {
    doubleCount(state) {
      return state.count * 2;
    }
  },
  actions: {
    // rootState 根节点状态
    incrementIfOddOnRootSum({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment');
      }
    }
  }
};
const moduleB = {
  state: { count: 0 }
};

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
});

store.state.a; // moduleA 的状态
store.state.b; // moduleB 的状态
```

#### 命名空间 : 对模块进行更好的封装

- 默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应
- 通过添加 namespaced: true 的方式使其成为带命名空间的模块
- 更改 namespaced 属性后不需要修改模块内的代码
- 启用了命名空间的 getter 和 action 会收到局部化的 getter，dispatch 和 commit
- 当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名
- 如果你希望使用全局 state 和 getter，`rootState` 和 `rootGetter` 会作为第三和第四参数传入 getter，也会通过 `context` 对象的属性传入 action
- 若需要在全局命名空间内分发 action 或提交 mutation，将 `{ root: true }` 作为第三参数传给 `dispatch` 或 `commit`
- `store.registerModule` 动态注册模块
- `store.unregisterModule` 卸载模块，**你不能使用此方法卸载静态模块（即创建 store 时声明的模块）**

```js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,
      state: {},
      getters: {
        isAdmin() {} // getters['account/isAdmin']
      },
      actions: {
        login() {} // dispatch('account/login')
      },
      mutations: {
        login() {} // commit('account/login')
      },
      modules: {
        myPage: {
          state: {},
          getters: {
            profile() {} // getters['account/profile']
          }
        },
        posts: {
          namespaced: true,
          state: {},
          getters: {
            popular() {} // getters['account/posts/popular']
          }
        }
      }
    }
  }
});

// 调用
const store = new Vuex.Store({
  modules: {
    foo: {
      namespaced: true,
      getters: {
        someGetter(state, getters, rootState, rootGetters) {
          getters.someOtherGetter; // 'foo/someOtherGetter'
          rootGetters.someOtherGetter; // 'someOtherGetter'
        }
      },
      actions: {
        someAction({ dispatch, commit, getters, rootGetters }) {
          getters.someGetter; // 'foo/someGetter'
          rootGetters.someGetter; // 'someGetter'
          dispatch('someOtherAction'); // 'foo/someOtherAction'
          dispatch('someOtherAction', null, { root: true }); // 'someOtherAction'
          commit('someMutation'); // 'foo/someMutation'
          commit('someMutation', null, { root: true }); // 'someMutation'
        }
      }
    }
  }
});

// 函数绑定
// 方法一：
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      a: state => state.some.nested.module.a,
      b: state => state.some.nested.module.b
    })
  },
  methods: {
    ...mapActions(['some/nested/module/foo', 'some/nested/module/bar'])
  }
};
// 方法二：
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState('some/nested/module', {
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    ...mapActions('some/nested/module', ['foo', 'bar'])
  }
};
// 方法三：
import { createNamespacedHelpers } from 'vuex';
const { mapState, mapActions } = createNamespacedHelpers('some/nested/module');
export default {
  computed: {
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    ...mapActions(['foo', 'bar'])
  }
};

// 模块动态注册
// 注册模块 `myModule`
store.registerModule('myModule', {});
// 注册嵌套模块 `nested/myModule`
store.registerModule(['nested', 'myModule'], {});
```
