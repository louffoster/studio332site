import { Container, Graphics, Text} from "pixi.js"
import Button from "@/games/common/button"

export default class StartOverlay extends Container {
   constructor(gameW, gameH, startHandler) {
      super()

      const panelW = gameW*0.75
      const panelH = gameH*0.4
      this.x = (gameW - panelW) / 2
      this.y = 150

      const graphics = new Graphics()
      graphics.rect(5,5, panelW-10,panelH-10).fill(0x4A5D65).stroke({width:10, color: 0x7A6C5D})
      graphics.rect(0,0, panelW, panelH).stroke({width:2, color: 0x333333})
      graphics.rect(10,10, panelW-20,panelH-20).stroke({width:2, color: 0x333333})      

      this.addChild(graphics)

      let style = {
         fill: "#FCFAFA",
         fontFamily: "Arial",
         fontSize: 18,
         wordWrap: true,
         wordWrapWidth: panelW - 50,
      }

      let msg = `Each turn, place your striker within one of the light coloerd shot circles. `
      msg += "Shoot it into the letter pucks to sink them into the pockets, adding them to your letter supply. "
      const note1 = new Text({text: msg, style: style})
      note1.anchor.set(0.5,0)
      note1.x = panelW/2
      note1.y = 25
      this.addChild(note1)

      msg = "Tap letters from your supply in any order to create and score words."
      const note2 = new Text({text: msg, style: style})
      note2.anchor.set(0.5,0)
      note2.x = panelW/2
      note2.y = 120
      this.addChild(note2)

      msg = `The game is over when your letter rack exceeds 10 letters, time expires or you scratch 3 times.`
      const note3 = new Text({text: msg, style: style})
      note3.anchor.set(0.5,0)
      note3.x = panelW/2
      note3.y = 180
      this.addChild(note3)

      let startBtn = new Button( panelW/2, 255, "Start Game", startHandler, 0xFCFAFA,0x34629c,0x5482bc)
      this.addChild(startBtn)
   }
}