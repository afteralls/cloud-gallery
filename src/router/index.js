import { createRouter, createWebHistory } from 'vue-router'
import GalleryView from '../views/GalleryView'
import UploadView from '../views/UploadView'
import NotFoundView from '../views/NotFoundView'

const routes = [
  {
    path: '/home',
    name: 'Галерея',
    component: GalleryView,
    alias: '/'
  },
  {
    path: '/upload',
    name: 'Добавить в коллекцию',
    component: UploadView
  },
  {
    path: '/:notFound(.*)',
    name: 'Уп-с... Кажется, вы потерялись',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, _, next) => {
  document.title = to.name
  next()
})

export default router
