import BasePhysicsGame from "@/games/common/basephysicsgame"
import BasePhysicsItem from "@/games/common/basephysicsitem"
import Matter from 'matter-js'
import * as PIXI from "pixi.js"

export default class PhysicsGame extends BasePhysicsGame {
   targetObject = null
   dragStartTime = -1
   dragStartX = 0 
   dragStartY = 0
   gameTimeMs = 0
   holes = []
   ballCnt = 0
   dragGfx = null

   initialize() {
      this.physics.gravity.scale = 0

      let h1 = new Hole(this.gameWidth/2, this.gameHeight-90, 30)
      this.holes.push(h1)
      this.addChild(h1)

      let h2 = new Hole(this.gameWidth/2, 90, 30)
      this.holes.push(h2)
      this.addChild(h2)

      // note: make walls thick so ou cany move someting so fast it skips thru the wall
      var ground = Shape.createBox(this.gameWidth/2, this.gameHeight+90, this.gameWidth, 200, 0xF7F7FF, 0x577399, true)
      this.addPhysicsItem(ground)
      var top = Shape.createBox( this.gameWidth/2, -90, this.gameWidth, 200, 0xF7F7FF, 0x577399, true)
      this.addPhysicsItem(top)
      var left = Shape.createBox( -90, this.gameHeight/2, 200, this.gameHeight, 0xF7F7FF, 0x577399, true)
      this.addPhysicsItem(left)
      var right = Shape.createBox(this.gameWidth+90, this.gameHeight/2, 200, this.gameHeight, 0xF7F7FF, 0x577399, true)
      this.addPhysicsItem(right)

      this.addBall(80,this.gameHeight/2)
      this.addBall(140,this.gameHeight/2)
      this.addBall(220,this.gameHeight/2)
      this.addBall(300,this.gameHeight/2)

      this.addStriker()

      this.app.stage.eventMode = 'static'
      this.app.stage.hitArea = this.app.screen
      this.app.stage.on('pointerup', this.dragEnd.bind(this))
      this.app.stage.on('pointerupoutside', this.dragEnd.bind(this))

      this.dragGfx = new  PIXI.Graphics()
      this.addChild(this.dragGfx)
   }

   addStriker() {
      let striker = new Striker(this.gameWidth/2, 180, 0x000066, 0x5E5FF5)
      striker.setTouchListener( this.dragStart.bind(this))
      this.addPhysicsItem(striker)
   }

   addBall(x,y) {
      this.ballCnt++
      var ball = Shape.createCircle( x,y, 20, 0x660000, 0xFE5F55)
      ball.setLabel(`${this.ballCnt}`)
      this.addPhysicsItem( ball )
   }

   dragStart( x,y,tgt ) {  
      this.targetObject = tgt 
      this.dragStartTime = this.gameTimeMs
      this.dragStartX = x
      this.dragStartY = y
      
   }

   dragEnd(e) {
      this.app.stage.off('pointermove', this.dragMove)
      if ( this.targetObject ) {
         this.dragGfx.clear()
         let elapsedMS = this.gameTimeMs - this.dragStartTime 
         let dX = e.global.x - this.dragStartX
         let dY = e.global.y - this.dragStartY

         let dist = Math.sqrt( dX*dX + dY*dY) 
         let ratePxMerMs = dist / elapsedMS
         ratePxMerMs = Math.min(ratePxMerMs, 0.15)
         let fX = dX * (ratePxMerMs / 100)
         let fY = dY * (ratePxMerMs / 100)

         this.targetObject.applyForce(fX,fY)
         this.targetObject = null 
         this.dragStartTime = -1
         this.dragStartX = 0
         this.dragStartY = 0
      }
   }

   update() {
      super.update()
      this.gameTimeMs += this.app.ticker.deltaMS
      this.items.forEach( i => {
         this.holes.forEach( h => {
            if ( h.checkForSink( i ) ) {
               this.removePhysicsItem( i )
               if ( i.tag == "striker") {
                  this.addStriker()
               } else {
                  this.addBall(this.gameWidth/2, this.gameHeight/2)
               }
            }
         })
      })
   }
}

class Hole extends  PIXI.Container {
   gfx = null
   constructor( x,y, radius) {
      super() 
      this.x = x 
      this.y = y 
      this.radius = radius
      this.pivot.set(0,0)
      this.gfx = new PIXI.Graphics()
      this.addChild(this.gfx)
      this.draw()
   }

   checkForSink( shape ) {
      if ( Matter.Vector.magnitude(shape.body.velocity) > 0) {
         let dX = this.x - shape.x 
         let dY = this.y - shape.y 
         let dist = Math.sqrt( dX*dX + dY*dY)
         if ( dist <= shape.radius/2 ) {
            shape.stop()
            return true
         } else if ( dist <= this.radius+(shape.radius*.25) ) { // 3/4 of the puck is over the hole before it gets pulled in
            Matter.Body.applyForce( shape.body, shape.body.position, {x:dX/4000, y:dY/4000})
         }
      }
      return false
   }

   draw() {
      this.gfx.clear() 
      this.gfx.lineStyle(1, 0x577399, 1)
      this.gfx.beginFill( 0x020202 )
      this.gfx.drawCircle(0,0,this.radius)
      this.gfx.endFill()    
   }
}

class Striker extends BasePhysicsItem {
   lineColor = null 
   fillColor = null
   dragging = false 
   shape = "box"
   touchListener = null
   radius = 0

   constructor( x,y, lineColor=0xffffff, fillColor=0x666666) {
      super(x,y)
     
      this.lineColor = new PIXI.Color( lineColor )
      this.fillColor = new PIXI.Color( fillColor )
      this.radius = 30
      this.pivot.set(0,0)
      this.body = Matter.Bodies.circle(x, y, this.radius, {restitution: 1, frictionAir: 0.02, frictiion: 0, label: "striker"})
      this.hitArea = new PIXI.Circle(0,0, this.radius)
      console.log("orig mass "+this.body.mass)
      this.setMass(5.0)
      
      this.update()

      this.draw() 

      this.cursor ="pointer"
      this.eventMode = 'static'
      this.on('pointerdown', (e) => {
         this.dragging = true
         this.touchListener( e.global.x, e.global.y, this )
      })
   }

   setTouchListener( l ) {
      this.touchListener = l
   }

   draw() {
      this.gfx.clear() 
      this.gfx.lineStyle(1, this.lineColor, 1)
      this.gfx.beginFill( this.fillColor )
      this.gfx.drawCircle(0,0,this.radius)
      this.gfx.endFill()
   }
}


class Shape extends BasePhysicsItem {
   lineColor = null 
   fillColor = null
   shape = "box"
   isStatic = false

   static createCircle(x,y, radius, lineColor, fillColor) {
      let params = {type: "circle", radius: radius, lineColor: lineColor, fillColor: fillColor }
      return new Shape(x,y, params)
   }

   static createBox(x,y, w,h, lineColor, fillColor, isStatic = false) {
      let params = {type: "box", w: w, h: h, lineColor: lineColor, fillColor: fillColor, isStatic: isStatic }
      return new Shape(x,y, params)    
   }

   constructor( x,y, params = {type: "box", w: 40, h:40, lineColor: 0xffffff, fillColor: 0x666666}) {
      super(x,y)
     
      this.shape = params.type
      this.isStatic = false
      if ( params.isStatic ) {
         this.isStatic = params.isStatic 
      }
      if ( this.shape != "circle" && this.shape != "box") {
         this.shape = "box"
      }

      this.lineColor = new PIXI.Color( params.lineColor )
      this.fillColor = new PIXI.Color( params.fillColor )

      if (params.type == "circle") {
         this.w = params.radius*2
         this.h = params.radius*2
         this.radius = params.radius
         this.pivot.set(0,0)
         this.body = Matter.Bodies.circle(x, y, params.radius, {restitution: 1, isStatic: this.isStatic, frictionAir: 0.02})
         this.hitArea = new PIXI.Circle(0,0, params.radius)
         this.setMass(4.75)
      } else {
         this.w = params.w 
         this.h = params.h
         this.pivot.set(this.w/2, this.h/2)   
         this.body = Matter.Bodies.rectangle(x, y, this.w, this.h, { restitution: 1, isStatic: this.isStatic})
         this.hitArea = new PIXI.Rectangle(0,0, this.w, this.h)
      }

      this.update()

      this.draw() 
   }

   setLabel( val ) {
      let label = new PIXI.Text(val, {fontSize: 12, fill: 0x550000, fontWeight: "bold"})
      label.anchor.set(0.5,0.5)
      this.addChild(label)
   }

   draw() {
      this.gfx.clear() 
      let line = 1 
      if ( this.shape == "box") {
         line = 0
      }
      this.gfx.lineStyle(line, this.lineColor, 1)
      this.gfx.beginFill( this.fillColor )
      if (this.shape == "circle") {
         this.gfx.drawCircle(0,0,this.radius)
      } else {
         this.gfx.drawRect(0,0,this.w, this.h)
      }
      this.gfx.endFill()
   }
}