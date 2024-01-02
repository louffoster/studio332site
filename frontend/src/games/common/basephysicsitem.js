import Matter from 'matter-js'
import * as PIXI from "pixi.js"

export default class BasePhysicsItem  extends  PIXI.Container { 
   body = null
   gfx = null 

   constructor( x,y ) {
      super() 
      this.x = x 
      this.y = y 
      this.gfx = new PIXI.Graphics()
      this.addChild(this.gfx)
   }

   applyForce(fX, fY) {
      Matter.Body.applyForce( this.body, this.body.position, {x:fX, y:fY})
   }

   spin(angularVelocityRad) {
      Matter.Body.setAngularVelocity(this.body, angularVelocityRad)  
   }

   stop() {
      Matter.Body.setVelocity(this.body, {x:0, y:0})
      Matter.Body.setAngularVelocity(this.body, 0)
   }

   draw() {
      this.gfx.clear()
   }

   update() {
      this.position.set(this.body.position.x, this.body.position.y)
      this.rotation = this.body.angle
   }
}