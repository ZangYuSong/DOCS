# HTTP 之 Content-Type

## 简介

`MediaType` : 即是 `Internet Media Type`，互联网媒体类型；也叫做 `MIME` 类型，在 `HTTP` 协议消息头中，使用 `Content-Type` 来表示具体请求中的媒体类型信息

- `Text` : 用于标准化地表示的文本信息，文本消息可以是多种字符集和或者多种格式的
- `Multipart` : 用于连接消息体的多个部分构成一个消息，这些部分可以是不同类型的数据
- `Application` : 用于传输应用程序数据或者二进制数据
- `Message` : 用于包装一个 E-mail 消息
- `Image` : 用于传输静态图片数据
- `Audio` : 用于传输音频或者音声数据
- `Video` : 用于传输动态影像数据，可以是与音频编辑在一起的视频数据格式
- 格式 : `Content-Type: [type]/[subtype]; parameter` : `Content-Type: application/json; charset=UTF-8`

## 常见的媒体格式类型

- `text/html` : HTML 格式
- `text/plain` : 纯文本格式
- `text/xml` : XML 格式
- `text/css` : CSS 格式
- `image/[, gif[, jpeg[, png[, x-icon]]]]` : gif | jpg | png | ico 图片格式
- `application/json` : JSON 格式，一般用于发送 API 请求获取数据
- `application/javascript` : javascript 格式
- `application/octet-stream` : 二进制流，不知道下载文件类型
- `application/x-www-form-urlencoded` : Form 表单数据向服务端传输时的编码方式。数据被编码为名称/值对，这是标准且默认的编码格式。当 action 为 get 时候，客户端把 form 数据转换成一个字串 append 到 url 后面，用?分割。当 action 为 post 时候，浏览器把 form 数据封装到 http body 中，然后发送到 server
- `multipart/form-data` : 在表单中进行文件上传时使用的格式

[Content-Type 对照表](http://www.runoob.com/http/http-content-type.html)
