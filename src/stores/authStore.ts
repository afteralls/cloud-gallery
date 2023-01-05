import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import axios from 'axios'
import { error } from '@/utils/errorHandler'
import { computed } from 'vue'
import { useNotfStore } from './notfStore'

export const useAuthStore = defineStore('auth', () => {
  const notf = useNotfStore()
  const authToken = useStorage<string>('auth-token', null)
  const email = useStorage<string>('email', null)
  const isAuthenticated = computed(() => !!authToken.value)
  const key = 'AIzaSyDbP389NOWDFZ4oAz8lMLDlm2TdrzCdUbg'

  const login = async (payload: any) => {
    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`
      const { data } = await axios.post(url, { ...payload, returnSecureToken: true })
      authToken.value = data.idToken
      email.value = payload.email.split('@')[0]
      notf.addNotification(`Добро пожаловать, ${email.value}`)
    } catch (e: any) { notf.addNotification(error(e.response.data.error.message)) }
  }

  const logout = () => { authToken.value = null }

  return { email, isAuthenticated, login, logout }
})
