Vue.component('name', {
  template: `<div class="ml-message">{{ message }}</div>`,
  data() {
    return {
      message: ''
    }
  },
  model: {
    prop: 'data',
    event: 'data'
  },
  components: { component },
  directives: { directive },
  filters: { filter },
  created() {},
  beforeRouteEnter(to, from, next) {},
  props: ['data'],
  methods: {
    click() {}
  },
  watch: {
    message(val, oldVal) {}
  }
})
