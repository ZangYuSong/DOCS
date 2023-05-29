# effectScope

## api 简介

- effectScope: 创建一个 effect 作用域，可以捕获其中所创建的响应式副作用 (即计算属性和侦听器)，这样捕获到的副作用可以一起处理。
  接收一个可选参数 `detached?: boolean`，表示是否阻断和父级的联系，若为 true 则表示与父级断开关联，执行父级 stop 方法时会递归停止子集的监听，但子级 detached 为 true 时则不会停止。
- getCurrentScope: 如果有的话，返回当前活跃的 effect 作用域。
- onScopeDispose: 在当前活跃的 effect 作用域上注册一个处理回调函数。当相关的 effect 作用域停止时会调用这个回调函数。这个方法可以作为可复用的组合式函数中 onUnmounted 的替代品，它并不与组件耦合，因为每一个 Vue 组件的 setup() 函数也是在一个 effect 作用域中调用的。

## 应用案例

### 性能提升

```js
function useMouse() {
  const x = ref(0);
  const y = ref(0);
  function handler(e) {
    x.value = e.x;
    y.value = e.y;
  }
  window.addEventListener("mousemove", handler);
  onUnmounted(() => {
    window.removeEventListener("mousemove", handler);
  });
  return { x, y };
}
```

如上：当多个组件同时使用该 hook 则会创建多个监听事件，从而导致性能问题

```js
function useMouse() {
  const x = ref(0);
  const y = ref(0);
  function handler(e) {
    x.value = e.x;
    y.value = e.y;
  }
  window.addEventListener("mousemove", handler);
  onScopeDispose(() => {
    // setp-5
    window.removeEventListener("mousemove", handler);
  });
  return { x, y };
}

function createSharedComposable(composable) {
  let subscribers = 0;
  let state, scope;
  const dispose = () => {
    // setp-2
    subscribers -= 1;
    if (scope && subscribers <= 0) {
      // setp-4
      scope.stop();
      state = scope = null;
    }
  };
  return (...args) => {
    subscribers += 1;
    if (!state) {
      // setp-1
      scope = effectScope(true);
      state = scope.run(() => composable(...args));
    }
    onScopeDispose(dispose);
    return state;
  };
}

const useSharedMouse = createSharedComposable(useMouse);

export default useSharedMouse;
```

如上：

- 第一次使用的时候执行 `step-1`，后续使用则直接返回对应的数据
- 当某个组件销毁的时候执行 `step-2`，因为设置了 `detached=true`，所以组件销毁的时候不会执行对应 `scope` 的 `stop` 函数
- 当所有使用到的组件都销毁之后，执行 `setp-4`，从而执行 `setp-5` 移除对应的监听事件

总结：其这种用法效果类似我们的事件委托

### 状态管理

```js
function useGlobalState(run) {
  let initialized = false;
  let state;
  const scope = effectScope(true);
  return () => {
    if (!initialized) {
      state = scope.run(run);
      initialized = true;
    }
    return state;
  };
}

const store = useGlobalState(() => {
  // 类似 state
  const count = ref(0);
  // 类似 getters
  const doubleCount = computed(() => count.value * 2);
  // 类似 getters
  function increment() {
    count.value += 1;
  }
  return { count, doubleCount, increment };
});

// 组件 A
const { count, doubleCount } = store;
console.log(count, doubleCount); // 响应式输出

// 组件 B
const { increment } = store;
increment();
```

总结：某种场景可以替代 vuex。[createGlobalState](https://github.com/vueuse/vueuse/blob/main/packages/shared/createGlobalState/index.ts)

## 最后

推荐大家使用 [vueuse](https://vueuse.org/guide/) 里边有很多常用的 `hook`。其内部大量使用了 `effectScope` 特性，对其有很多的妙用。比如我们常用的事件监听

```ts
export function useEventListener(...args: any[]) {
  let target: MaybeRefOrGetter<EventTarget> | undefined;
  let events: Arrayable<string>;
  let listeners: Arrayable<Function>;
  let options: MaybeRefOrGetter<boolean | AddEventListenerOptions> | undefined;

  // step-1
  if (typeof args[0] === "string" || Array.isArray(args[0])) {
    [events, listeners, options] = args;
    target = defaultWindow;
  } else {
    [target, events, listeners, options] = args;
  }

  // step-2
  if (!target) return noop;

  // step-3
  if (!Array.isArray(events)) events = [events];
  if (!Array.isArray(listeners)) listeners = [listeners];

  const cleanups: Function[] = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };

  const register = (el: any, event: string, listener: any, options: any) => {
    el.addEventListener(event, listener, options);
    return () => el.removeEventListener(event, listener, options);
  };

  // step-4
  const stopWatch = watch(
    () => [
      unrefElement(target as unknown as MaybeElementRef),
      toValue(options),
    ],
    ([el, options]) => {
      cleanup();
      if (!el) return;

      cleanups.push(
        ...(events as string[]).flatMap((event) => {
          return (listeners as Function[]).map((listener) =>
            register(el, event, listener, options)
          );
        })
      );
    },
    { immediate: true, flush: "post" }
  );

  const stop = () => {
    stopWatch();
    cleanup();
  };

  // step-5
  tryOnScopeDispose(stop);

  return stop;
}
```

- step-1: 处理传入的参数，第一个参数是可选的默认是 window
- step-2: 如果没有目标，直接返回一个空函数。也就是不做任何的事件绑定
- step-3: 处理 events, listeners，统一都转成数组
- step-4: 循环绑定事件
- step-5: 组件销毁的时候移除事件
