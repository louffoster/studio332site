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
      this.stateDuration = 0.25
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
   clearVirus() {
      this.state = GameState.CLEAR_ALL
      this.stateDuration = 2
      this.stateRepeatCount = 1   
   }
   gameLost() {
      this.state = GameState.PLAYER_LOST
      this.stateDuration = 2
      this.stateRepeatCount = 1   
   }
   isLosing() {
      return this.state == GameState.PLAYER_LOST
   }
   isWinning() {
      return this.state == GameState.CLEAR_ALL
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
         } else if ( this.state == GameState.CLEAR_ALL ) {
            this.state = GameState.GAME_OVER
            statusCallback(GameState.CLEAR_ALL, this.state) 
         } else if ( this.state == GameState.PLAYER_LOST ) {
            this.state = GameState.GAME_OVER
            statusCallback(GameState.PLAYER_LOST, this.state) 
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
GameState.CLEAR_ALL = 7
GameState.PLAYER_LOST = 8
GameState.GAME_OVER = 9