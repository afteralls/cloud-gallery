import { createRouter, createWebHistory } from 'vue-router'
import GalleryPage from '../views/GalleryPage'
import UploadPage from '../views/UploadPage'
import NotFoundPage from '../views/NotFoundPage'

const routes = [
  {
    path: '/home',
    name: 'Галерея',
    component: GalleryPage,
    alias: '/'
  },
  {
    path: '/upload',
    name: 'Добавить в коллекцию | Plane of Euthymia',
    component: UploadPage
  },
  {
    path: '/:notFound(.*)',
    name: 'Уп-с... Кажется, вы потерялись',
    component: NotFoundPage
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
