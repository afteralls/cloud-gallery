import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyBHgjDXYZ-xksiD_Toy7mY9y1uHtcn0VVU',
  authDomain: 'plane-of-euthymia-dfcb2.firebaseapp.com',
  projectId: 'plane-of-euthymia-dfcb2',
  storageBucket: 'plane-of-euthymia-dfcb2.appspot.com',
  messagingSenderId: '74064285343',
  appId: '1:74064285343:web:60d3f1dfacc149791a5caa'
}

initializeApp(firebaseConfig)
createApp(App).use(store).use(router).mount('#app')
