import { useStorage, useNavigatorLanguage } from '@vueuse/core'
import type { App } from 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    $i18n: (key: string) => string
  }
}

export default {
  install: (app: App, options: any) => {    
    const { language } = useNavigatorLanguage()
    const validLang = language.value?.includes('-') ? language.value?.split('-')[0] : language.value
    const langHandler = validLang === 'ru' ? 'ru' : 'en'
    const currentLang = useStorage<string>('lang', langHandler)

    const changeLang = () =>
      currentLang.value === 'en' ? currentLang.value = 'ru' : currentLang.value = 'en'
  
    app.config.globalProperties.$i18n = key =>
      key.split('.').reduce((o, i) => o[i], options[currentLang.value])
    app.provide(import.meta.env.VITE_I18N, changeLang)
  }
}