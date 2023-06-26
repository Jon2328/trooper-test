import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'about',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/profile-creation',
      name: 'profile-creation',
      component: () => import('../views/ProfileCreation.vue')
    }
  ]
})

export default router
