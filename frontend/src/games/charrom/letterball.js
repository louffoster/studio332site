import PhysicsShape from "@/games/common/physicsshape"
import * as PIXI from "pixi.js"
// import Matter from 'matter-js'

export default class LetterBall extends PhysicsShape {
   letter = null 
   extra = null

   constructor( x,y, letter) {
      super( x,y, {type: "circle", radius: 25})

      this.setAirFriction(0.02)
      this.setRestitution( 1 )
      this.setMass(2.75)
      
      let letterColor = "#333333"
      this.lineColor = new PIXI.Color( 0x600000 )
      if ( this.isVowel(letter)) {
         this.fillColor = new PIXI.Color( 0xBCAC9B )
         // letterColor = "#333333"
      } else  {
         this.fillColor = new PIXI.Color( 0xC17C74 )
      }

      let style = new PIXI.TextStyle({
         fill: letterColor,
         fontFamily: "Arial",
         fontSize: 18,
      })
      let smallStyle = new PIXI.TextStyle({
         fill: letterColor,
         fontFamily: "Arial",
         fontSize: 15,
      })

      this.letter = new PIXI.Text(letter, style)
      this.letter.anchor.set(0.5)
      this.letter.x = 0
      this.letter.y = 0
      this.addChild(this.letter)
      if (letter == "Q") {
         this.extra = new PIXI.Text("U", smallStyle)
         this.extra.anchor.set(0.5)
         this.extra.x = 8
         this.extra.y = 4    
         this.letter.x-= 4
         this.addChild(this.extra)
      }
      this.draw()
   }

   draw() {
      super.draw() 
      this.gfx.lineStyle(1, this.lineColor, 1)
      this.gfx.beginFill(0xcfcfcf)
      this.gfx.drawCircle(0,0,this.radius-6)
      this.gfx.endFill()
   }

   isVowel( letter ) {
      let vowel = ["A","E","I","O","U","Y"]
      return ( vowel.includes( letter ) )
   }

   get text() {
      let out = this.letter.text 
      if ( this.extra) {
         out += this.extra.text
      }
      return out
   }
}