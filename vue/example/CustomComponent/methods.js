export default {
  template: `
  <div>
    <button @click="click1FN">click1FN</button>
    <button @click="click2FN">click2FN</button>
  </div>
  `,
  methods: {
    click1FN() {
      console.log(this)
    },
    click2FN: () => {
      console.log(this)
    }
  }
}
