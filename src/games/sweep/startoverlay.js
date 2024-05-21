import {Container, Graphics, Text} from "pixi.js"
import Button from "@/games/common/button"

export default class StartOverlay extends Container {
   constructor(startHandler) {
      super()

      this.x = 5 
      this.y = 372
      let panelW = 360
      let panelH = 182

      let graphics = new Graphics()
      graphics.rect(0,0, panelW, panelH).
         stroke({width:6, color:0xADE8F4}).fill(0x23E8A)
      graphics.rect(0,0, panelW, panelH).stroke({width:1, color: 0x03045E})

      let style = {
         fill: "#CAF0F8",
         fontFamily: "Arial",
         fontSize: 18,
         wordWrap: true,
         wordWrapWidth: panelW - 40,
      }

      let msg = "Clear the board by creating words with 4 to 10 letters. "
      msg += "You will get to choose 3 letters to help with this goal."
      let txt = new Text({text: msg, style: style})
      txt.anchor.set(0.5, 0)
      txt.x = panelW/2
      txt.y = 15

      this.addChild(graphics)
      this.addChild(txt)

      let advButton = new Button( panelW/2, 130, 
         "Pick Helper Letters", startHandler, 0xFFFFFF,0x0077B6,0x48CAE4)
      this.addChild(advButton)
   }
}