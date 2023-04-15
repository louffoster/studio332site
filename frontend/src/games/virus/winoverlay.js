import * as PIXI from "pixi.js"

export default class WinOverlay extends PIXI.Container {
   constructor( restartCallback ) {
      super()
      this.x = 10
      this.y = 100

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(2, 0x55dd55, 1)
      this.graphics.beginFill(0x333333)
      this.graphics.drawRect(0,0, 280,250)
      this.addChild(this.graphics)

      let style = new PIXI.TextStyle({
         fill: "#55dd55",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 18,
      })
      let msg = new PIXI.Text("Virus Removed", {
         fill: "#55dd55",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 28
      })
      msg.anchor.set(0.5)
      msg.x = 145
      msg.y = 50
      this.addChild(msg)
      this.graphics.lineStyle(1, 0x55dd55, 1)
      this.graphics.moveTo(10, 25)
      this.graphics.lineTo(270, 25)
      this.graphics.moveTo(10,75)
      this.graphics.lineTo(270, 75)

      this.graphics.eventMode = 'static' 
      this.graphics.hitArea = new PIXI.Rectangle(75,195, 140,35)
      this.graphics.cursor ="pointer"
      this.graphics.lineStyle(1, 0x55dd55, 1)
      this.graphics.beginFill(0x114a11)
      this.graphics.drawRect(75,195, 140,35)
      let btnTxt = new PIXI.Text("Play Again", style)
      btnTxt.anchor.set(0.5)
      btnTxt.x = 145
      btnTxt.y = 212
      btnTxt.eventMode = 'static' 
      btnTxt.cursor ="pointer"
      this.addChild(btnTxt)
      this.graphics.on('pointerup', restartCallback) 
      btnTxt.on('pointerup', restartCallback)

      this.uptime = new PIXI.Text("Recovery Time: 00:00", style)
      this.uptime.anchor.set(0.5)
      this.uptime.x = 140
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
         stats.x = xPos[i]
         stats.y = yPos[i]
         this.addChild(stats)
         this.wordStats.push(stats)
      }

   }

   updateStats(gameTime, stats) {
      let secs = gameTime
      let mins = Math.floor(gameTime / 60)
      if ( mins > 0) {
         secs = gameTime - mins*60
      }
      let timeStr = `Recovery Time: ${mins}`.padStart(2,"0")+":"+`${secs}`.padStart(2,"0")
      this.uptime.text = timeStr

      for ( let i=0; i<4; i++) { 
         this.wordStats[i].text = `${i+3} Letters: ${stats[i]}`
      }
   }

}