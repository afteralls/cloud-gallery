import { createRouter, createWebHistory } from 'vue-router'
import GalleryView from '../views/GalleryView'
import UploadView from '../views/UploadView'
import NotFoundView from '../views/NotFoundView'

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: GalleryView,
    alias: '/'
  },
  {
    path: '/upload',
    name: 'Add to Collection',
    component: UploadView
  },
  {
    path: '/:notFound(.*)',
    name: "Oops... It seems you're lost",
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
