import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Games from '@/views/Games.vue'
import LatticeWords from '@/views/LatticeWords.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/games',
      name: 'games',
      component: Games
    },
    {
      path: '/latticewords',
      name: 'latticewords',
      component: LatticeWords
    }
  ]
})
