export default class GameState {
   constructor() {
      this.state = GameState.INIT
      this.stateDuration = -1.0
   }

   initialized() {
      this.state = GameState.PLAY
   }

   requestSubmit() {
      this.state = GameState.SUBMIT_REQUESTED
      this.stateDuration = 1.0
   }

   gameOver() {
      this.state = GameState.GAME_OVER
   }

   isGameOver() {
      return this.state == GameState.GAME_OVER
   }
   isSubmitRequested() {
      return this.state == GameState.SUBMIT_REQUESTED  
   }


   update(deltaMS, statusCallback) {
      if (this.stateDuration < 0 ) {
         this.stateDuration = -1.0
         return
      } 

      this.stateDuration -= (deltaMS/1000.0) 
      if (this.stateDuration <= 0 ) {
         // console.log(`state ${this.state} delay expired; advance state`)
         this.stateDuration = -1.0 
         if (this.state == GameState.SUBMIT_REQUESTED) {
            this.state = GameState.SUBMIT
            statusCallback(this.state)
         }
      }
   }
}


GameState.INIT=0
GameState.PLAY=1
GameState.SUBMIT_REQUESTED=2
GameState.SUBMIT = 3
GameState.FAIL = 4
GameState.SUCCESS = 5
GameState.REMOVE = 6
GameState.GAME_OVER = 7