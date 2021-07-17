export default {
  template: '<div>{{ name }}</div>',
  computed: {
    ...Vuex.mapState('common', {
      commonName: state => state.name
    }),
    ...Vuex.mapState('home', {
      homeName: state => state.name
    })
  },
  methods: {
    ...Vuex.mapActions('common', {
      commonResetName: 'resetName'
    }),
    ...Vuex.mapActions('home', {
      homeResetName: 'resetName'
    })
  }
}
