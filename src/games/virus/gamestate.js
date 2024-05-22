export default class GameState {
   static INIT=0
   static PLAY=1
   static SUBMIT_REQUESTED=2
   static SUBMIT = 3
   static FAIL = 4
   static SUCCESS = 5
   static REMOVE = 6
   static CLEAR_ALL = 7
   static PLAYER_LOST = 8
   static GAME_OVER = 9

   constructor() {
      this.state = GameState.INIT
      this.stateDuration = -1.0
   }

   initialized() {
      this.state = GameState.PLAY
   }

   requestSubmit() {
      this.state = GameState.SUBMIT_REQUESTED
      this.stateDuration = 0.1
   }
   submitFailed() {
      this.state = GameState.FAIL
      this.stateDuration = 1.0
   }
   submitSuccess() {
      this.state = GameState.SUCCESS
      this.stateDuration = 1
   }
   clearVirus() {
      this.state = GameState.CLEAR_ALL
      this.stateDuration = 1
   }
   gameLost() {
      this.state = GameState.PLAYER_LOST
      this.stateDuration = 1
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
         this.state == GameState.SUBMIT_REQUESTED //|| this.state == GameState.FAIL
      ) 
   }
   isGameOver() {
      return this.state == GameState.GAME_OVER
   }

   update(deltaMS, statusCallback) {
      if (this.stateDuration <= 0 ) {
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
            this.state = GameState.PLAY
            statusCallback(GameState.SUCCESS, this.state)
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