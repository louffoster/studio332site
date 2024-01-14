import BasePhysicsItem from "@/games/common/basephysicsitem"
import Matter from 'matter-js'
import * as PIXI from "pixi.js"
import * as TWEEDLE from "tweedle.js"


export default class Striker extends BasePhysicsItem {
   static RADIUS = 30
   
   lineColor = null 
   fillColor = null
   dragging = false 
   shape = "box"
   touchListener = null
   radius = 0

   constructor( x,y) {
      super(x,y)
     
      this.lineColor = new PIXI.Color( 0x000066 )
      this.fillColor = new PIXI.Color( 0x5E3023 )
      this.radius = Striker.RADIUS
      this.pivot.set(0,0)
      this.body = Matter.Bodies.circle(x, y, this.radius, {restitution: 1, frictionAir: 0.02, frictiion: 0, label: "striker"})
      this.hitArea = new PIXI.Circle(0,0, this.radius)
      this.setMass(3.0)
      
      this.update()

      this.draw() 

      this.cursor ="pointer"
      this.eventMode = 'static'
      this.on('pointerdown', (e) => {
         this.dragging = true
         this.touchListener( e.global.x, e.global.y, this )
      })
   }

   fade( fadeDone) {
      new TWEEDLE.Tween(this.gfx).to({ alpha: 0}, 250).start().easing(TWEEDLE.Easing.Linear.None).onComplete(fadeDone)
   }

   setTouchListener( l ) {
      this.touchListener = l
   }

   draw() {
      this.gfx.clear() 
      this.gfx.lineStyle(1, this.lineColor, 1)
      this.gfx.beginFill( this.fillColor )
      this.gfx.drawCircle(0,0,this.radius)
      this.gfx.beginFill( 0x895737 )
      this.gfx.drawCircle(0,0,this.radius-10)
      this.gfx.endFill()
   }
}