# vue-router

## 介绍

> Vue Router 是 Vue.js 官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。包含的功能有：

- 嵌套的路由/视图表
- 模块化的、基于组件的路由配置
- 路由参数、查询、通配符
- 基于 Vue.js 过渡系统的视图过渡效果
- 细粒度的导航控制
- 带有自动激活的 CSS class 的链接
- HTML5 历史模式或 hash 模式，在 IE9 中自动降级
- 自定义的滚动条行为

## 基本用法

- 在 HTML 中我们使用 `router-link` 用来进行路由的跳转
- 在 HTML 中我们使用 `router-view` 用来渲染路由的输出

```html
<router-link to="/foo">Go to Foo</router-link>
<router-link to="/bar">Go to Bar</router-link>
<router-view></router-view>
```

```js
const Foo = { template: '<div>foo</div>' };
const Bar = { template: '<div>bar</div>' };
const routes = [{ path: '/foo', component: Foo }, { path: '/bar', component: Bar }];
const router = new VueRouter({
  routes
});
new Vue({
  el: '#app',
  router
});
```

### 路由嵌套

**以 `/` 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径。**

```js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: User,
      children: [
        // 当 /user/:id 匹配成功，
        // UserHome 会被渲染在 User 的 <router-view> 中
        { path: '', component: UserHome },
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'profile',
          component: UserProfile
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
});
```

### 命名路由

**通过一个名称来标识一个路由显得更方便一些，特别是在链接一个路由，或者是执行一些跳转的时候**

```js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
});

router.push({ name: 'user', params: { userId: 123 } });
```

### 命名视图

> 有时候想同时 (同级) 展示多个视图，而不是嵌套展示，例如创建一个布局，有 `sidebar` (侧导航) 和 `main` (主内容) 两个视图，这个时候命名视图就派上用场了。你可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。如果 `router-view` 没有设置名字，那么默认为 `default。`

```html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

```js
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
});
```

### 路由重定向和别名

**重定向指访问 `/a` 时候会跳转到 `/b`**

```js
const router = new VueRouter({
  routes: [{ path: '/a', redirect: '/b' }]
});
// 重定向的目标也可以是一个命名的路由
const router = new VueRouter({
  routes: [{ path: '/a', redirect: { name: 'foo' } }]
});
// 甚至一个方法
const router = new VueRouter({
  routes: [
    {
      path: '/a',
      redirect: to => {}
    }
  ]
});
```

**别名指 `/a` 和 `/b` 同时指向一个组件，访问那一个都是访问同一个组件**

```js
const router = new VueRouter({
  routes: [{ path: '/a', component: A, alias: '/b' }]
});
```

### 路由传参

- 定义 : `:userId` 就是传递的参数

```js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
});
```

- 跳转 : 指定 `path` 则会忽略 `params`

```js
// 注意：在 Vue 实例内部，你可以通过 $router 访问路由实例。因此你可以调用 this.$router.push
this.$router.push({ name: 'user', params: { userId: 123 } });
// 或者
this.$router.push({ path: '/user/123' });
```

```html
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
<router-link :to="{ paht: '/user/123' }}">User</router-link>
```

- 获取参数 : `this.$router.params`
- `props` : 使用 props 取代 $router 进行解耦
  - 布尔值 : 这时候 `this.$router.params` 等同于 `this.props`
  - 对象 : 被按原样设置为组件属性。当 props 是静态的时候有用
  - 函数 : 以将参数转换成另一种类型，将静态值与基于路由的值结合等等

```js
const router = new VueRouter({
  routes: [
    // 布尔值
    { path: '/user/:id', component: User, props: true },
    // 对于包含命名视图的路由，你必须分别为每个命名视图添加 `props` 选项：
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }
    },
    // 对象
    { path: '/static', component: Hello, props: { name: 'world' } },
    // 函数
    {
      path: '/dynamic/:years',
      component: Hello,
      props: route => {
        const now = new Date();
        return {
          name: now.getFullYear() + parseInt(route.params.years) + '!'
        };
      }
    }
  ]
});
```

### 操作路由

| 声明试                            | 函数式                | 类似原生                      |
| :-------------------------------: | :-------------------: | :---------------------------: |
| `<router-link :to="...">`         | `router.push(...)`    | `window.history.pushState`    |
| `<router-link :to="..." replace>` | `router.replace(...)` | `window.history.replaceState` |
|                                   | `router.go(n)`        | `window.history.go`           |

- `push` : `router.push(location, onComplete?, onAbort?)`
- `replace` : `router.replace(location, onComplete?, onAbort?)`
- `go` : 方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步
- `location` : 对象，跳转的路由信息

```js
const userId = 123;
router.push({ name: 'user', params: { userId } }); // -> /user/123
router.push({ path: `/user/${userId}` }); // -> /user/123
// 这里的 params 不生效
router.push({ path: '/user', params: { userId } }); // -> /user
```

- `onComplete?` : 可选，导航成功回调函数
- `onAbort?` : 可选，导航终止回调函数

### 路由模式选择

> `vue-router` 包含 `hash` 模式和 `history` 模式两种，默认是 `hash` 模式

```js
// 开启 history 模式
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

**不过这种模式要玩好，还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问 http://oursite.com/user/id 就会返回 404，这就不好看了。所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。**

## 路由解析流程

- 导航被触发。
- 在失活的组件里调用离开守卫。
- 调用全局的 beforeEach 守卫。
- 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
- 在路由配置里调用 beforeEnter。
- 解析异步路由组件。
- 在被激活的组件里调用 beforeRouteEnter。
- 调用全局的 beforeResolve 守卫 (2.5+)。
- 导航被确认。
- 调用全局的 afterEach 钩子。
- 触发 DOM 更新。
- 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。

## 钩子函数

- `router.beforeEach` : 全局解析守卫。当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于 **等待中**
  - `to:Route` : 即将要进入的目标路由对象
  - `from:Route` : 当前导航正要离开的路由
  - `next:Function` : 调用该方法来 `resolve` 这个钩子，`next()` 进行管道中的下一个钩子，`next(false)` 中断当前的导航，`next('/')` 或者 `next({ path: '/' })` 跳转到一个不同的地址，`next(error) (2.4.0+)` 如果传入 `next` 的参数是一个 `Error` 实例，则导航会被终止且该错误会被传递给 `router.onError()` 注册过的回调
- `router.beforeResolve` : 全局解析守卫。和 `router.beforeEach` 类似，区别是在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用
- `router.beforeEnter` : 路由独享的守卫。和 `router.beforeEach` 类似，区别是配置在具体某个路由上
- `router.beforeRouteEnter` : 和 `router.beforeEach` 类似，区别是配置在组件中。进入，不能访问 `this`，因为守卫在导航确认前被调用,因此即将登场的新组件还没被创建
- `router.beforeRouteUpdate` : 和 `router.beforeEach` 类似，区别是配置在组件中。更新
- `router.beforeRouteLeave` : 和 `router.beforeEach` 类似，区别是配置在组件中。离开
- `router.afterEach` : 全局后置钩子，这些钩子不会接受 next 函数也不会改变导航本身。同理有相应的 `afterRouteEnter` 等等钩子

## 路由元信息

> 定义路由的时候可以配置 `meta` 字段。一个路由匹配到的所有路由记录会暴露为 \$route 对象 (还有在导航守卫中的路由对象) 的 \$route.matched 数组。因此，我们需要遍历 $route.matched 来检查路由记录中的 meta 字段。

> 作用：比如我们某些路由页面必须在登录下才能访问，因此我们可以给路由加上对应的元信息。当路由激活之前先判断是否包含对应的元信息，同时校验是否登录达到对应的效果。


```js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next(); // 确保一定要调用 next()
  }
});
```
