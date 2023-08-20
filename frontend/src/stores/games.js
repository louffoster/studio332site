import { defineStore } from 'pinia'

export const useGamesStore = defineStore({
   id: 'games',
   state: () => ({
      fullScreen: false,
      currentGame: "",
      games: [
         { name: "latticewords", width: 460, height: 550, pixijs: false },
         { name: "virus", width: 300, height: 615, pixijs: true },
         { name: "mosaic", width: 360, height: 545, pixijs: true },
      ]
   }),
   getters: {
      gameInfo: (state) => {
         let g = state.games.find( g => g.name == state.currentGame)
         return g
      }
   },
   actions: {
      // increment() {
      //   this.counter++
      // }
   }
})
