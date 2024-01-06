import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Virus from '../views/Virus.vue'
import Mosaic from '../views/Mosaic.vue'
import Sweep from '../views/Sweep.vue'
import LetterDrop from '../views/LetterDrop.vue'
import Charrom from '../views/Charrom.vue'

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
         component: Virus
      },
      {
         path: '/mosaic',
         name: 'mosaic',
         component: Mosaic
      },
      {
         path: '/sweep',
         name: 'sweep',
         component: Sweep
      },
      {
         path: '/letterdrop',
         name: 'letterdrop',
         component: LetterDrop
      },
      {
         path: '/charrom',
         name: 'charrom',
         component: Charrom
      },
   ]
})

export default router
