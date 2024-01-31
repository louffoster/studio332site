import * as PIXI from "pixi.js"
import Button from "@/games/common/button"
import axios from 'axios'

export default class EndOverlay extends PIXI.Container {
   constructor(gameW, gameH, reason, replayHandler, backHandler) {
      super()

      // resons: scratch, overflow, expired

      this.panelW = gameW*0.75
      this.panelH = gameH*0.4
      this.x = (gameW - this.panelW) / 2
      this.y = 75

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
         lineHeight: 18,
         wordWrap: true,
         wordWrapWidth: this.panelW - 50,
      })

      let over = new PIXI.Text("Game Over",  {
         fill: "#FCFAFA",
         fontFamily: "Arial",
         fontSize: 26,
         lineHeight: 26
      })
      over.anchor.set(0.5,0)
      over.x = this.panelW/2
      over.y = 30
      this.addChild(over)

      let msg = "Tap letters from your supply in any order to create and score words."
      let note2 = new PIXI.Text(msg, style)
      note2.anchor.set(0.5,0)
      note2.x = this.panelW/2
      note2.y = 120
      this.addChild(note2)
   }  

   setResults(score, sunkCnt, wordCnt) {
      // TODO
   }
}