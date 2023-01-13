/**
 * Removes extra characters and converts the string to an array of tags
 * @param hashtags 
 * @returns Аn array of tags
*/

export const getValidTagsCollection = (hashtags: string) => hashtags.trim().split(' ')