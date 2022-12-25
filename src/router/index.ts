import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import GalleryView from '@/views/GalleryView.vue'
import UploadView from '@/views/UploadView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Cloud Gallery',
      component: HomeView,
      alias: '/'
    },
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('@/views/AuthView.vue')
    },
    {
      path: '/gallery',
      name: 'Gallery',
      component: GalleryView
    },
    {
      path: '/upload',
      name: 'Upload',
      component: UploadView
    },
  ]
})

router.beforeEach((to, _, next) => {
  document.title = to.name
  next()
  setTimeout(() => { window.scrollTo(0,0) }, 250)
})

export default router
