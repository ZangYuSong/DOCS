export default {
  template: `
  <div style="margin-top: 50px">{{ load }}</div>
  `,
  data() {
    return {
      load: '表格无数据'
    }
  },
  methods: {
    loadData(params) {
      this.load = '我去加载数据'
      this.$emit('is-loading', true)
      setTimeout(() => {
        this.load = '加载的数据是：' + params
        this.$emit('is-loading', false)
      }, 3000)
    }
  }
}
