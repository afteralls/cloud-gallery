const errorCodes: Errors = {
  EMAIL_NOT_FOUND: 'User with this E-Mail was not found',
  INVALID_PASSWORD: 'You entered the wrong password'
}

export const errorHandler = (errCode: string) => errorCodes[errCode] || 'Something went wrong...'
