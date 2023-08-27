import { defineStore } from 'pinia'

export const useGamesStore = defineStore({
   id: 'games',
   state: () => ({
      fullScreen: false,
      currentGame: "",
   }),
   getters: {
   },
   actions: {
   }
})
