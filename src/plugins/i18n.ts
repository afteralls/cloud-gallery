import langData from '@/languages/langData'
import type { App } from 'vue'

export default {
  install: (app: App) => {
    const { language } = useNavigatorLanguage()
    const langHandler: string = !!language.value?.match('ru') ? 'ru' : 'en'
    
    const curLang = useStorage<string>('lang', langHandler)
    const changeLang = () => curLang.value = curLang.value === 'en' ? 'ru' : 'en'
    
    app.config.globalProperties.$i18n = (key: string) =>
      key.split('.').reduce((o, i) => o[i], langData[curLang.value])
    app.provide('func', app.config.globalProperties.$i18n)
    app.provide('i18n', changeLang)
    app.provide('curLang', curLang.value)
  }
}
