import { Container, Text} from "pixi.js"
import Button from "@/games/common/button"

export default class EndOverlay extends Container {
   constructor(panelW, panelH, replayHandler, backHandler) {
      super()

      this.x = 0
      this.y = 130
      
      let style = {
         fill: "#e0e0e0",
         fontFamily: "Arial",
         fontSize: 32,
      }

      const note1 = new Text({text: "Game Over", style: style})
      note1.anchor.set(0.5,0)
      note1.x = panelW/2
      note1.y = 60
      this.addChild(note1)

      let againBtn = new Button( panelW / 2, 170, "Play Again", replayHandler,0xFCFAFA,0x34629c,0x5482bc)
      this.addChild(againBtn)
      let backBtn = new Button( panelW / 2, 220, "Back to Studio332 Site", backHandler,0xFCFAFA,0x34629c,0x5482bc)
      this.addChild(backBtn)
   }
}