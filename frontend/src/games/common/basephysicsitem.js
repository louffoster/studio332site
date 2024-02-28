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

   get tag() {
      return this.body.label
   }

   setRestitution( r ) {
      this.body.restitution = r
   }

   setAirFriction( af ) {
      this.body.frictionAir = af
   }
   setFriction( f ) {
      this.body.friction = f
   }

   setDensity( d ) {
      Matter.Body.setDensity(this.body, d)
   }
   setMass( m ) {
      Matter.Body.setMass(this.body, m)
   }
   setAngle( rad ) {
      Matter.Body.setAngle(this.body, rad)
   }

   applyForce(fX, fY) {
      Matter.Body.applyForce( this.body, this.body.position, {x:fX, y:fY})
   }

   spin(angularVelocityRad) {
      Matter.Body.setAngularVelocity(this.body, angularVelocityRad)  
   }

   get velocity() {
      return Matter.Vector.magnitude(Matter.Body.getVelocity(this.body))
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