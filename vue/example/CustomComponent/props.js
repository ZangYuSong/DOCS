export default {
  template: `
  <div>
    <div>{{ message }}</div>
    <div>{{ listLen }}</div>
    <div>{{ typeof test }} {{ test }}</div>
  </div>
  `,
  props: ['message', 'listLen', 'test']
  // props: {
  //   message: String,
  //   listLen: Number,
  //   test: {
  //     type: Number,
  //     default: 3
  //   }
  // }
}
