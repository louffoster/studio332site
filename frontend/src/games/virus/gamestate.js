export default class GameState {
   constructor() {
      this.state = GameState.INIT
      this.stateDuration = -1.0
      this.stateRepeatCount = 0
   }

   initialized() {
      this.state = GameState.PLAY
   }

   requestSubmit() {
      this.state = GameState.SUBMIT_REQUESTED
      this.stateDuration = 0.5
      this.stateRepeatCount = 1
   }
   submitFailed() {
      this.state = GameState.FAIL
      this.stateDuration = 1.0
      this.stateRepeatCount = 1
   }
   submitSuccess( wordSize ) {
      this.state = GameState.SUCCESS
      this.stateDuration = 0.2
      this.stateRepeatCount = wordSize
   }

   isPlaying() {
      return this.state == GameState.PLAY
   }
   gameOver() {
      this.state = GameState.GAME_OVER
   }
   isSubmitting() {
      return (
         this.state == GameState.SUBMIT_REQUESTED || 
         this.state == GameState.FAIL
      ) 
   }
   isGameOver() {
      return this.state == GameState.GAME_OVER
   }

   update(deltaMS, statusCallback) {
      if (this.stateDuration < 0 ) {
         this.stateDuration = -1.0
         this.stateRepeatCount-- 
         this.stateRepeatCount = Math.max(0, this.stateRepeatCount)
         return
      } 

      this.stateDuration -= (deltaMS/1000.0) 
      if (this.stateDuration <= 0 ) {
         this.stateDuration = -1.0 

         if (this.state == GameState.SUBMIT_REQUESTED) {
            this.state = GameState.SUBMIT
            statusCallback(GameState.SUBMIT_REQUESTED, this.state)
         } else if (this.state == GameState.FAIL) {
            this.state = GameState.PLAY
            statusCallback(GameState.FAIL, this.state)
         } else if ( this.state == GameState.SUCCESS) {
            this.stateRepeatCount--
            if ( this.stateRepeatCount < 0) {
               this.stateRepeatCount = 0
               this.state = GameState.PLAY
               statusCallback(GameState.SUCCESS, this.state)
            } else {
               statusCallback(GameState.SUCCESS, this.state)
               this.stateDuration = 0.2
            }
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