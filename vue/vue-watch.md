# vue watch 的使用

- 观察 Vue 实例变化的**一个表达式或计算属性函数**。回调函数得到的参数为新值和旧值。表达式只接受监督的键路径。对于更复杂的表达式，用一个函数取代。
- 在变异 (不是替换) 对象或数组时，旧值将与新值相同，因为它们的引用指向同一个对象/数组。Vue 不会保留变异之前值的副本。

```js
export default {
  data() {
    return {
      example0: '',
      example1: '',
      example2: {
        inner0: 1,
        innner1: 2
      }
    };
  },
  watch: {
    // 监听数据中的 example0
    example0(curVal, oldVal) {
      console.log(curVal, oldVal);
    },
    // 监听数据中的 example1，回调函数是方法中的 method1
    example1: 'method1',
    // 监听数据中的 example2，指定一个对象
    example2: {
      // 回调函数
      handler(curVal, oldVal) {
        conosle.log(curVal, oldVal);
      },
      // 深度监听 例如监听对象 example2 内部值得变化
      deep: true
    }
  },
  methods: {
    method1(curVal, oldVal) {
      conosle.log(curVal, oldVal);
    }
  }
};
```
