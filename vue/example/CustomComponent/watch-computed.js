export default {
  template: `<div v-if="data">展示页面</div>`,
  props: ['data'],
  methods: {
    init() {
      console.log('初始化')
    }
  },
  watch: {
    data(val) {
      if (val) {
        this.init()
      }
    }
  }
}

// export default {
//   template: `<div v-if="watchData">展示页面</div>`,
//   props: ["data"],
//   methods: {
//     init() {
//       console.log("初始化");
//     }
//   },
//   computed: {
//     watchData() {
//       if (this.data) {
//         this.init();
//       }
//       return this.data;
//     }
//   }
// };
