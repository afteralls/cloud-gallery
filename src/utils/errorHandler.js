const errorCodes = {
  EMAIL_NOT_FOUND: 'Пользователь с таким E-Mail не был найден',
  INVALID_PASSWORD: 'Вы ввели неверный пароль'
}

export const error = (errCode) => errorCodes[errCode] || 'Что-то пошло не так...'
