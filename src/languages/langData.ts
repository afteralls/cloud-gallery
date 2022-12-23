interface LangProps {
  [key: string]: string | object
}

export default {
  en: {
    nav: {
      name: 'Cloud Gallery',
      name_sh: 'Cloud Gallery',
      darkMode: 'Dark Mode',
      linkTitles: {
        git: 'My page on GitHub',
        telegram: 'My Telegram account',
        home: 'Go to home page'
      }
    }
  },
  ru: {
    nav: {
      name: 'Облачная галерея',
      name_sh: 'Cloud Gallery',
      darkMode: 'Тёмная тема',
      linkTitles: {
        git: 'Моя страница на GitHub',
        telegram: 'Мой Telegram аккаунт',
        home: 'Вернуться на главную'
      }
    }
  }
} as LangProps
