import PhysicsShape from "@/games/common/physicsshape"
import * as PIXI from "pixi.js"
// import Matter from 'matter-js'

export default class LetterBall extends PhysicsShape {
   letter = null 
   extra = null

   constructor( x,y, letter) {
      super( x,y, {type: "circle", radius: 20})

      this.setAirFriction(0.02)
      this.setRestitution( 1 )
      this.setMass(4.75)
      
      this.lineColor = new PIXI.Color( 0x600000 )
      this.fillColor = new PIXI.Color( 0xd00000 )

      let style = new PIXI.TextStyle({
         fill: "#FFFFFF",
         fontFamily: "Arial",
         fontSize: 16,
      })
      let smallStyle = new PIXI.TextStyle({
         fill: "#FFFFFF",
         fontFamily: "Arial",
         fontSize: 12,
      })

      this.letter = new PIXI.Text(letter, style)
      this.letter.anchor.set(0.5)
      this.letter.x = 0
      this.letter.y = 0
      this.addChild(this.letter)
      if (letter == "Q") {
         this.extra = new PIXI.Text("U", smallStyle)
         this.extra.anchor.set(0.5)
         this.extra.x = 7
         this.extra.y = 4    
         this.letter.x-= 4
         this.addChild(this.extra)
      }
      this.draw()
   }

   get text() {
      let out = this.letter.text 
      if ( this.extra) {
         out += this.extra.text
      }
      return out
   }
}