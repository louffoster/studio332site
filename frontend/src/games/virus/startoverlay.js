import {Container, Graphics, Text} from "pixi.js"
import Button from "@/games/common/button"

export default class StartOverlay extends Container {
   constructor(callback) {
      super()

      this.x = 10 
      this.y = 100
      const panelW = 330
      const panelH = 150

      let graphics = new Graphics()
      graphics.rect(0,0, panelW, panelH).stroke({width:2, color: 0x55dd55}).fill(0x333333)

      let msg = new Text({text: "Click start to begin", style: {
         fill: "#55dd55",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 20,
      }})
      msg.anchor.set(0.5)
      msg.x = panelW / 2.0
      msg.y = 40

      this.addChild(graphics)
      this.addChild(msg)

      let startBtn = new Button( panelW/2, 100, "Start", callback,
         0x55dd55,0x114a11,0x55dd55)
      this.addChild(startBtn)
   }
}