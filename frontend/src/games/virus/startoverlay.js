import * as PIXI from "pixi.js"
import Button from "@/games/common/button"

export default class StartOverlay extends PIXI.Container {
   constructor(callback) {
      super()

      this.x = 10 
      this.y = 100
      this.panelW = 330

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(2, 0x55dd55, 1)
      this.graphics.beginFill(0x333333)
      this.graphics.drawRect(0,0, this.panelW,150)

      let style = new PIXI.TextStyle({
         fill: "#55dd55",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 20,
         lineHeight: 20
      })
      this.msg = new PIXI.Text("Click start to begin", style)
      this.msg.anchor.set(0.5)
      this.msg.x = this.panelW / 2.0
      this.msg.y = 40

      this.addChild(this.graphics)
      this.addChild(this.msg)

      let startBtn = new Button( this.panelW/2, 100, "Start", callback,
         0x55dd55,0x114a11,0x55dd55)
      this.addChild(startBtn)
   }
}