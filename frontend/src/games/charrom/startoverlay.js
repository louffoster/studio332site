import * as PIXI from "pixi.js"
import Button from "@/games/common/button"

export default class StartOverlay extends PIXI.Container {
   constructor(gameW, gameH, startHandler) {
      super()

      this.startCallback = startHandler
      this.panelW = gameW*0.75
      this.panelH = gameH*0.4
      this.x = (gameW - this.panelW) / 2
      this.y = 150

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(10, 0x7A6C5D, 1)
      this.graphics.beginFill(0x4A5D65)
      this.graphics.drawRect(5,5, this.panelW-10,this.panelH-10)
      this.graphics.endFill()
      this.graphics.lineStyle(2, 0x333333, 1)
      this.graphics.drawRect(0,0, this.panelW, this.panelH)
      this.graphics.drawRect(10,10, this.panelW-20,this.panelH-20)      

      this.addChild(this.graphics)

      let style = new PIXI.TextStyle({
         fill: "#FCFAFA",
         fontFamily: "Arial",
         fontSize: 18,
         lineHeight: 20,
         wordWrap: true,
         wordWrapWidth: this.panelW - 50,
      })

      let msg = `Each turn, place your striker within one of the red shot circles. `
      msg += "Flick it into the letter pucks to sink them into the pockets. "
      msg += "Red pockets trash the letter, blue add it to your letter supply."
      let note1 = new PIXI.Text(msg, style)
      note1.anchor.set(0.5,0)
      note1.x = this.panelW/2
      note1.y = 25
      this.addChild(note1)

      msg = "Tap letters from your supply in any order to create and score words."
      let note2 = new PIXI.Text(msg, style)
      note2.anchor.set(0.5,0)
      note2.x = this.panelW/2
      note2.y = 120
      this.addChild(note2)

      msg = `The game is over when your letter rack exceeds 8 letters, time expires or you scratch 3 times.`
      let note3 = new PIXI.Text(msg, style)
      note3.anchor.set(0.5,0)
      note3.x = this.panelW/2
      note3.y = 180
      this.addChild(note3)

      this.msg = new PIXI.Text(`Initializing...`, style)
      this.msg.anchor.set(0.5, 0)
      this.msg.x = this.panelW/2
      this.msg.y = 240
      this.addChild(this.msg)

      this.addStartButton() 
   }

   addStartButton() {
      let startBtn = new Button( this.panelW/2, 255, "Start Game", () => {
         this.startCallback()
      }, 0xFCFAFA,0x34629c,0x5482bc)
      startBtn.noShadow()
      this.addChild(startBtn)
      this.removeChild(this.msg)
   }
}