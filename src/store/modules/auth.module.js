import { error } from '@/utils/errorHandler'
import axios from 'axios'
const AUTH_KEY = 'auth-token'
const KEY = 'AIzaSyDbP389NOWDFZ4oAz8lMLDlm2TdrzCdUbg'

export default {
  state: () => ({
    token: localStorage.getItem(AUTH_KEY),
    email: localStorage.getItem('email')
  }),
  getters: {
    token (state) { return state.token },
    email (state) { return state.email },
    isAuthenticated (_, getters) { return !!getters.token }
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      localStorage.setItem(AUTH_KEY, token)
    },
    logout (state) {
      state.token = null
      localStorage.removeItem(AUTH_KEY)
    },
    setEmail (state, email) {
      state.email = email
      localStorage.setItem('email', email)
    }
  },
  actions: {
    async login ({ commit, dispatch }, payload) {
      try {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${KEY}`
        const { data } = await axios.post(url, { ...payload, returnSecureToken: true })
        commit('setToken', data.idToken)
        commit('setEmail', payload.email)
      } catch (e) {
        dispatch('setNotification', error(e.response.data.error.message), { root: true })
      }
    }
  }
}
