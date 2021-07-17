export default {
  template: `
  <div>
    <button @click="setData">赋值</button>
    {{ obj.a }}
  </div>`,
  data() {
    return {
      obj: {
        a: ''
      }
    }
  },
  methods: {
    setData() {
      this.obj.a = '赋值成功'
      // this.$set(this.obj, 'a', '赋值成功')
    }
  }
}
