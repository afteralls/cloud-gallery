import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initializeApp } from 'firebase/app'
import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n'

import '@/assets/styles/main.scss'

const firebaseConfig = {
  apiKey: 'AIzaSyDbP389NOWDFZ4oAz8lMLDlm2TdrzCdUbg',
  authDomain: 'smart-web-gallery.firebaseapp.com',
  projectId: 'smart-web-gallery',
  storageBucket: 'smart-web-gallery.appspot.com',
  messagingSenderId: '417755037264',
  appId: '1:417755037264:web:fb9bf8e5a8810344155b55'
}

initializeApp(firebaseConfig)

const app = createApp(App)
app.use(createPinia()).use(router).use(i18n).mount('#app')
