export const useAuthStore = defineStore('auth', () => {
  const notf = useNotfStore()
  const authToken = useStorage<string>('auth-token', null)
  const email = useStorage<string>('email', null)
  const isAuthenticated = computed<boolean>(() => !!authToken.value)
  const KEY = 'AIzaSyDbP389NOWDFZ4oAz8lMLDlm2TdrzCdUbg'
  const i18n: any = inject('func')

  const errorCodes: Errors = {
    EMAIL_NOT_FOUND: i18n('notf.emailNF'),
    INVALID_PASSWORD: i18n('notf.passNF')
  }

  const errorHandler = (errCode: string) => errorCodes[errCode] || i18n('notf.err')

  const login = async (payload: any) => {
    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${KEY}`
      const { data } = await axios.post(url, { ...payload, returnSecureToken: true })
      authToken.value = data.idToken
      email.value = payload.email.split('@')[0]
      notf.addNotification(`${i18n('notf.welcome')}, ${email.value}`)
    } catch (e: any) { notf.addNotification(errorHandler(e.response.data.error.message)) }
  }

  const logout = () => authToken.value = null

  return { email, isAuthenticated, login, logout }
})
