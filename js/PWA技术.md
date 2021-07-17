# PWA 技术

## 简介

PWA (Progressive Web App)渐进式增强 WEB 应用。是 Google 在 2016 年提出的概念，2017 年落地的 web 技术。目的就是在移动端利用提供的标准化框架，在网页应用中实现和原生应用相近的用户体验的渐进式网页应用。

PWA 并不是单指某一项技术，你更可以把它理解成是一种思想和概念，目的就是对标原生 app，将 Web 网站通过一系列的 Web 技术去优化它，提升其安全性，性能，流畅性，用户体验等各方面指标，最后达到用户就像在用 app 一样的感觉。PWA 中包含的核心功能及特性如下：

- Web App Manifest
- Service Worker
- Cache API 缓存
- Push&Notification 推送与通知
- Background Sync 后台同步
- 响应式设计

## Web App Manifest

### 简介

PWA 添加至桌面的功能实现依赖于 manifest.json。当前 manifest.json 的标准仍属于草案阶段，Chrome 和 Firefox 已经实现了这个功能，微软正努力在 Edge 浏览器上实现，Apple 目前仍在考虑中。具体请查阅 [caniuse.com](https://caniuse.com/#search=manifest) 来查看主流浏览器的支持情况。同时需要注意的是，**manifest.json 目前仍属于实验性技术，所以其部分属性和功能在未来有可能会发生改变**。

### 主要功能

- 控制应用程序的显示方式和启动方式
- 指定主屏幕图标
- 启动应用程序时要加载的页面
- 屏幕方向
- 甚至可以指定是否显示浏览器 Chrome

### 使用说明

在项目中创建 manifest.json 文件，并在页面中引入：

```html
<link rel="manifest" href="path-to-manifest/manifest.json" />
```

### 参数说明

```json
{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

- `name` : 应用名称，用于安装横幅、启动画面显示
- `short_name` : 应用短名称，用于主屏幕显示
- `icons | Array<{ src: string, type:string, sizes: string }>` : 当用户将 PWA 添加至主屏幕时，会如同原生应用一样显示应用名和图标。我们可以通过 icons 属性定义一组不同大小的图标供浏览器进行选择。
- `start_url` : 指定应用打开的网址
- `scope` : 作用域。对于一些大型网站而言，有时仅仅对站点的某些模块进行 PWA 改造，其余部分仍为普通的网页。因此需要通过 scope 属性去限定作用域，超出范围的部分会以浏览器的方式显示
  - 如果没有在 manifest 中设置 scope，则默认的作用域为 manifest.json 所在文件夹
  - scope 可以设置为 ../ 或者更高层级的路径来扩大 PWA 的作用域
  - start_url 必须在作用域范围内
  - 如果 start_url 为相对地址，其根路径受 scope 所影响
  - 如果 start_url 为绝对地址（以 / 开头），则该地址将永远以 / 作为根地址
- 启动画面图像 : 浏览器自动从 icons 中选择最接近 128dp 的图片作为启动画面图像，标题则直接取自 name
- `background_color` : 指定启动画面的背景颜色
- `display` : 指定 PWA 从主屏幕点击启动后的显示类型

| 显示类型   | 描述                                                                                     | 降级显示类型 |
| ---------- | ---------------------------------------------------------------------------------------- | ------------ |
| fullscreen | 应用的显示界面将占满整个屏幕                                                             | standalone   |
| standalone | 浏览器相关 UI（如导航栏、工具栏等）将会被隐藏                                            | minimal-ui   |
| minimal-ui | 显示形式与 standalone 类似，浏览器相关 UI 会最小化为一个按钮，不同浏览器在实现上略有不同 | browser      |
| browser    | 浏览器模式，与普通网页在浏览器中打开的显示一致                                           | none         |

- `orientation` : 强制指定应用显示的方向。
  由于不同的设备的宽高比不同，因此对于“横屏”、“竖屏”不能简单地通过屏幕旋转角去定义。如对于手机来说，90° 和 270° 为横屏，而在某些平板电脑中，0° 和 180° 才是横屏。因此需要通过应用视窗去定义
  - 当视窗宽度大于高度时，当前应用处于“横屏”状态。横屏分为两种角度，两者相位差为 180°，分别为 `landscape-primary` 和 `landscape-secondary`
  - 当视窗宽度小于等于高度时，当前应用处于“竖屏”状态。同样，竖屏分为两种，两者相位差为 180°，分别为 `portrait-primary` 和 `portrait-secondary`
  - `landscape` 根据不同平台的规则，该值可等效于 `landscape-primary` 或 `landscape-secondary`，或者根据当前屏幕旋转角不同，去自由切换 `landscape-primary` 或 `landscape-secondary`
  - `portrait` 根据不同平台的规则，该值可等效于 `portrait-primary` 或 `portrait-secondary`，或者根据当前屏幕旋转角不同，去自由切换 `portrait-primary` 或 `portrait-secondary`
  - `natural` 根据不同平台的规则，该值可等效于 `portrait-primary` 或 `landscape-primary`，即当前屏幕旋转角为 0° 时所对应的显示方向
  - `any` 根据屏幕旋转角自由切换 `landscape-primary`、`landscape-secondary`、`portrait-primary`、`portrait-secondary`
- `theme_color` : 指定 PWA 的主题颜色。可以通过该属性来控制浏览器 UI 的颜色。比如 PWA 启动画面上状态栏、内容页中状态栏、地址栏的颜色，会被 theme_color 所影响

## Service Worker

Service Worker 是一个 HTML5 API ，主要用来做持久的离线缓存。Service Worker 有以下功能和特性：

- 一个独立的 worker 线程，独立于当前网页进程，有自己独立的 worker context。
- 一旦被 install，就永远存在，除非被手动 unregister
- 用到的时候可以直接唤醒，不用的时候自动睡眠
- 可编程拦截代理请求和返回，缓存文件，缓存的文件可以被网页进程取到（包括网络离线状态）
- 离线内容开发者可控
- 能向客户端推送消息
- **不能直接操作 DOM**
- **必须在 HTTPS 环境下才能工作**
- 异步实现，内部大都是通过 Promise 实现、
- ...

```js
// index.js
// 将 sw.js 文件注册为一个 Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").then(function () {
    console.log("Service Worker 注册成功");
  });
}
```

```js
// sw.js
// 常用的事件
self.addEventListener("install", function (e) {});
self.addEventListener("activate", function (e) {});
self.addEventListener("fetch", function (e) {});
```

[service-worker-events](https://w3c.github.io/ServiceWorker/#ref-for-dfn-service-worker-events)

## Cache API 缓存

Cache API 是 ServiceWorker 的一种新的应用缓存机制，它提供了可编程的缓存操作方式， 能实现各种缓存策略，可以非常细粒度的操控资源缓存。

[具体可以看这篇文章](https://zhuanlan.zhihu.com/p/52447535)

### 缓存静态资源

```js
// sw.js
var version = "1.0.0";
var cacheFiles = [
  "/",
  "./index.html",
  "./index.js",
  "./style.css",
  "./img/book.png",
  "./img/loading.svg",
];

self.addEventListener("install", function (installEvent) {
  // installEvent.waitUntil() 接收一个 Promise 参数，用它来表示 sw 安装的成功与否。
  installEvent.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(cacheFiles);
    })
  );
});
```
