# Axios 学习

## 简介

**Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中**

- 从浏览器中创建 `XMLHttpRequests`
- 从 `node.js` 创建 `http` 请求
- 支持 `Promise API`
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换 `JSON` 数据
- 客户端支持防御 `XSRF`

## 配置说明

```js
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```

- **常用**
- `url` : 用于请求的服务器 URL
- `method` : 创建请求时使用的方法，默认是 `get`
- `baseURL` : 动加在 `url` 前面，除非 `url` 是一个绝对 URL
- `headers` : 自定义请求头
- `params` : 与请求一起发送的 URL 参数，必须是一个无格式对象(`plain object`)或 `URLSearchParams` 对象
- `data` : 作为请求主体被发送的数据，只适用于这些请求方法 `PUT`, `POST`, `PATCH`。在没有设置 `transformRequest` 时，必须是以下类型之一:
  - `string`, `lain object`, `ArrayBuffer`, `ArrayBufferView`, `URLSearchParams`
  - `browser` : `FormData`, `File`, `Blob`
  - `Node` : `Stream`
- `responseType` : 服务器响应的数据类型，默认 `json`
- `timeout` : 指定请求超时的毫秒数。默认 `1000`
- `cancelToken: new CancelToken(function (cancel) {})` : 指定用于取消请求的 `cancel token`
- **返回的响应信息**

```js
{
  // 服务器提供的响应
  data: {},
  // 来自服务器响应的 HTTP 状态码
  status: 200,
  // 来自服务器响应的 HTTP 状态信息
  statusText: 'OK',
  // 服务器响应的头
  headers: {},
  // 为请求提供的配置信息
  config: {}
}
```

- **进阶**
- `transformRequest: [function()[] ...]` : 允许在向服务器发送前，修改请求数据，只能用在 `PUT`, `POST`, `PATCH` 这几个请求方法。后面数组中的函数必须返回一个字符串，或 `ArrayBuffer`，或 `Stream`
- `transformResponse: [function()[] ...]` : 在传递给 then/catch 前，允许修改响应数据
- `paramsSerializer` : 负责 `params` 序列化的函数
- `withCredentials` : 表示跨域请求时是否需要使用凭证，默认 `false`
- `adapter` : 自定义处理请求，以使测试更轻松，返回一个 `promise` 并应用一个有效的响应
- `auth: { username: 'janedoe', password: 's00pers3cret' }` : 表示应该使用 HTTP 基础验证，并提供凭据。这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization` 头
- `xsrfCookieName` : 是用作 `xsrf token` 的值的 `cookie` 的名称。默认 `XSRF-TOKEN`
- `xsrfHeaderName` : 是承载 `xsrf token` 的值的 `HTTP` 头的名称。默认 `X-XSRF-TOKEN`
- `onUploadProgress` : 允许为上传处理进度事件
- `onDownloadProgress` : 允许为下载处理进度事件
- `maxContentLength` : 定义允许的响应内容的最大尺寸。默认 `2000`
- `validateStatus` : 定义对于给定的 `HTTP` 响应状态码是 `resolve` 或 `reject promise` 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，`promise` 将被 `resolve`; 否则，`promise` 将被 `rejecte`。默认 `status >= 200 && status < 300` 将被 `resolve`
- `maxRedirects` : 定义在 `node.js` 中 `follow` 的最大重定向数目。默认 `5`
- `httpAgent: new http.Agent({ keepAlive: true }) / httpsAgent: new https.Agent({ keepAlive: true })` : 分别在 `node.js` 中用于定义在执行 `http` 和 `https` 时使用的自定义代理
- `proxy` : 定义代理服务器的主机名称和端口
  - `post` : 主机
  - `port` : 端口
  - `auto` : 表示 HTTP 基础验证应当用于连接代理，并提供凭据

## 配置默认值

```js
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 或者
var instance = axios.create();
instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
```

- 配置优先级 : 由低到高
  - 库的默认值
  - 实例的 `defaults` 属性
  - 请求的 `config` 参数

## 取消请求

**使用上述中的配置的 `cancelToken` 属性**

```js
var source = axios.CancelToken.source();
axios.get('/user/12345', {
  cancelToken: source.token
});
// 取消请求（message 参数是可选的）
source.cancel('Operation canceled by the user.');

// 或者

var cancel;
axios.get('/user/12345', {
  cancelToken: new axios.CancelToken(function(c) {
    cancel = c;
  })
});
cancel('Operation canceled by the user.');
```

## 拦截器

```js
// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
```

## 多并发

```js
function getUserAccount() {
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

axios.all([getUserAccount(), getUserPermissions()]).then(
  axios.spread(function(acct, perms) {
    // 两个请求现在都执行完成
  })
);
```

## 常用语法糖

- **在使用别名方法时， url、method、data 这些属性都不必在配置中指定**
- `axios.request(config)`
- `axios.get(url[, config])`
- `axios.delete(url[, config])`
- `axios.head(url[, config])`
- `axios.post(url[, data[, config]])`
- `axios.put(url[, data[, config]])`
- `axios.patch(url[, data[, config]])`
