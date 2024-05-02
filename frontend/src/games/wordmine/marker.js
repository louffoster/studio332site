import PhysicsShape from "@/games/common/physicsshape"
import { Rectangle } from "pixi.js"
import * as TWEEDLE from "tweedle.js"

export default class Marker extends PhysicsShape {
   letter = null 
   extra = null
   static WIDTH = 45
   static HEIGHT = 45

   constructor( x,y, listener ) {
      super( x,y, {type: "box", w:Marker.WIDTH, h: Marker.HEIGHT, lineColor: 0x000000, fillColor: 0xdb3a34})
      this.setMass(2.75)
      this.draw()

      this.cursor ="pointer"
      this.eventMode = 'static'
      this.hitArea = new Rectangle(0,0, Marker.WIDTH,Marker.HEIGHT)
      this.on('pointerdown', ()=> {
         listener(this)
      })
   }

   fade() {
      new TWEEDLE.Tween(this.gfx).to({ alpha: 0}, 750).start().easing(TWEEDLE.Easing.Linear.None)
   }

   draw() {
      super.draw()
      this.gfx.rect(5,5,Marker.WIDTH-10, Marker.HEIGHT-10).fill(0xF3E9DC).stroke({width:1, color: 0x000000})
      this.gfx.moveTo(5,5).lineTo(Marker.WIDTH-5,Marker.HEIGHT-5).stroke( {width:1, color: 0xa92727} )
      this.gfx.moveTo(Marker.WIDTH-5,5).lineTo(5,Marker.HEIGHT-5).stroke( {width:1, color: 0xa92727} )
      this.gfx.circle(Marker.WIDTH/2,Marker.HEIGHT/2,6).fill(0xcf3333).stroke({width:2, color: 0x333333})
      this.gfx.circle(Marker.WIDTH/2,Marker.HEIGHT/2,2).fill(0xff8888)
   }
}