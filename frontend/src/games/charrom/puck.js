import PhysicsShape from "@/games/common/physicsshape"
import {Text} from "pixi.js"

export default class Puck extends PhysicsShape {
   letter = null 
   extra = null
   static DIAMETER = 50

   constructor( x,y, letter) {
      super( x,y, {type: "circle", radius: Puck.DIAMETER/2, lineColor: 0x222222, fillColor: 0x895737})

      this.body.label = "puck-"+letter.text
      this.setAirFriction(0.02)
      this.setRestitution( 1 )
      this.setMass(2.75)
      this.letter = letter
      
      if ( letter.isVowel()) {
         this.fillColor = 0xC08552
      } 

      let txt = new Text({text: letter.text, style: {
         fill: 0x333333,
         fontFamily: "Arial",
         fontSize: 18,     
      }})
      txt.anchor.set(0.5)
      txt.x = 0
      txt.y = 0
      this.addChild(txt)

      if (letter.text == "Q") {
         let uTxt = new Text({text: "U", style: {
            fill: 0x333333,
            fontFamily: "Arial",
            fontSize: 15,  
         }})
         uTxt.anchor.set(0.5)
         uTxt.x = 8
         uTxt.y = 4    
         txt.x-= 4
         this.addChild(uTxt)
      }
      this.draw()
   }

   removeFromTable() {
      this.body.isSensor = true
      this.gfx.alpha = 0
   }

   draw() {
      super.draw()
      this.gfx.circle(0,0,this.radius-6).fill(0xF3E9DC).stroke({width:1, color: this.lineColor})
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