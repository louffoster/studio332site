import { Container, Graphics, Text } from "pixi.js"
import Button from "@/games/common/button"

export default class StartOverlay extends Container {
   constructor(startHandler) {
      super()

      this.x = 5 
      this.y = 5
      const panelW = 370
      const panelH = 300

      const graphics = new Graphics()
      graphics.rect(5,5, panelW-10, panelH-10). 
         stroke({width: 10, color: 0xcCcAcA}).fill(0x4E6367)
      graphics.rect(0,0, panelW, panelH).stroke({width:2, color:0xA4B8C4 })
      this.addChild(graphics)

      let style = {
         fill: "#FCFAFA",
         fontFamily: "Arial",
         fontSize: 18,
         wordWrap: true,
         wordWrapWidth: panelW - 40,
      }

      let msg = `Drop tiles into columns of the board and use them to create words. `
      msg += "If you take too long to pick a tile, the whole row will be dropped automatically."
      const note1 = new Text({text: msg, style: style})
      note1.anchor.set(0.5,0)
      note1.x = panelW/2
      note1.y = 15
      this.addChild(note1)

      msg = "Words are created by selecting strings of adjacent tiles. "
      msg += "Valid words are 4-10 letters long and remove those tiles from the board."
      let note2 = new Text({text: msg, style: style})
      note2.anchor.set(0.5,0)
      note2.x = panelW/2
      note2.y = 100
      this.addChild(note2)

      msg = `The game is over when a tile is dropped on a column that is full.`
      let note3 = new Text({text: msg, style: style})
      note3.anchor.set(0.5,0)
      note3.x = panelW/2
      note3.y = 180
      this.addChild(note3)

      let startBtn = new Button( panelW/2, 255, "Start Game", startHandler, 0xFCFAFA,0x34629c,0x5482bc)
      this.addChild(startBtn)
      this.removeChild(this.msg)
   }
}