export default {
  template: `
  <div>
    <input v-model="params">
    <button @click="search" :disabled="searchDisabled">查询</button>
  </div>
  `,
  data() {
    return {
      params: ''
    }
  },
  props: ['searchDisabled'],
  methods: {
    search() {
      this.$emit('filter-change', this.params)
    }
  }
}
