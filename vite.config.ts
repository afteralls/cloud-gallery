import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        {
          'vue': ['ref', 'computed', 'watch', 'reactive', 'onMounted', 'inject'],
          'vue-router': ['useRouter', 'RouterView'],
          'pinia': ['defineStore'],
          'axios': [
            ['default', 'axios'],
          ],
          '@vueuse/core': [
            'useStorage',
            'useEventListener',
            'useFullscreen',
            'useSwipe',
            'useDark',
            'useNavigatorLanguage',
            'useResizeObserver',
            'useFileDialog',
            'useDropZone',
            'useOnline',
            'useImage'
          ],
          'firebase/storage': [
            'getStorage',
            ['ref', 'Ref'],
            'listAll',
            'uploadBytesResumable',
            'getBlob',
            'uploadBytes',
            'getDownloadURL',
            'getMetadata',
            'deleteObject',
            'updateMetadata'
          ]
        }
      ],
      dts: './types/imports.d.ts',
      defaultExportByFilename: true,
      dirs: [
        './src/utils',
        './src/stores'
      ]
    }),
    Components({
      dirs: ['./src/components', './src/assets/svg'],
      extensions: ['vue'],
      deep: true,
      dts: './types/components.d.ts'
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'safari-pinned-tab.svg'],
      manifest: {
        name: 'Cloud Gallery',
        short_name: 'Cloud Gallery',
        description: 'Gallery for fast loading and comfortable viewing of images',
        theme_color: '#242424',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
