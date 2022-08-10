const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: 'Smart Gallery',
    short_name: 'smart-gallery',
    themeColor: '#3e5082',
    lang: 'ru',
    description: 'Галерея для быстрой загрузки и просмотра изображений',
    manifestOptions: {
      display: 'standalone',
      background_color: '#3e5082'
    }
  }
})