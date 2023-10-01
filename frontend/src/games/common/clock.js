import * as PIXI from "pixi.js"

export default class Clock extends PIXI.Container {
   constructor( x,y, label="",color=0x80D3E1) {
      super()
      this.x = x
      this.y = y

      this.clockColor = new PIXI.Color(color)
      let style = {
         fill: this.clockColor,
         fontFamily: "Arial",
         fontSize: 18,
      }

      let labelWidth = 0
      if ( label != "") {
         let timeLabel = new PIXI.Text(label+":", style)
         timeLabel.x = 0
         timeLabel.y = 0
         this.addChild(timeLabel)
         labelWidth = timeLabel.width + 5
      }
      this.timerDisplay = new PIXI.Text("00:00", style)
      this.timerDisplay.x = labelWidth
      this.timerDisplay.y = 0
      this.addChild(this.timerDisplay)

      this.pivot.x = this.width / 2;
      this.pivot.y = this.height / 2;

      this.timeMS = 0.0
      this.countdown = false
      this.flash = false
   }

   setCountdownMode( startTimeMS, timeoutListener) {
      this.countdownn = true 
      this.timeMS = startTimeMS 
      this.timeoutListener = timeoutListener
      let timeSec = this.gameTimeSec()
      let secs = timeSec
      let mins = Math.floor(timeSec / 60)
      if ( mins > 0) {
         secs = timeSec - mins*60
      }
      let timeStr = `${mins}`.padStart(2,"0")+":"+`${secs}`.padStart(2,"0")
      this.timerDisplay.text = timeStr  
   }

   flashTimer() {
      this.flash = !this.flash
      if ( this.flash ) {
         this.timerDisplay.style.fill = 0xff6666
      } else {
         this.timerDisplay.style.fill = this.clockColor
      }
   }

   gameTimeSec() {
      let timeSec = Math.round(this.timeMS / 1000.0)
      timeSec = Math.max(timeSec, 0)     
      return timeSec
   }

   tick(deltaMS) {
      let origTimeSec = this.gameTimeSec()

      if ( this.countdown ) {
         if ( this.timeMS > 0) {
            this.timeMS -= deltaMS
            if ( this.timeMS <= 0 ) {
               this.timeMS = 0 
               this.timeoutListener()
            }
         }
      } else {
         this.timeMS += deltaMS
      } 

      let timeSec = this.gameTimeSec()
      if ( timeSec != origTimeSec) {
         let secs = timeSec
         let mins = Math.floor(timeSec / 60)
         if ( mins > 0) {
            secs = timeSec - mins*60
         }
   
         if (timeSec < 15 && this.countdown) { 
            this.flashTimer()
         }
         
         let timeStr = `${mins}`.padStart(2,"0")+":"+`${secs}`.padStart(2,"0")
         this.timerDisplay.text = timeStr
      }
   }
}