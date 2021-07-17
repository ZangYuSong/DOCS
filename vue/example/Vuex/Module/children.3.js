const createNamespacedHelpers = Vuex.createNamespacedHelpers
const commonMap = createNamespacedHelpers('common')
const homeMap = createNamespacedHelpers('home')

export default {
  template: '<div>{{ name }}</div>',
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
    })
  }
}
