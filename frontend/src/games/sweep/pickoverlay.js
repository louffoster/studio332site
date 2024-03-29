import * as PIXI from "pixi.js"
import Tile from "@/games/sweep/tile"
import Letter from "@/games/common/letter"

export default class PickOverlay extends PIXI.Container {
   constructor(pickHandler) {
      super()

      this.x = 5 
      this.y = 372
      this.panelW = 360
      this.panelH = 182
      this.picks = [] 
      this.pickHandler = pickHandler

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(6, 0xADE8F4, 1)
      this.graphics.beginFill(0x23E8A)
      this.graphics.drawRect(0,0, this.panelW, this.panelH)
      this.graphics.endFill()
      this.graphics.lineStyle(1, 0x03045E, 1)
      this.graphics.drawRect(0,0, this.panelW, this.panelH)
      this.addChild(this.graphics)

      let style = new PIXI.TextStyle({
         fill: "#CAF0F8",
         fontFamily: "Arial",
         fontSize: 18,
         lineHeight: 18,
         dropShadow: true,
         dropShadowColor: '#000000',
         dropShadowBlur: 2,
         dropShadowDistance: 1,
         align: "center"
      })

      let txt = new PIXI.Text(`Pick 3 helper letters`, style)
      txt.anchor.set(0.5, 0)
      txt.x = this.panelW/2
      txt.y = 10
      this.addChild( txt )

      let choices = [
         "L","N","R","S","T",
         "A","E","I","O","U"
      ]
      let x=30
      let y=40
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
      if ( this.picks.length == 3) {
         setTimeout( () => this.pickHandler( this.picks ), 700)
      }
   }

   enableLetters( enabled ) {
      this.letters.forEach( t => {
         if (enabled) {
            t.enable()
         } else {
            if (t.selected == false ) {
               t.disable()
            }
         }
      })
   }
}