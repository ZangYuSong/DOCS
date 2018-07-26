# HTTP 之 CORS

## 简介

`CORS` 是一个 `W3C` 标准，全称是"跨域资源共享"（`Cross-origin resource sharing`）。它允许浏览器向跨源服务器，发出 `XMLHttpRequest` 请求，从而克服了 `AJAX` 只能同源使用的限制。

## 请求

浏览器将 `CROS` 请求分成了下叙两类：

### **简单请求**

浏览器发现 **请求非同源** 时候直接发出 `CORS` 请求。

具体就是添加 `Origin` 字段，用来说明本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。

**同时满足**下述两种情况就是简单请求否则就是非简单请求：

- 1、请求方法是这三种：`HEAD`、`GET`、`POST`
- 2、HTTP 的头信息不超出这几种字段：`Accept`、`Accept-Language`、`Content-Language`、`Last-Event-ID`、`Content-Type (只限于三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain)`

### **非简单请求**

非简单请求的 `CORS` 请求，会在正式通信之前，增加一次 `HTTP` 查询请求，称为"预检"请求(`preflight`)。

浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的 XMLHttpRequest 请求，否则就报错。

"预检"请求用的请求方法是 `OPTIONS`，表示这个请求是用来询问的。头信息里面包含下述几个特殊字段：

- `Origin (必选)` : 作用同简单请求
- `Access-Control-Request-Method (必选)` : 用来列出浏览器的 `CORS` 请求会用到哪些 `HTTP` 方法
- `Access-Control-Request-Headers` : 该字段是一个逗号分隔的字符串，指定浏览器 `CORS` 请求会额外发送的头信息字段

## 响应

- `Access-Control-Allow-Origin (必选)` : `* (接受任意域名的请求)` 或者 `Origin (接受指定域名的请求)` 字段的值。**设置多个指定域名的方法**：在后台判断当前域名是否允许访问然后再设置对应的值。
  ```js
  app.all('*', function(req, res, next) {
    if (req.headers.origin == 'https://www.google.com' || req.headers.origin == 'https://www.baidu.com') {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
    }
    next();
  });
  ```
- `Access-Control-Allow-Credentials` : 布尔值，是否允许发送 `Cookie`。默认 `Cookie` 不包括在 `CORS` 请求之中。值只能为 `true`，不需要的时候不设置该字段即可。

  - 上述说的是服务端的配置，如果要把 `Cookie` 发到服务器同时客户端也需要配置 - 打开 `withCredentials`
    ```js
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    ```

- `Access-Control-Expose-Headers` : 该字段是一个逗号分隔的字符串。`CORS` 请求时，`XMLHttpRequest` 对象的 `getResponseHeader()` 方法只能拿到 6 个基本字段：`Cache-Control`、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma`。如果想拿到其他字段，就必须在 `Access-Control-Expose-Headers` 里面指定。例如：`Access-Control-Expose-Headers: xxxx` 获取 `getResponseHeader('xxxx')`。
- `Access-Control-Max-Age` : 指定本次预检请求的有效期，单位为秒。在有效期间，不用发出另一条预检请求
- `Access-Control-Allow-Methods` : 该字段是一个逗号分隔的字符串，用于预检请求的响应。其指明了实际请求所允许使用的 HTTP 方法

[参考文件](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
