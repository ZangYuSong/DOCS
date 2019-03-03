# Vue computed 实现原理

Vue 2.5.17

* 1、Vue 在初始化的时候会 initState ，这个方法会初始化 props methods data computed watch

``` js
// 4069
vm._self = vm;
initLifecycle(vm);
initEvents(vm);
initRender(vm);
callHook(vm, 'beforeCreate');
initInjections(vm); // resolve injections before data/props
initState(vm);
initProvide(vm); // resolve provide after data/props
callHook(vm, 'created');

// 3303
function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}
```

* 2、在初始化 computed 的时候首先会拿到对应的 get 方法。其次在非 SSR 下会创建对应的 watcher。随后对其进行初始化

``` js
// 3422
var computedWatcherOptions = { lazy: true };

function initComputed(vm, computed) {
  var watchers = (vm._computedWatchers = Object.create(null))
  var isSSR = isServerRendering()
  for (var key in computed) {
    var userDef = computed[key]
    var getter = typeof userDef === 'function' ? userDef : userDef.get
    if ('development' !== 'production' && getter == null) {
      warn('Getter is missing for computed property "' + key + '".', vm)
    }
    if (!isSSR) {
      watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions)
    }
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else {
      if (key in vm.$data) {
        warn('The computed property "' + key + '" is already defined in data.', vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn('The computed property "' + key + '" is already defined as a prop.', vm)
      }
    }
  }
}
```

* 3、随后经过一系列的判断对其进行 `Object.defineProperty` 初始化。非 SSR 下会调用 `createComputedGetter` 方法对原始的 getter 进行加工

``` js
// 3286
var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

// 3465
function defineComputed(target, key, userDef) {
  var shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache ? createComputedGetter(key) : userDef
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop
    sharedPropertyDefinition.set = userDef.set ? userDef.set : noop
  }
  if ('development' !== 'production' && sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function() {
      warn('Computed property "' + key + '" was assigned to but it has no setter.', this)
    }
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

* 4、我们来看一下 `createComputedGetter` 是如何加工的，在获取计算属性的值时候其实是拿的 watcher.value。在这里我们先不管 evaluate 和 depend 是干什么的我们先看一下 watcher 如何定义

``` js
// 3489
function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}
```

* 5、watcher 的 value 实际上是调用的 wathcer.get 方法。这个方法有调用计算属性对应的 getter 方法。但我们在定义 watcher 的时候会传入  `{ lazy: true}` ，这时候我们在定义 watcher 的时候不会触发 get 方法，而反过来看步骤 4，当 `dirty = true` 的时候首先会调用 `watcher.evaluate()`

``` js
// 710
Dep.target = null;
var targetStack = [];
function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}
function popTarget () {
  Dep.target = targetStack.pop();
}


// 3082
var Watcher = function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
  // ...
  this.dirty = this.lazy;
  // ...
  this.value = this.lazy ? undefined : this.get()
}

// 3235
Watcher.prototype.get = function get() {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
}
```

* 6、当调用了 evaluate 方法就会计算一次 value，并将 dirty 置为 false。我们不妨设想一下：当我们的一开始的时候 dirty = true 会计算 value 随后 dirty = false，当我们的依赖项发生变化的时候将 dirty = true，这时候我们获取 value 的时候会重新计算。那么我们依赖项发生变化的时候是如何将对应的 dirty 设置为 true 的？

``` js
// 3246
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};
```

* 7、我们在初始化 data 或者 props 的时候都会触发 `defineReactive` 方法

``` js
// 966
function defineReactive(obj, key, val, customSetter, shallow) {
  // ...
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      var value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      var value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ('development' !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}

```

* 8、在我们调用 watcher.get 的时候会调用 pushTarget 方法，将 Dep.target 设置为当前的作用域（步骤 5 中的代码）。这时候我们调用计算属性的 getter。如果我们的计算属性依赖了 data 数据或者 prop 数据，就会触发其对应的 getter 方法。这时候就会触发依赖收集。

``` js
dep.depend()

// 693
Dep.prototype.depend = function depend() {
  if (Dep.target) {
    Dep.target.addDep(this)
  }
}

// 3169
Watcher.prototype.addDep = function addDep(dep) {
  var id = dep.id
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id)
    this.newDeps.push(dep)
    if (!this.depIds.has(id)) {
      dep.addSub(this)
    }
  }
}

// 684
Dep.prototype.addSub = function addSub(sub) {
  this.subs.push(sub)
}

```

* 9、我们在改变对应的依赖时候触发其 set 方法，`dep.notify()` 方法最终通知改变 dirty = true，从而重新计算 value

``` js
dep.notify()

// 699
Dep.prototype.notify = function notify() {
  // stabilize the subscriber list first
  var subs = this.subs.slice()
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update()
  }
}

// 3200
Watcher.prototype.update = function update() {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true
  } else if (this.sync) {
    this.run()
  } else {
    queueWatcher(this)
  }
}
```

## 运行步骤

* 初始化 cumputed 的时候会先初始化 props、data 等
* 初始化 cumputed(!SSR) 时候，会添加其对应的 wathcer（创建的时候不会触发 get 方法）。
* 我们在获取计算属性的值的时候，如果 dirty = true 会调用 wathcer.get 方法重新计算。随后 dirty = false
* 在调用 get 方法的时候启动依赖收集，将 wathcer 添加到对应依赖的 sub 里
* 在依赖项发生变化的时候会调用 set 方法，最终会调用 wathcer.update 方法将 dirty = true。这时候获取计算属性的时候会重新调用 wathcer.get 方法

## 总结

* 我们在依赖项没有变化的时候，一直使用的是 wathcer.value 也就是我们所说的缓存
* 依赖项发生变化的时候重新计算一次 wathcer.value