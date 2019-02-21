export default {
  template: `
  <div>
    <div>x : <input v-model="x"></div>
    <div>y : <input v-model="y"></div>
    <div>{{ result }}</div>
    <div>{{ result }}</div>
  </div>
  `,
  data() {
    return {
      x: 0,
      y: 0
    }
  },
  computed: {
    result() {
      console.log('加')
      return Number(this.x) + Number(this.y)
    }
  }
}

// export default {
//   template: `
//   <div>
//     <div>x : <input v-model="result"></div> 
//     <div>{{ result }}</div>
//   </div>
//   `,
//   data() {
//     return {
//       message: 0
//     }
//   },
//   computed: {
//     result: {
//       get() {
//         return this.message + '_'
//       },
//       set(value) {
//         this.message = value + '|'
//       }
//     }
//   }
// }
