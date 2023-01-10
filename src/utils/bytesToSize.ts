const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB']

export const bytesToSize = (bytes: number) => {
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  return `${Math.round(bytes / (1024 ** i))} ${sizes[i]}`
}
