export default {
  state: () => ({
    notification: null
  }),
  mutations: {
    setNotification (state, message) {
      state.notification = message
    },
    clearNotification (state) {
      state.notification = null
    }
  },
  getters: {
    getMessage (state) { return state.notification }
  },
  actions: {
    setNotification ({ commit }, message) {
      commit('setNotification', message)
      setInterval(() => {
        commit('clearNotification')
      }, 5000)
    }
  }
}
