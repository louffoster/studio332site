import {Container, Graphics, Text} from "pixi.js"
import Tile from "@/games/sweep/tile"
import Button from "@/games/common/button"
import Letter from "@/games/common/letter"

export default class PickOverlay extends Container {
   picks = []
   okButton = null

   constructor(pickHandler) {
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
      }
      let txt = new Text({text: "Pick 3 helper letters", style: style})
      txt.anchor.set(0.5)
      txt.x = panelW/2
      txt.y = panelH-28
      this.okButton = new Button( panelW/2, panelH-50, 
         "OK", () => pickHandler(this.picks), 0xFFFFFF,0x0077B6,0x48CAE4)
      this.okButton.small()
      this.okButton.alignTopLeft()
      this.okButton.x = panelW - this.okButton.btnWidth - 10
      this.okButton.y = panelH - this.okButton.btnHeight - 10
      this.okButton.disable()

      this.addChild(graphics)
      this.addChild(txt)
      this.addChild(this.okButton)

      let choices = [
         "L","N","R","S","T",
         "A","E","I","O","U"
      ]
      let x=30
      let y=5
      this.letters = []
      choices.forEach( (helpLtr,idx) => {
         let letter = new Letter(helpLtr, 1)
         let t = new Tile(letter, x,y, this.letterClicked.bind(this))
         t.setToggle()
         this.addChild(t)
         x += Tile.WIDTH
         if (idx == 4) {
            y += Tile.HEIGHT
            x = 30
         }
         this.letters.push(t) 
      })
   }

   letterClicked( letter ) {
      let idx = this.picks.findIndex( p => p == letter )
      if ( idx > -1 ) {
         this.picks.splice(idx,1)
      } else {
         if ( this.picks.length < 3) {
            this.picks.push( letter )
         }
      }
      this.okButton.setEnabled( this.picks.length == 3) 
   }
}