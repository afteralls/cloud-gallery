import { createRouter, createWebHistory } from 'vue-router'
import GalleryView from '../views/GalleryView'
import UploadView from '../views/UploadView'
import NotFoundView from '../views/NotFoundView'
import AuthView from '../views/AuthView'

const routes = [
  {
    path: '/home',
    name: 'Главная | Plane of Euthymia',
    component: GalleryView,
    alias: '/'
  },
  {
    path: '/upload',
    name: 'Добавить в коллекцию | Plane of Euthymia',
    component: UploadView
  },
  {
    path: '/auth',
    name: 'Авторизация | Plane of Euthymia',
    component: AuthView
  },
  {
    path: '/:notFound(.*)',
    name: 'Вы вышли за границы возможного',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, _, next) => {
  const go = () => { document.title = to.name; next() }
  if (to.path === '/upload') {
    localStorage.getItem('auth-token') ? go() : next({ path: '/' })
  } else { go() }
})

export default router
