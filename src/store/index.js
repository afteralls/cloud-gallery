import { createStore } from 'vuex'
import auth from './modules/auth.module'
import notification from './modules/notification.module'

export default createStore({
  state: () => ({
    templates: localStorage.getItem('template')
  }),
  getters: {
    template (state) { return state.templates }
  },
  modules: { auth, notification }
})
