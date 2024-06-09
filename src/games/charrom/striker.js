import BasePhysicsItem from "@/games/common/basephysicsitem"
import Matter from 'matter-js'
import { Circle } from "pixi.js"
import * as TWEEDLE from "tweedle.js"


export default class Striker extends BasePhysicsItem {
   static RADIUS = 28
   
   lineColor = null 
   fillColor = null
   shape = "box"
   touchListener = null
   radius = 0

   constructor( x,y) {
      super(x,y)
     
      this.lineColor =  0x000066
      this.fillColor = 0x5E3023
      this.radius = Striker.RADIUS
      this.pivot.set(0,0)
      this.body = Matter.Bodies.circle(x, y, this.radius, {restitution: 1, frictionAir: 0.02, frictiion: 0, label: "striker"})
      this.hitArea = new Circle(0,0, this.radius)
      this.setMass(3.5)
      
      this.update()
      this.draw() 

      this.cursor ="pointer"
      this.eventMode = 'static'
      this.on('pointerdown', () => {
         this.touchListener()
      })
   }

   removeFromTable() {
      this.body.isSensor = true
      this.gfx.alpha = 0
   }

   placeOnTable(x,y) {
      this.gfx.alpha = 1
      Matter.Body.setPosition(this.body, {x:x,y:y})
      this.update()
      this.body.isSensor = false
      
   }

   fade( fadeDone) {
      new TWEEDLE.Tween(this.gfx).to({ alpha: 0}, 150).start().easing(TWEEDLE.Easing.Linear.None).onComplete(fadeDone)
   }

   setTouchListener( l ) {
      this.touchListener = l
   }

   draw() {
      this.gfx.clear() 
      this.gfx.circle(0,0,this.radius).fill(this.fillColor).stroke({width: 1, color: this.lineColor})
      this.gfx.circle(0,0,this.radius-10).fill(0x895737)
   }
}