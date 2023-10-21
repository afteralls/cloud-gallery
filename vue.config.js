const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: 'Fast Gallery',
    short_name: 'fast-gallery',
    themeColor: '#3e5082',
    lang: 'en',
    description: 'Gallery for fast loading and comfortable viewing of images with an authorization system, photo compression and smart tag searchй',
    manifestOptions: {
      display: 'standalone',
      background_color: '#3e5082'
    }
  }
})
