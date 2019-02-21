const createNamespacedHelpers = Vuex.createNamespacedHelpers
const commonMap = createNamespacedHelpers('common')
const homeMap = createNamespacedHelpers('home')

export default {
  template: `<div>{{ commonName }} {{ homeName }}
  <div><button @click="resetName(true)">commonResetName</button></div>
  <div><button @click="resetName(false)">HomeResetName</button></div></div>`,
  computed: {
    ...commonMap.mapState({
      commonName: state => state.name
    }),
    ...homeMap.mapState({
      homeName: state => state.name
    })
  },
  methods: {
    ...commonMap.mapActions({
      commonResetName: 'resetName'
    }),
    ...homeMap.mapActions({
      homeResetName: 'resetName'
    }),
    resetName(type) {
      if (type) {
        this.commonResetName('commonResetName')
      } else {
        this.homeResetName('homeResetName')
      }
    }
  }
}
