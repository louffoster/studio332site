import * as PIXI from "pixi.js"

export default class EndOverlay extends PIXI.Container {
   constructor( restartCallback, backCallback ) {
      super()
      this.x = 10
      this.y = 100

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(2, 0x55dd55, 1)
      this.graphics.beginFill(0x333333)
      this.graphics.drawRect(0,0, 280,280)
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
      msg.x = 145
      msg.y = 50
      this.addChild(msg)
      this.graphics.lineStyle(1, 0xff5555, 1)
      this.graphics.moveTo(10, 25)
      this.graphics.lineTo(270, 25)
      this.graphics.moveTo(10,75)
      this.graphics.lineTo(270, 75)

      this.graphics.lineStyle(1, 0x55dd55, 1)
      this.graphics.beginFill(0x114a11)
      this.graphics.drawRect(95,195, 100,35)

      let btnTxt = new PIXI.Text("Retry", style)
      btnTxt.anchor.set(0.5)
      btnTxt.x = 145
      btnTxt.y = 212
      btnTxt.eventMode = 'static'
      btnTxt.cursor ="pointer"
      btnTxt.hitArea = new PIXI.Rectangle(-50,-20, 100,35)
      this.addChild(btnTxt)
      btnTxt.on('pointerup', restartCallback)

      this.uptime = new PIXI.Text("Uptime: 00:00", style)
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

      let backTxt = new PIXI.Text("Back to Studio332 Site", style)
      backTxt.anchor.set(0.5)
      backTxt.x = 145
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
         this.wordStats[i].text = `${i+3} Letters: ${stats[i]}`
      }
   }

}