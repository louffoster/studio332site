import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Games from '@/views/Games.vue'
import LatticeWords from '@/views/LatticeWords.vue'
import Wordomino from '@/views/Wordomino.vue'
import Squares from '@/views/Squares.vue'
import Virus from '@/views/Virus.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      alias: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/virus',
      name: 'virus',
      component: Virus
    },
    {
      path: '/games',
      name: 'games',
      component: Games
    },
    {
      path: '/games/latticewords',
      name: 'latticewords',
      component: LatticeWords
    },
    {
      path: '/games/squares',
      name: 'squares',
      component: Squares
    },
    {
      path: '/games/wordomino',
      name: 'wordomino',
      component: Wordomino
    }
  ]
})
