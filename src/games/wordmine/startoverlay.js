import { Container, Graphics, Text} from "pixi.js"
import Button from "@/games/common/button"

export default class StartOverlay extends Container {
   constructor(panelW, panelH, startHandler) {
      super()

      this.x = 0
      this.y = 125
      this.panelW = panelW 
      this.panelH = panelH

      this.graphics = new Graphics()
      this.addChild(this.graphics)

      let style = {
         fill: "#e0e0e0",
         fontFamily: "Arial",
         fontSize: 17,
         wordWrap: true,
         wordWrapWidth: panelW - 25,
      }

      let msg = `Manipulate the rocks to form seams of adjacent letters. `
      msg += "Select these letters to make words of 4 letters or more, and mine them for cash. "
      msg += "There are also red markers present. Bombs and invalid words destroy them, releasing extra rocks."
      msg += " Once all markers have beeen "
      msg += "destroyed, the game ends. The game also ends when all remaining markers reach the "
      msg += "bottom of the mine."

      const note1 = new Text({text: msg, style: style})
      note1.anchor.set(0.5,0)
      note1.x = panelW/2
      note1.y = 10
      this.addChild(note1)

      const bombHelp = new Text({text: "Destroy unwanted rocks / markers", style: style})
      bombHelp.x = 20
      bombHelp.y = 230
      this.addChild(bombHelp)

      const pushHelp = new Text({text: "Throw rocks into new positions", style: style})
      pushHelp.x = 20
      pushHelp.y = 300
      this.addChild(pushHelp)

      const pinHelp = new Text({text: "Pin / unpin rocks into place", style: style})
      pinHelp.x = 20
      pinHelp.y = 370
      this.addChild(pinHelp)

      let startBtn = new Button( panelW/2, 480, "Start Game", startHandler, 0xFCFAFA,0x34629c,0x5482bc)
      this.addChild(startBtn)

      this.draw()
   }

   draw() {
      this.graphics.clear() 
      this.graphics.rect(0,0,this.panelW, this.panelH).fill(0x333D29)

      this.graphics.moveTo(this.panelW/2+25, 260). 
         lineTo(this.panelW-10, 260).stroke({width:2, color: 0xe0e0e0})
      this.graphics.circle(this.panelW-15, 260, 10).fill(0xe0e0e0)

      this.graphics.moveTo(this.panelW/2+25, 330). 
         lineTo(this.panelW-10, 330).stroke({width:2, color: 0xe0e0e0})
      this.graphics.circle(this.panelW-15, 330, 10).fill(0xe0e0e0)

      this.graphics.moveTo(this.panelW/2+25, 400). 
         lineTo(this.panelW-10, 400).stroke({width:2, color: 0xe0e0e0})
      this.graphics.circle(this.panelW-15, 400, 10).fill(0xe0e0e0)
   }
}