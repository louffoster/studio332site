import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes: [
      {
         path: '/',
         name: 'home',
         component: HomeView
      },
      {
         path: '/virus',
         name: 'virus',
         component: () => import('../views/Virus.vue')
      },
      {
         path: '/mosaic',
         name: 'mosaic',
         component: () => import('../views/Mosaic.vue')
      },
      {
         path: '/sweep',
         name: 'sweep',
         component: () => import('../views/Sweep.vue')
      },
      {
         path: '/letterdrop',
         name: 'letterdrop',
         component: () => import('../views/LetterDrop.vue')
      },
      {
         path: '/charrom',
         name: 'charrom',
         component: () => import('../views/Charrom.vue')
      },
   ]
})

export default router
