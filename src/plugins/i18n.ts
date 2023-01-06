import { useStorage, useNavigatorLanguage } from '@vueuse/core'
import langData from '@/languages/langData'
import type { App } from 'vue'

export default {
  install: (app: App) => {    
    const { language } = useNavigatorLanguage()
    const validLang = language.value?.includes('-') ? language.value?.split('-')[0] : language.value
    const langHandler = validLang === 'ru' ? 'ru' : 'en'
    const curLang = useStorage<string>('lang', langHandler)

    const changeLang = () => curLang.value === 'en' ? curLang.value = 'ru' : curLang.value = 'en'
  
    app.config.globalProperties.$i18n = (key: string) =>
      key.split('.').reduce((o: any, i: any) => o[i], langData[curLang.value])
    app.provide('i18n', changeLang)
  }
}