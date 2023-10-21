import { createStore } from 'vuex'
import auth from './modules/auth.module'
import notification from './modules/notification.module'
// import data from './modules/data.module'

export default createStore({
  modules: { auth, notification }
})
