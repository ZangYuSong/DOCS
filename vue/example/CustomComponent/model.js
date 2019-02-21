export default {
  template: `
  <div style="margin-top: 20px"> 
    <input :checked="checkedProp" type="checkbox" @click="checkFn">
  </div>
  `,
  model: {
    prop: 'checkedProp',
    event: 'checkedEvent'
  },
  props: ['checkedProp'],
  methods: {
    checkFn() {
      this.$emit('checkedEvent', !this.checkedProp)
    }
  }
}
