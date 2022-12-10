import * as PIXI from "pixi.js"

export default class StartOverlay extends PIXI.Container {
   constructor() {
      super()
      this.interactive = true
      this.x = 5 
      this.y = 100

      this.graphics = new PIXI.Graphics()
      this.graphics.interactive = true 
      this.graphics.hitArea = new PIXI.Rectangle(0,0,290,150)
      this.graphics.lineStyle(3, 0x55dd55, 1)
      this.graphics.drawRoundedRect(0,0, 290,150, 5)
      this.addChild(this.graphics)

      let style = new PIXI.TextStyle({
         fill: "#cccccc",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 24,
      })
      let msg = new PIXI.Text("Initializing...", style)
      msg.anchor.set(0.5)
      msg.x = 145
      msg.y = 50
      msg.style.fill = 0x55dd55
      this.addChild(msg)
   }
}