interface LangProps {
  [key: string]: string | object
}

export const en: LangProps = {
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
}

export const ru: LangProps = {
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
