import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyDbP389NOWDFZ4oAz8lMLDlm2TdrzCdUbg',
  authDomain: 'smart-web-gallery.firebaseapp.com',
  projectId: 'smart-web-gallery',
  storageBucket: 'smart-web-gallery.appspot.com',
  messagingSenderId: '417755037264',
  appId: '1:417755037264:web:fb9bf8e5a8810344155b55'
}

initializeApp(firebaseConfig)
createApp(App).use(store).use(router).mount('#app')
