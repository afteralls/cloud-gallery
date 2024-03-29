export const useAuthStore = defineStore('auth', () => {
  const notf = useNotfStore()
  const i18n = inject('func') as LangFunc

  const authToken = useStorage<string>('auth-token', null)
  const email = useStorage<string>('email', null)
  const isAuthenticated = computed<boolean>(() => !!authToken.value)
  const KEY = 'AIzaSyDbP389NOWDFZ4oAz8lMLDlm2TdrzCdUbg'

  const errorCodes: Errors = {
    EMAIL_NOT_FOUND: i18n('notf.emailNF'),
    INVALID_PASSWORD: i18n('notf.passNF')
  }

  const errorHandler = (errCode: string) => errorCodes[errCode] || i18n('notf.err')
  const logout = () => authToken.value = null

  const login = async (payload: any) => {
    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${KEY}`
      const { data } = await axios.post(url, { ...payload, returnSecureToken: true })
      authToken.value = data.idToken
      email.value = payload.email.split('@')[0]
      notf.addNotification(`${i18n('notf.welcome')}, ${email.value}`)
    } catch (e) { notf.addNotification(errorHandler(e.response.data.error.message)) }
  }

  return { email, isAuthenticated, login, logout }
})
