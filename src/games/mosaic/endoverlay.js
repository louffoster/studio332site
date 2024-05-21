import { Container, Text, Graphics } from "pixi.js"
import Button from "@/games/common/button"


export default class EndOverlay extends Container {
   constructor(replayHandler, backHandler) {
      super()

      this.x = 10 
      this.y = 100
      const popupW = 340
      const popupH = 200

      const graphics = new Graphics()
      graphics.rect(5,5, popupW-10, popupH-10).stroke({width:10,color:0x80D3E1}).fill(0x34565c)
      graphics.rect(0,0, popupW, popupH).stroke({width: 2, color: 0x000000})
      this.addChild( graphics )

      let style = {
         fill: "#f0f0ff",
         fontFamily: "Arial",
         fontSize: 20,
         wordWrap: true,
         fontWeight: 'bold',
         wordWrapWidth: popupW-40,
         align: "center"
      }


      const heading = new Text({text: `GAME OVER`, style: style})
      heading.anchor.set(0.5, 0.5)
      heading.x = popupW / 2
      heading.y = 50
      this.addChild( heading )
      
      let againBtn = new Button( popupW / 2, 105, "Play Again", replayHandler)
      this.addChild(againBtn)
      let backBtn = new Button( popupW / 2, 160, "Back to Studio332 Site", backHandler)
      this.addChild(backBtn)
   }
}