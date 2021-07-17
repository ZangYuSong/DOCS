export default {
  template: '<div>{{ name }}</div>',
  computed: {
    ...Vuex.mapState({
      commonName: state => state.common.name
    }),
    ...Vuex.mapState({
      homeName: state => state.home.name
    })
  },
  methods: {
    ...Vuex.mapActions({
      commonResetName: 'common/resetName'
    }),
    ...Vuex.mapActions({
      homeResetName: 'home/resetName'
    })
  }
}
