const RESET_NAME = 'RESET_NAME'
export default {
  namespace: true,
  state: {
    name: 'name'
  },
  mutations: {
    [RESET_NAME](state, name) {
      state.name = name
    }
  },
  actions: {
    resetName({ commit }, name) {
      commit(RESET_NAME, name)
    }
  }
}
