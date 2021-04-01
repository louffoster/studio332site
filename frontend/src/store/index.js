import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
   state: {
      authToken: "",
      games: [],
      working: false,
   },

   getters: {
      gameID: state => gameURL => {
         let g = state.games.find(g => g.url == gameURL)
         if (g ) {
            return g.id
         }
         return 0
      }
   }, 

   mutations: {
      setAuthToken(state, token ) {
         state.authToken = token
      },
      setWorking(state, flag) {
         state.working = flag
      },
      setGames( state, games) {
         state.games.splice(0, state.games.length)
         games.forEach( g => {
            g.highScores = []
            state.games.push(g)
         })
      },
      setGameHighScores( state, {id, scores}) {
         let gIdx = state.games.findIndex(g => g.id = id) 
         if (gIdx > -1) {
            let g = state.games[gIdx]
            g.highScores = scores 
            state.games.splice(gIdx, 1, g)
         }
      }
   },

   actions: {
      startGame(ctx, gameID) {
         ctx.commit("setWorking", true)
         axios.get(`/api/games/${gameID}/start`).then(response => {
            ctx.commit("setAuthToken", response.data)
            ctx.commit("setWorking", false)
         }).catch( () => {
            //console.error("Unable to start game "+ err)
            ctx.commit("setWorking", false)
            // TODO Error handling
         })
      },
      async getGames(ctx) {
         ctx.commit("setWorking", true)
         await axios.get("/api/games").then( response=> {
            ctx.commit("setGames", response.data)
            ctx.commit("setWorking", false)
         }).catch( () => {
            // console.error("No games! "+ err)
            ctx.commit("setWorking", false)
         })
      },
      getHighScores(ctx, gameID) {
         if (ctx.state.games.length > 0) return
         ctx.commit("setWorking", true)
         axios.get(`/api/games/${gameID}/hiscore`).then(response => {
            ctx.commit("setGameHighScores", {id: gameID, scores: response.data})
            ctx.commit("setWorking", false)
         }).catch( () => {
            ctx.commit("setGameHighScores", { id: gameID, scores: [] })
            ctx.commit("setWorking", false)
         })
      },
      // addHighScore(ctx, {gameID, name, score}) {
      //    // TODO
      // }
    },

   modules: {},
   plugins: []
})
