import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LatticeWords from '../views/LatticeWords.vue'
import Virus from '../views/Virus.vue'

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
         path: '/latticewords',
         name: 'latticewords',
         component: LatticeWords
      },
   ]
})

export default router
