/**
 * Checks a string for invalid characters
 * @param value
*/

export const isValid = (value: string) => !!(!value.match(' ') && value.length)