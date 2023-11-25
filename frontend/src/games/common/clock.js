import * as PIXI from "pixi.js"

export default class Clock extends PIXI.Container {
   constructor( x,y, label="",color=0x80D3E1, fontFamily="Arial") {
      super()
      this.x = x
      this.y = y

      this.clockColor = new PIXI.Color(color)
      let style = {
         fill: this.clockColor,
         fontFamily: fontFamily,
         fontSize: 18,
      }

      let labelWidth = 0
      let timerY = 0
      if ( label != "") {
         let twoLines = false 
         if (label.includes("\n")) {
            twoLines = true 
            label = label.replace("\n", "")
         } else {
            label = label.replace("\n", ":")
         }
      
         let timeLabel = new PIXI.Text(label, style)
         timeLabel.x = 0
         timeLabel.y = 0
         this.addChild(timeLabel)
         if ( twoLines ) {
            labelWidth = timeLabel.width / 2.0
            timerY = timeLabel.height + 5
         } else {
            labelWidth = timeLabel.width + 5
            timerY = 0
         }
      }
      this.timerDisplay = new PIXI.Text("00:00", style)
      this.timerDisplay.x = labelWidth
      this.timerDisplay.y = timerY
      if ( timerY != 0) {
         this.timerDisplay.anchor.set(0.5, 0)
      } 
      this.addChild(this.timerDisplay)

      this.pivot.x = this.width / 2;
      this.pivot.y = this.height / 2;

      this.timeMS = 0.0
      this.countdown = false
      this.flash = false
   }

   setCountdownMode( startTimeMS, timeoutListener, warningListener) {
      this.countdown = true 
      this.timeMS = startTimeMS 
      this.timeoutListener = timeoutListener
      this.warningListener = warningListener
      let timeSec = this.timeSec
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
      this.warningListener( this.flash )
   }

   get timeSec() {
      let timeSec = Math.round(this.timeMS / 1000.0)
      timeSec = Math.max(timeSec, 0)     
      return timeSec
   }

   gameTimeFormatted() {
      let timeSec = this.timeSec
      let secs = timeSec
      let mins = Math.floor(timeSec / 60)
      if ( mins > 0) {
         secs = timeSec - mins*60
      }
      
      let timeStr = `${mins}`.padStart(2,"0")+":"+`${secs}`.padStart(2,"0")
      return timeStr
   }

   tick(deltaMS) {
      let origTimeSec = this.timeSec

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

      if ( this.timeSec != origTimeSec) {
         if (this.timeSec < 15 && this.countdown) { 
            this.flashTimer()
         }
         
         this.timerDisplay.text = this.gameTimeFormatted()
      }
   }
}