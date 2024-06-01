import { Container, Text, Graphics } from "pixi.js"
import Button from "@/games/common/button"

export default class EndOverlay extends Container {
   constructor( restartCallback, backCallback ) {
      super()
      this.x = 25
      this.y = 90
      this.panelW = 300
      this.win = false

      this.graphics = new Graphics()
      this.addChild(this.graphics)

      // failure message
      this.lossMessage = new Text({text: "System Failure", style: {
         fill: "#ff5555",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 28
      }})
      this.lossMessage.anchor.set(0.5)
      this.lossMessage.x = this.panelW / 2.0
      this.lossMessage.y = 50

      // success message
      this.winMessage = new Text({text: "Virus Removed", style: {
         fill: "#55dd55",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 28
      }})
      this.winMessage.anchor.set(0.5)
      this.winMessage.x = this.panelW / 2.0
      this.winMessage.y = 50
      
      const smallStyle = {
         fill: "#55dd55",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 16,     
      }

      let restartButton = new Button( this.panelW/2, 260, "Play Again", 
         restartCallback, 0x55dd55,0x114a11,0x55dd55)
      this.addChild(restartButton)

      this.score = new Text({text: "Score: 00000", style: smallStyle})
      this.score.anchor.set(0.5)
      this.score.x = this.panelW/2
      this.score.y = 90
      this.addChild(this.score)

      this.uptime = new Text({text: "Uptime: 00:00", style: smallStyle})
      this.uptime.anchor.set(0.5)
      this.uptime.x = this.panelW/2
      this.uptime.y = 110
      this.addChild(this.uptime)

      this.wordStats = []
      let xPos = [10,150,10,150,10,150,85]
      let yPos = [130,130,152,152,174,174,196]
      for ( let i=0; i<7; i++) { 
         let wl = 4+i
         let stats = new Text({text: `${wl} Letters: 0`, style: smallStyle})
         stats.x = xPos[i]+5
         stats.y = yPos[i]
         this.addChild(stats)
         this.wordStats.push(stats)
      }

      let backTxt = new Text({text: "Back to Studio332 Site", style: {
         fill: "#55dd55",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 18,
      }})
      backTxt.anchor.set(0.5)
      backTxt.x = this.panelW/2
      backTxt.y = 300
      backTxt.eventMode = 'static'
      backTxt.cursor ="pointer"
      this.addChild(backTxt)
      backTxt.on('click', backCallback)
   }

   setWin( flag ) {
      this.win = flag
      if ( this.win ) {
         this.addChild( this.winMessage)
      } else {
         this.addChild( this.lossMessage)
      }
      this.drawPopup()
   }

   drawPopup() {
      // draw the border and background
      this.graphics.rect(0,0, this.panelW,320).fill(0x333333).stroke({width:2, color: 0x55dd55})

      // draw lines around message
      let color = 0xff5555
      if ( this.win  ) {
         color = 0x55dd55
      }
      this.graphics.moveTo(10, 25).lineTo(this.panelW-10, 25).stroke({width:1, color: color})
      this.graphics.moveTo(10,75).lineTo(this.panelW-10, 75).stroke({width:1, color: color})
   }
 
   updateStats(gameTime, score, stats) {
      let scoreStr = `${score}`.padStart(5,"0")
      this.score.text = "Score: "+ scoreStr

      let secs = gameTime
      let mins = Math.floor(gameTime / 60)
      if ( mins > 0) {
         secs = gameTime - mins*60
      }
      let timeStr = `Uptime: ${mins}`.padStart(2,"0")+":"+`${secs}`.padStart(2,"0")
      this.uptime.text = timeStr

      for ( let i=3; i<=9; i++) { 
         let wl = `${i+1}`
         this.wordStats[i-3].text = `${wl} Letters: ${stats[i]}`
      }
   }
}