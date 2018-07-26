# HTTP 之 Fetch

## 简介

- `Fetch` 是一个现代的概念, 等同于 `XMLHttpRequest`。它提供了许多与 `XMLHttpRequest` 相同的功能，但被设计成更具可扩展性和高效性。
- `Fetch` 的核心在于对 `HTTP` 接口的抽象，包括 `Request`，`Response`，`Headers`，`Body`，以及用于初始化异步请求的 `global fetch`。得益于 `JavaScript` 实现的这些抽象好的 `HTTP` 模块，其他接口能够很方便的使用这些功能。
- `Fetch API` 是基于 `Promise` 设计
- **兼容性：**目前最新版的 `Chrome` 和 `Firefox` 已经支持了 `Fetch`，低版本的浏览器请使用第三方 `ployfill(isomorphic-fetch)` 来支持

## 示例

```js
let request = new Request(url, option);
fetch(request).then(
  function(response) {
    // handle HTTP response
  },
  function(error) {
    // handle network error
  }
);

// 或者

fetch(url, option).then(
  function(response) {
    // handle HTTP response
  },
  function(error) {
    // handle network error
  }
);
```

## 核心

### Body

提供了关联 `response/request` 中 `body` 的方法，可以定义它的文档类型以及请求如何被处理

- **属性 :**
- `bodyUsed` : 包含一个指示 `body` 是否被读取过的 `Boolean` 值

* **方法 :**
* `arrayBuffer()` : 返回解决一个 `ArrayBuffer` 表示的请求主体的 `promise`
* `blob()` : 返回解决一个 `Blob` 表示的请求主体的 `promise`
* `formData()` : 返回解决一个 `FormData` 表示的请求主体的 `promise`
* `json()` : 返回解决一个 `JSON` 表示的请求主体的 `promise`
* `text()` : 返回解决一个 `USVString`(文本)表示的请求主体的 `promise`

- [更多](https://developer.mozilla.org/zh-CN/docs/Web/API/Body)

### Request

注意：Request 的配置必须初始化的时候设置。不能通过 `request.method = 'POST'` 来进行赋值。所有的 `.xxx` 都是 **只读**。下述常用参数：

- **属性**
- `url` : 请求的 URL
- `option`
  - `method` : 请求的方法
  - `headers` : 包含请求相关的 Headers 对象
  - `credentials` : 请求的证书
    - `omit(默认)` : 忽略的意思，也就是不带`cookie`
    - `same-origin` : 同源请求带 `cookie`
    - `include` : 表示无论跨域还是同源请求都会带 `cookie`
  - `mode` : 请求的模式
    - `cors(默认)` : 允许跨域请求，将遵守 `CORS` 协议
    - `no-cors` : 允许跨域请求，请求的 `method` 只能是 `HEAD`、`GET` 或 `POST`
    - `same-origin` : 跨域请求，将返回一个 `error`
    - `navigate` : 支持导航的模式，仅用于 `HTML` 导航
  - `cache` : 请求的缓存模式
    - `default` : 浏览器从 `HTTP` 缓存中寻找匹配的请求
      - 如果缓存匹配上并且有效（ `fresh` ）, 它将直接从缓存中返回资源
      - 如果缓存匹配上但已经过期 ，浏览器将会使用传统（ `conditional request` ）的请求方式去访问远程服务器 。如果服务器端显示资源没有改动，它将从缓存中返回资源。否则，如果服务器显示资源变动，那么重新从服务器下载资源更新缓存
      - 如果缓存没有匹配，浏览器将会以普通方式请求，并且更新已经下载的资源缓存
    - `no-store` : 浏览器从远程服务器获取资源，而不先查看缓存，并且不会使用下载的资源更新缓存
    - `reload` : 浏览器从远程服务器获取资源，而不先查看缓存，但随后将使用下载的资源更新缓存
    - `no-cache` : 浏览器从 `HTTP` 缓存中寻找匹配的请求
      - 如果匹配，新鲜或陈旧，浏览器将向远程服务器发出有条件的请求。如果服务器指出资源没有改变，它将从缓存中返回。否则资源将从服务器下载并且缓存将被更新
      - 如果没有匹配，浏览器将发出正常的请求，并用下载的资源更新缓存
    - `force-cache` : 浏览器从 `HTTP` 缓存中寻找匹配的请求
      - 如果有匹配，新鲜或陈旧，它将从缓存中返回
      - 如果没有匹配，浏览器将发出正常的请求，并用下载的资源更新缓存
    - `only-if-cached` : 浏览器从 `HTTP` 缓存中寻找匹配的请求，只能用在 `mode` 为 `same-origin` 的情况下
      - 如果匹配，新鲜或陈旧，将从缓存中返回
      - 如果没有匹配，浏览器将返回一个错误
  - `body` : 请求的数据。可能是一个 `Blob`、`BufferSource`、`FormData`、`URLSearchParams` 或者 `USVString` 对象。注意 `GET` 或 `HEAD` 方法的请求不能包含 `body` 信息

* **方法 :**
* `clone()` : 一个 `Request` 就代表一串流(`stream`), 如果想要传递给另一个 `fetch` 方法,则需要进行克隆
* **可以使用 `Body` 的方法和属性**

- [更多](https://developer.mozilla.org/zh-CN/docs/Web/API/Request)

```js
fetch('/api/add', {
  method: 'POST',
  credentials: 'include',
  headers: new Headers({
    'Content-Type': 'application/json;charset=UTF-8'
  }),
  body: JSON.stringify({ name: 'test' })
});
```

### Response

- **属性**
- `status` : 状态码
- `ok` : 尔值来标示该 `Response` 成功(状态码 200-299) 还是失败
- `statusText` : `Response` 状态码一致的状态信息
- `headers` : `Response` 所关联的 Headers 对象

* **方法 :**
* `clone()` : 创建一个 Response 对象的克隆
* `error()` : 返回一个绑定了网络错误的新的 Response 对象
* `redirect()` : 用另一个 URL 创建一个新的
* **可以使用 `Body` 的方法和属性**

- [更多](https://developer.mozilla.org/zh-CN/docs/Web/API/Response)

```js
fetch('/api/add', {
  method: 'POST',
  credentials: 'include',
  headers: new Headers({
    'Content-Type': 'application/json;charset=UTF-8'
  }),
  body: JSON.stringify({ name: 'test' })
})
  .then(response => {
    // 将数据处理为 JSON 格式，返回一个 Promise
    return response.json();
  })
  .then(data => {
    console.log(data);
  });
```

### Headers

- `append()` : 给现有的 `header` 添加一个值, 或者添加一个未存在的 `header` 并赋值
- `delete()` : 从 `Headers` 对象中删除指定 `header`
- `entries()` : 以 迭代器 的形式返回 `Headers` 对象中所有的键值对
- `get()` : 从 `Headers` 对象中返回指定 `header` 的第一个值
- `getAll() (新规范中已经移除)` : 以数组的形式从 `Headers` 对象中返回指定 `header` 的全部值
- `has()` : 以布尔值的形式从 `Headers` 对象中返回是否存在指定的 `header`
- `keys()` : 以迭代器的形式返回 `Headers` 对象中所有存在的 `header` 名
- `set()` : 替换现有的 `header` 的值, 或者添加一个未存在的 `header` 并赋值
- `values()` : 以迭代器的形式返回 `Headers` 对象中所有存在的 `header` 的值
- **注意** : 在 header 已存在或者有多个值的状态下 `Headers.set()` 和 `Headers.append()` 的使用有如下区别, `Headers.set()` 将会用新的值覆盖已存在的值, 但是 `Headers.append()` 会将新的值添加到已存在的值的队列末尾

* [更多](https://developer.mozilla.org/zh-CN/docs/Web/API/Headers)

```js
let headers = new Headers();
headers.append('Content-Type', 'text/xml');
headers.append('Content-Type', 'text/html');
console.log(headers.get('Content-Type')); // text/xml, text/html

let headers = new Headers();
headers.append('Content-Type', 'text/xml');
headers.set('Content-Type', 'text/html');
console.log(headers.get('Content-Type')); // text/html

let headers = new Headers({
  'Content-Type': 'application/json;charset=UTF-8'
});
fetch('/api/add', {
  method: 'POST',
  credentials: 'include',
  headers: headers,
  body: JSON.stringify({ name: 'test' })
});
```

### GlobalFetch 获取资源

`WindowOrWorkerGlobalScope` mixin 了对 `Window` 和 `WorkerGlobalScope` 接口的公共特性的描述。显然除了下文即将列出的之外，这些接口中的每一个，都可以增加更多的特性。

也就是我们在对应环境下使用的时候可以这样：`window.fetch()`、`global.fetch()`、`fetch()` 等。表示的是这些方法是在顶级变量上。

- `fetch()` : 开始从网络中 fetch 一个资源的进程
- [更多](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope)
