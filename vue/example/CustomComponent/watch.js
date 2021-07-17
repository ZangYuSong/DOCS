export default {
  template: `
  <div>
    <div>a : <input v-model="a"></div>
    <div>b : <input v-model="b"></div>
    <div>c : <input v-model="c.d"></div>
  </div>
  `,
  data() {
    return {
      a: '',
      b: '',
      c: {
        d: ''
      }
    }
  },
  methods: {
    bFn(val, oldVal) {
      console.log('b', val, oldVal)
    }
  },
  watch: {
    a(val, oldVal) {
      console.log('a', val, oldVal)
    },
    b: 'bFn',
    c() {
      console.log('c')
    },
    // c: {
    //   handler() {
    //     console.log("c");
    //   },
    //   deep: true
    // },
    'c.d'() {
      console.log('c.d')
    }
  }
}
