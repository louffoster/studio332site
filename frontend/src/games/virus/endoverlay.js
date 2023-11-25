import * as PIXI from "pixi.js"
import Button from "@/games/common/button"

export default class EndOverlay extends PIXI.Container {
   constructor( restartCallback, backCallback ) {
      super()
      this.x = 25
      this.y = 90
      this.panelW = 300

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(2, 0x55dd55, 1)
      this.graphics.beginFill(0x333333)
      this.graphics.drawRect(0,0, this.panelW,280)
      this.graphics.cursor ="default"
      this.addChild(this.graphics)

      let style = new PIXI.TextStyle({
         fill: "#55dd55",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 18,
      })
      let msg = new PIXI.Text("System Failure", {
         fill: "#ff5555",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 28
      })
      msg.anchor.set(0.5)
      msg.x = this.panelW / 2.0
      msg.y = 50
      this.addChild(msg)
      this.graphics.lineStyle(1, 0xff5555, 1)
      this.graphics.moveTo(10, 25)
      this.graphics.lineTo(this.panelW-10, 25)
      this.graphics.moveTo(10,75)
      this.graphics.lineTo(this.panelW-10, 75)

      let restartButton = new Button( this.panelW/2, 210, "Retry", 
         restartCallback, 0x55dd55,0x114a11,0x55dd55)
      restartButton.noShadow()
      this.addChild(restartButton)

      this.uptime = new PIXI.Text("Uptime: 00:00", style)
      this.uptime.anchor.set(0.5)
      this.uptime.x = this.panelW/2
      this.uptime.y = 100
      this.addChild(this.uptime)

      let small = new PIXI.TextStyle({
         fill: "#55dd55",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 16,
      })

      this.wordStats = []
      let xPos = [10,150,10,150]
      let yPos = [130,130,152,152]
      for ( let i=0; i<4; i++) { 
         let wl = 3+i
         let stats = new PIXI.Text(`${wl} Letters: 0`, small)
         stats.x = xPos[i]+5
         stats.y = yPos[i]
         this.addChild(stats)
         this.wordStats.push(stats)
      }

      let backTxt = new PIXI.Text("Back to Studio332 Site", style)
      backTxt.anchor.set(0.5)
      backTxt.x = this.panelW/2
      backTxt.y = 260
      backTxt.eventMode = 'static'
      backTxt.cursor ="pointer"
      this.addChild(backTxt)
      backTxt.on('click', backCallback)
   }

   updateStats(gameTime, stats) {
      let secs = gameTime
      let mins = Math.floor(gameTime / 60)
      if ( mins > 0) {
         secs = gameTime - mins*60
      }
      let timeStr = `Uptime: ${mins}`.padStart(2,"0")+":"+`${secs}`.padStart(2,"0")
      this.uptime.text = timeStr

      for ( let i=0; i<4; i++) { 
         let wl = `${i+3}`
         if (i==3) {
            wl+= "+"
         } else {
            wl += " "
         }
         this.wordStats[i].text = `${wl} Letters: ${stats[i]}`
      }
   }

}