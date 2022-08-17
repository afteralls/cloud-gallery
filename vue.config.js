const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: 'Fast Gallery',
    short_name: 'fast-gallery',
    themeColor: '#3e5082',
    lang: 'ru',
    description: 'Галерея для быстрой загрузки и просмотра изображений',
    manifestOptions: {
      display: 'standalone',
      background_color: '#3e5082'
    }
  }
})
