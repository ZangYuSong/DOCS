# RxJS 6+

## 简介与基本概念

> RxJS是一个使用可观察序列组成异步和基于事件的程序的库。它提供了一种核心类型，Observable，卫星类型（Observer，Schedulers，Subjects）和受Array＃extras（map，filter，reduce，every等）启发的运算符，允许将异步事件作为集合处理。

* `Observable` : 表示一个可调用的未来值或事件的集合
* `Observer` : 一个回调函数的集合，它知道如何去监听由 Observable 提供的值
* `Subscription` : 表示 Observable 的执行，主要用于取消 Observable 的执行
* `Operators` : 采用函数式编程风格的纯函数，例如 `map、filter、concat、flatMap` 等这样的操作符，用来处理集合
* `Subject` : 相当于 EventEmitter，并且是将值或事件多路推送给多个 Observer 的唯一方式
* `Schedulers` : 用来控制并发并且是中央集权的调度员，允许我们在发生计算时进行协调，例如 setTimeout 或 requestAnimationFrame 或其他

## 常用对象说明

``` ts
// 与之前版本相比，所有的操作符在 pipe 管道中执行
import { of } from 'rxjs';
import { map } from 'rxjs/operators'

of([1, 2]).pipe(map(item => item * 2))
```

### 创建

* `Observable` : RxJS 最基本的构建块
* `of` : 将参数转换为可观察序列
* `from` : 从数组，类数组对象，Promise，可迭代对象或类似 Observable 的对象创建 Observable
* `fromEvent` : 创建一个 Observable，它发出来自给定事件目标的特定类型的事件
* `interval` : 创建一个 Observable，指定每隔多长时间发出一个序列号
* `range` : 创建一个 Observable，它发出指定范围内的一系列数字
* `timer` : 创建一个 Observable，在 dueTime 此后的每个 period 时间之后开始并发出不断增加的数字

``` ts
import { Observable, of, from, fromEvent } from 'rxjs';

const observable = new Observable(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
  }, 1000);
});

of([1, 2])
of(1, 2, 3)
of(true)
of(null)

from(fetch('/api/endpoint'))

fromEvent(document.getElementById('my-element'), 'mousemove');

interval(1000)

range(0, 10)
```

### 转换

* `mapTo` : 对数据源每项都转换为指定的值/其他
* `map` : 指定一个函数处理源可观测值所发出的每个值，并将结果值作为新的可观测值发出
* `scan` : 对 Observable 值的进行累积操作
* `mergeMap` : 数据遍历映射，并依次拼接。第二个参数表示同时订阅的最大输入 Observable 数。即并发数
* `switchMap` : 返回一个 Observable，它根据您应用的函数发出项目，该函数提供给源 Observable 发出的每个项目，该函数返回一个（所谓的“内部”）Observable。每次观察其中一个内部 Observable 时，输出 Observable 开始发出该内部Observable 发出的项。当发出新的内部 Observable 时，**switchMap 停止从先前发出的内部Observable中发出项目并开始从新的Observable中发出项目**
* `bufferTime` : 建立一个缓冲区（Observable），将数据源收集到缓冲区中，然后根据时间参数n对数据源进行分组，在同一n毫秒下的数据为一组，然后把分组好的数据集合发射出来
* `concatMap` : 将每个源值投影到 Observable，Observable 在输出 Observable 中合并，在合并下一个完成之前以序列化方式等待每个值。**concatMap 相当于将 mergeMap 并发参数设置为 1**
* `pluck` : 根据 key 值提取 Observable 所产生的值的 value，匹配不上返回 undefined

``` ts
import { of, interval } from 'rxjs';
import { mapTo, map, scan, mergeMap, concatMap, bufferTime, take } from 'rxjs/operators'

of(1, 2, 3).pipe(scan((acc, one) => acc + one, 0)) // 返回 1 3 6

of('a', 'b', 'c').pipe(
  mergeMap(x => interval(1000).pipe(
    map(i => x + i)),
    take(4) // 每秒输出 'ai bi ci' i未从0到3
  )
);

// 每次点击都会返回一个新的 interval
fromEvent(document, 'click').pipe(
  switchMap(data => {
    return interval(1000).pipe(
      mapTo(data),
      take(data)
    )
  })
)

// 每个3秒 发出一个数据的数组
interval(1000).pipe(bufferTime(3000))

of(1, 2, 3).pipe(concatMap(data => of(data)))

// sex1 sex2
result = of(
  {
    id: '1',
    name: 'name1',
    obj: {
      sex: 'sex1'
    }
  },
  {
    id: '2',
    name: 'name2',
    obj: {
      sex: 'sex2'
    }
  }
).pipe(pluck('obj', 'sex'))
```

### 过滤

* `take` : take 返回一个 Observable，它只 count 发出源 Observable 发出的第一个值。如果源发出的 count 值小于值，则会发出其所有值。之后，无论源是否完成，它都会完成
* `takeUntil` : 发出源 Observable 发出的值，直到notifier Observable 发出值后停止
* `filter` : 过滤源Observable发出的项目，只发出满足指定谓词的项目
* `debounceTime` : 延迟源 Observable 发出的值，但如果新值到达源 Observable，则会丢弃先前待处理的延迟发射。这是一个速率限制运算符，因为不可能在任何持续时间窗口中发出多个值 dueTime，但它也是一个类似延迟的运算符，因为输出发射不会像它们那样同时发生来源 Observable
* `distinctUntilChanged` : 把相同的元素过滤掉，如果提供了比较器功能，则将为每个项目调用它以测试是否应该发出该值。如果未提供比较器功能，则默认使用相等性检查

``` ts
import { of, interval } from 'rxjs';
import { filter } from 'rxjs/operators'

of(1, 2, 3, 4).pipe(filter(data => data > 2)) // 3 4

// 每秒发送一个序列号，直到鼠标点击之后停止
interval(1000).pipe(takeUntil(fromEvent(document, 'click')))

// 每次点击 延迟3秒发出
fromEvent(document, 'click').pipe(debounceTime(3000))

// 1 2 1 2 3 4
of(1, 1, 2, 2, 2, 1, 1, 2, 3, 3, 4).pipe(distinctUntilChanged())
```

### 组合

* `merge` : 创建一个输出 Observable，它同时发出每个给定输入 Observable 的所有值
* `zip` : 组合多个 Observable 以创建一个 Observable，其值根据其每个输入 Observable 的值按顺序计算，如果最后一个参数是函数，则此函数用于根据输入值计算创建的值。否则，返回一个输入值数组
* `concat` : 创建一个输出 Observable，它从给定的 Observable 顺序发出所有值，然后继续下一个
* `startWith` : 返回一个 Observable，它在开始发出源 Observable 发出的项之前发出您指定为参数的项。首先按顺序发出其参数，随后发出源 Observable 的值
* `combineLatest` : 组合多个 Observable 以创建一个 Observable，其值是根据每个输入 Observable 的最新值计算的。只要任何输入 Observable 发出一个值，它就会使用所有输入中的最新值计算公式，然后发出该公式的输出
* `withLatestFrom` : 将源Observable与其他Observable组合以创建一个Observable，其值仅根据源发出的值从每个值的最新值计算。每当源Observable发出一个值时，它使用该值加上来自其他输入Observable的最新值计算公式，然后发出该公式的输出。

``` ts
import { merge, interval, zip, concat, range, timer, combineLatest } from 'rxjs'
import { take } from 'rxjs/operators'

// 合并 3个 Observable，但只有 2 个同时运行
merge(
  interval(1000).pipe(take(10)),
  interval(2000).pipe(take(6)),
  interval(500).pipe(take(10)),
  2
)

// [1, "a", true] [2, "b", false]
zip(of(1, 2, 3), of('a', 'b', 'c', 'd'), of(true, false))

// 先每隔一秒输出一个序号 0 ~ 4  随后一次性输出 1~10
concat(interval(1000).pipe(take(4)), range(1, 10))

// first -> second -> from source
of('from source').pipe(startWith('first', 'second'))

// [0,0] [1,0] [1,1] [2,1] [2,2] [3,2] [3,3] [4,3] [4,4]
combineLatest(timer(0, 1000).pipe(take(5)), timer(500, 1000).pipe(take(5)))

// [Event, (当前 interval 的序号，序号一开始每隔一秒加一，点击时候当前是几就显示几)]
fromEvent(document, 'click').pipe(withLatestFrom(interval(1000)))
```

### 效用

* `tap` : 对源 Observable 上的每个发射执行副作用，但返回与源相同的 Observable。截取源上的每个发射并运行一个函数，但只要不发生错误，就返回一个与源相同的输出

``` ts
import { fromEvent } from 'rxjs'
import { tap, map } from 'rxjs/operators'

// 将每次单击映射到该单击的clientX位置，同时还记录click事件
fromEvent(document, 'click').pipe(
  tap(ev => console.log(ev)),
  map((ev: any) => ev.clientX)
)
```

### 多播

多播是一个术语，它用来描述由单个 observable 发出的每个通知会被多个观察者所接收的情况。一个 observable 是否具备多播的能力取决于它是热的还是冷的。

热的和冷的 observable 的特征在于 observable 通知的生产者是在哪创建的。热的 Vs 冷的 Observables 差异可以归纳如下:

* 如果通知的生产者是观察者订阅 observable 时创建的，那么 observable 就是冷的。例如，timer observable 就是冷的，**每次订阅时都会创建一个新的定时器**。
* 如果通知的生产者不是每次观察者订阅 observable 时创建的，那么 observable 就是热的。例如，使用 fromEvent 创建的 observable 就是热的，产生事件的元素存在于 DOM 之中，**它不是观察者订阅时所创建的**。
* 冷的 observables 是单播的，**每个观察者所接收到的通知都是来自不同的生产者，生产者是观察者订阅时所创建的**。
* 热的 observables 是多播的，每个观察者所接收到的通知都是来自同一个生产者。

有些时候，需要冷的 observable 具有多播的行为，RxJS 引入了 Subject 类使之成为可能。

Subject 即是 observable，又是 observer (观察者)。通过使用观察者来订阅 subject，然后 subject 再订阅冷的 observable，可以让冷的 observable 变成热的。这是 RxJS 引入 subjects 的主要用途

* `share` : 返回一个新的 Observable，它可以多播（共享）原始的 Observable。只要至少有一个订阅者，此Observable将被订阅并发送数据。当所有订阅者都取消订阅时，它将取消订阅源 Observable。因为 Observable 是多播，所以它构成了流 hot。这是别名 `multicast(() => new Subject()), refCount()`
* `publish` : 共享源 observable 并通过调用 connect 方法使其变成热的。
  * 未指定选择器的时候，使用 publish 之后不会发送任何值，直到调用了 connect 方法。使用时候等待所有的订阅者都订阅了之后，调用 connect，开始发送数据实现热 Observable
  * 指定选择器，根据相应的内容共享 Observable
* `multicast` : 所有的多播操作符都是以这个为基础封装而来

``` ts
import { interval, Subject, ReplaySubject } from 'rxjs'
import { take, share, publish, multicast } from 'rxjs/operators'

// 冷 0 1 2 3 0 4 1 5 2 7 3 4 5 6 7
result = interval(1000).pipe(take(8))
result.subscribe(data => console.log(data))
setTimeout(() => {
  result.subscribe(data => console.log(data))
}, 3000)

// share 热 0 1 2 3 3 4 4 5 5 6 6 7 7
result = interval(1000).pipe(
  take(8),
  share()
)
result.subscribe(data => console.log(data))
setTimeout(() => {
  result.subscribe(data => console.log(data))
}, 3000)

// publish 未指定 selector
result = interval(1000).pipe(
  take(8),
  publish()
)
result.subscribe(data => console.log(data))
setTimeout(() => {
  result.subscribe(data => console.log(data))
  result.connect()
}, 3000)
// publish 指定 selector，表现等同于 share
result = interval(1000).pipe(
  take(8),
  publish(multicasted$ => {
    // 在这里做一些额外的操作
    return multicasted$
  })
)
result.subscribe(data => console.log(data))
setTimeout(() => {
  result.subscribe(data => console.log(data))
}, 3000)

// multicast 使用 Subject
result = interval(1000).pipe(
  take(8),
  multicast(() => new Subject())
)
result.subscribe(data => console.log(data))
setTimeout(() => {
  result.subscribe(data => console.log(data))
  result.connect()
}, 3000)
// multicast 使用 Subject 指定 selector
result = interval(1000).pipe(
  take(8),
  multicast(
    () => new Subject(),
    multicasted$ => {
      return multicasted$
    }
  )
)
result.subscribe(data => console.log(data))
setTimeout(() => {
  result.subscribe(data => console.log(data))
}, 3000)
// 使用 ReplaySubject
result = interval(1000).pipe(
  take(8),
  multicast(
    () => new ReplaySubject(2),
    multicasted$ => {
      return multicasted$
    }
  )
  // 输入的值表示缓冲的值。其他的订阅则是在其订阅的时候一次性返回缓冲的值
  // 0 1 2
  // 1 2 3 3
  // 2 3 4 4 4
  // 5 5 5
  // ...
)
result.subscribe(data => console.log(data))
setTimeout(() => {
  result.subscribe(data => console.log(data))
}, 3000)
setTimeout(() => {
  result.subscribe(data => console.log(data))
}, 4000)
```
