import * as PIXI from "pixi.js"
import Button from "@/games/common/button"
import Letter from "@/games/sweep/letter"

export default class PickOverlay extends PIXI.Container {
   constructor(pickHandler) {
      super()

      this.x = 25 
      this.y = 70
      this.panelW = 320
      this.panelH = 270
      this.pickedConsonant = ""
      this.pickedVowel = ""

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
         wordWrap: true,
         fontWeight: 'bold',
         wordWrapWidth: this.panelW - 20,
         dropShadow: true,
         dropShadowColor: '#000000',
         dropShadowBlur: 2,
         dropShadowDistance: 1,
         align: "center"
      })

      let txt = new PIXI.Text(`Pick one consonant and one vowel to use as one time helper letters`, style)
      txt.anchor.set(0.5,0.5)
      txt.x = this.panelW/2
      txt.y = 35
      this.addChild( txt )

      let choices = [
         "L","N","R","S","T",
         "A","E","I","O","U"
      ]
      let x=10
      let y=70
      this.consonants = []
      this.vowels = [] 
      choices.forEach( (helpLtr,idx) => {
         let l = new Letter(helpLtr, x,y, this.letterClicked.bind(this))
         this.addChild(l)
         x += Letter.WIDTH
         if (idx == 4) {
            y += Letter.HEIGHT
            x = 10
         }
         if ( idx <= 4) {
            this.consonants.push(l)
         } else {
            this.vowels.push(l)
         }
      })

      this.startBtn = new Button( 160, 225, "Start", () => {
         pickHandler(this.pickedConsonant, this.pickedVowel)
      }, 0xCAF0F8,0x0077B6,0x48CAE4)
      this.startBtn.disable()
      this.addChild(this.startBtn)
   }

   letterClicked( letter ) {
      let vowelIdx = this.vowels.findIndex( v => v.letter.text == letter) 
      if ( vowelIdx > -1) {
         this.pickedVowel = letter
         this.vowels.forEach( v => {
            if (v.letter.text != letter ) {
               v.deselect()
            }
         })
      } else {
         this.pickedConsonant = letter
         this.consonants.forEach( v => {
            if (v.letter.text != letter ) {
               v.deselect()
            }
         })
      }

      if ( this.pickedVowel != "" && this.pickedConsonant != "") {
         this.startBtn.enable()
      }
   }
}