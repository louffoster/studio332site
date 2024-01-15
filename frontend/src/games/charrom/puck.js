import PhysicsShape from "@/games/common/physicsshape"
import * as PIXI from "pixi.js"

export default class Puck extends PhysicsShape {
   letter = null 
   extra = null
   static WIDTH = 50

   constructor( x,y, letter) {
      super( x,y, {type: "circle", radius: Puck.WIDTH/2})

      this.setAirFriction(0.02)
      this.setRestitution( 1 )
      this.setMass(2.75)
      this.letter = letter
      
      let letterColor = "#333333"
      this.lineColor = new PIXI.Color( 0x600000 )
      if ( letter.isVowel()) {
         this.fillColor = new PIXI.Color( 0xC08552 )
      } else  {
         this.fillColor = new PIXI.Color( 0x895737 )
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

      let txt = new PIXI.Text(letter.text, style)
      txt.anchor.set(0.5)
      txt.x = 0
      txt.y = 0
      this.addChild(txt)
      if (letter.text == "Q") {
         let uTxt = new PIXI.Text("U", smallStyle)
         uTxt.anchor.set(0.5)
         uTxt.x = 8
         uTxt.y = 4    
         this.letter.x-= 4
         this.addChild(uTxt)
      }
      this.draw()
   }

   draw() {
      super.draw() 
      this.gfx.lineStyle(1, this.lineColor, 1)
      this.gfx.beginFill(0xF3E9DC)
      this.gfx.drawCircle(0,0,this.radius-6)
      this.gfx.endFill()
   }

   get text() {
      let out = this.letter.text 
      if ( out == "Q") {
         out += "U"
      }
      return out
   }

   get value() {
      return this.letter.value
   }
}