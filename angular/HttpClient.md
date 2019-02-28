# HttpClient

## 简介

现代浏览器支持使用两种不同的 API 发起 HTTP 请求：XMLHttpRequest 接口和 fetch() API。

@angular/common/http 中的 HttpClient 类为 Angular 应用程序提供了一个简化的 API 来实现 HTTP 客户端功能。它基于浏览器提供的 XMLHttpRequest 接口。

HttpClient 带来的其它优点包括：

* 可测试性
* 强类型的请求和响应对象
* 发起请求与接收响应时的拦截器支持
* 更好的、基于可观察（Observable）对象的 API
* 流式错误处理机制

## 基础用法

* 导入 `HttpClientModule`
* 注入 `HttpClient`
* 最佳实践：把数据展现逻辑从数据访问逻辑中拆分出去，也就是说把数据访问逻辑包装进一个单独的服务中， 并且在组件中把数据访问逻辑委托给这个服务

``` js
// 注入 HttpClientModule
import { NgModule }         from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  imports: [HttpClientModule],
  declarations: [AppComponent],
  bootstrap: [ AppComponent ]
})
export class AppModule {}

// 注入 HttpClient
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class ConfigService {
  constructor(private http: HttpClient) { }
}


// 注入服务并使用
showConfig() {
  this.configService.getConfig()
    .subscribe((data: Config) => this.config = {
        heroesUrl: data['heroesUrl'],
        textfile:  data['textfile']
    });
}
```

## 语法糖

* `http.requres(method: string, url: string, options: object)`
* `http.delete(url: string, options: object)`
* `http.get(url: string, options: object)`
* `http.head(url: string, options: object)`
* `http.jsonp(url: string, callbackParam: string)` : 必须安装一个合适的拦截器（比如借助 HttpClientJsonpModule）。 如果没有这个拦截器，JSONP 请求就可能被后端拒绝。
* `http.options(url: string, options: object)`
* `http.patch(url: string, body: any options: object)`
* `http.put(url: string, body: any options: object)`
* `http.post(url: string, body: any options: object)`

## 参数详解

* `options.body?: any` : 请求体
* `options.headers?: HttpHeaders | { [header: string]: string | string[]; }` : 请求头
* `options.params?: HttpParams | { [param: string]: string | string[]; }` : 请求 url 的参数
* `options.reportProgress?: boolean` : 该请求是否应该暴露出进度事件
* `options.responseType?: "arraybuffer" | "blob" | "text" | "json"` : 响应数据的类型
* `options.withCredentials?: boolean` : 跨域请求是否带 cookies
* `options.observe?: "body"` : observe 的值决定 request() 的返回值类型，这取决于消费方在订阅时对哪些东西感兴趣。 当它的值是 events 时，它将返回一个 `Observable<HttpEvent>`，以表示原始的 HTTPEvent 流，默认还包括网络通讯进度事件。 当它的值是 response 时，它将返回一个 `Observable<HttpResponse<T>>`，HttpResponse 的 T 参数 取决于 responseType 以及可选提供的类型参数。 当它的值是 body 时，它将返回一个 body 类型为 T 的 `Observable<T>` 对象

## 拦截器

> HTTP 拦截机制是 @angular/common/http 中的主要特性之一。 使用这种拦截机制，你可以声明一些拦截器，用它们监视和转换从应用发送到服务器的 HTTP 请求。拦截器可以用一种常规的、标准的方式对每一次 HTTP 的请求/响应任务执行从认证到记日志等很多种隐式任务。

### 定义拦截器

``` js
import { Injectable } from '@angular/core'
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'token <your GitHub token>')
    })
    return next.handle(authReq)
  }
}
```

* `req` : 要处理的外发请求。虽然拦截器有能力改变请求和响应，但 HttpRequest 和 HttpResponse 实例的属性却是只读（readonly）的， 因此让它们基本上是不可变的。要想修改该请求，就要先克隆它，并修改这个克隆体，然后再把这个克隆体传给 next.handle()。
* `next` : 拦截器链中的下一个拦截器，如果链中没有其它拦截器了，则为后端 HTTP 调用。大多数的拦截器都会调用 `next.handle()`，以便这个请求流能走到下一个拦截器，并最终传给后端处理器。 拦截器也可以不调用 `next.handle()`，使这个链路短路，并返回一个带有人工构造出来的服务器响应的自己的 `Observable`

### 注入拦截器

``` js
import { NgModule } from '@angular/core'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { InterceptorService } from './service/interceptor.service'
import { AppComponent } from './app.component'

@NgModule({
  providers: [
    HttpClientModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

* 由于拦截器是 HttpClient 服务的（可选）依赖，所以你必须在提供 HttpClient 的同一个（或其各级父注入器）注入器中提供这些拦截器。 那些在 DI 创建完 HttpClient 之后再提供的拦截器将会被忽略。
* 由于在 AppModule 中导入了 HttpClientModule，导致本应用在其根注入器中提供了 HttpClient。所以你也同样要在 AppModule 中提供这些拦截器。
* 要想在整个应用中使用 HttpInterceptors 的同一个实例，就只能在 AppModule 模块中导入 HttpClientModule，并且把拦截器都添加到应用的根注入器中。 如果你在不同的模块中多次导入 HttpClientModule，则每次导入都会创建 HttpClientModule 的一个新复本，它将会覆盖根模块上提供的那些拦截器
* Angular 会按照你提供它们的顺序应用这些拦截器。 如果你提供拦截器的顺序是先 A，再 B，再 C，那么请求阶段的执行顺序就是 A->B->C，而响应阶段的执行顺序则是 C->B->A

### XSRF 防护

* HttpClient 支持一种通用的机制来防范 XSRF 攻击。当执行 HTTP 请求时，一个拦截器会从 cookie 中读取 XSRF 令牌（默认名字为 XSRF-TOKEN），并且把它设置为一个 HTTP 头 X-XSRF-TOKEN，由于只有运行在你自己的域名下的代码才能读取这个 cookie，因此后端可以确认这个 HTTP 请求真的来自你的客户端应用，而不是攻击者。
* 如果你的后端服务中对 XSRF 令牌的 cookie 或 头使用了不一样的名字，就要使用 HttpClientXsrfModule.withConfig() 来覆盖掉默认值。

``` js
imports: [
  HttpClientModule,
  HttpClientXsrfModule.withOptions({
    cookieName: 'My-Xsrf-Cookie',
    headerName: 'My-Xsrf-Header'
  })
]
```