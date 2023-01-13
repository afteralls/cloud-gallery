import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import GalleryView from '@/views/GalleryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ top: 0 })
      }, 250)
    })
  },
  routes: [
    {
      path: '/home',
      name: 'route.home',
      component: HomeView,
      alias: '/'
    },
    {
      path: '/auth',
      name: 'route.auth',
      component: () => import('@/views/AuthView.vue')
    },
    {
      path: '/gallery',
      name: 'route.gallery',
      component: GalleryView
    },
    {
      path: '/upload',
      name: 'route.upload',
      component: () => import('@/views/UploadView.vue')
    },
  ]
})

export default router
