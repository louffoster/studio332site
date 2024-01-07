import BasePhysicsGame from "@/games/common/basephysicsgame"
import BasePhysicsItem from "@/games/common/basephysicsitem"
import PhysicsShape from "@/games/common/physicsshape"
import Matter from 'matter-js'
import * as PIXI from "pixi.js"

export default class Charrom extends BasePhysicsGame {
   targetObject = null
   dragStartTime = -1
   dragStartX = 0 
   dragStartY = 0
   gameTimeMs = 0
   holes = []
   ballCnt = 0

   initialize() {
      this.physics.gravity.scale = 0

      let h1 = new Hole(this.gameWidth/2, this.gameHeight-90, 30)
      this.holes.push(h1)
      this.addChild(h1)

      let h2 = new Hole(this.gameWidth/2, 90, 30)
      this.holes.push(h2)
      this.addChild(h2)

      this.createTableBounds()
      this.rackLetterPucks()
      this.addStriker()

      this.app.stage.eventMode = 'static'
      this.app.stage.hitArea = this.app.screen
      this.app.stage.on('pointerup', this.dragEnd.bind(this))
      this.app.stage.on('pointerupoutside', this.dragEnd.bind(this))
   }

   createTableBounds() {
      var ground = PhysicsShape.createBox(this.gameWidth/2, this.gameHeight-5, this.gameWidth, 10, 0xF7F7FF, 0x577399, true)
      ground.setOutlined(false)
      this.addPhysicsItem(ground)
      var top = PhysicsShape.createBox( this.gameWidth/2, 5, this.gameWidth, 10, 0xF7F7FF, 0x577399, true)
      this.addPhysicsItem(top)
      top.setOutlined(false)
      var left = PhysicsShape.createBox( 5, this.gameHeight/2, 10, this.gameHeight, 0xF7F7FF, 0x577399, true)
      this.addPhysicsItem(left)
      left.setOutlined(false)
      var right = PhysicsShape.createBox(this.gameWidth-5, this.gameHeight/2, 10, this.gameHeight, 0xF7F7FF, 0x577399, true)
      this.addPhysicsItem(right)
      right.setOutlined(false)
   }

   rackLetterPucks() {
      let rackLeft = (this.gameWidth-160)/2
      let rackTop = this.gameHeight/4
      let sz = 5
      let xPos = rackLeft
      for (let r = 0; r<5;r++) {
         for ( let c = 0; c< sz; c++) {
            this.addBall(xPos, rackTop)
            xPos += 40
         }
         sz--
         xPos = rackLeft+20*(5-sz)
         rackTop+=36
      }
   }

   addStriker() {
      let striker = new Striker(this.gameWidth/2, this.gameHeight*0.75, 0x000066, 0x5E5FF5)
      striker.setTouchListener( this.dragStart.bind(this))
      this.addPhysicsItem(striker)
   }

   addBall(x,y) {
      this.ballCnt++
      var ball = PhysicsShape.createCircle( x,y, 20, 0x660000, 0xFE5F55)
      ball.setLabel(`${this.ballCnt}`)
      ball.setAirFriction(0.02)
      ball.setRestitution( 1 )
      ball.setMass(4.75)
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


