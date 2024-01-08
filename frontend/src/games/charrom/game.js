import BasePhysicsGame from "@/games/common/basephysicsgame"
import BasePhysicsItem from "@/games/common/basephysicsitem"
import PhysicsShape from "@/games/common/physicsshape"
import LetterPool from "@/games/common/letterpool"
import LetterBall from "@/games/charrom/letterball"
import Matter from 'matter-js'
import * as PIXI from "pixi.js"

export default class Charrom extends BasePhysicsGame {
   pool = new LetterPool()
   targetObject = null
   dragStartTime = -1
   dragStartX = 0 
   dragStartY = 0
   gameTimeMs = 0
   holes = []
   word = null

   initialize() {
      this.physics.gravity.scale = 0

      let h1 = new Hole(this.gameWidth/2, this.gameHeight-90, 30)
      this.holes.push(h1)
      this.addChild(h1)

      let h2 = new Hole(this.gameWidth/2, 90, 30)
      this.holes.push(h2)
      this.addChild(h2)

      let h3 = new Hole(75, this.gameHeight/2, 30)
      this.holes.push(h3)
      this.addChild(h3)

      let h4 = new Hole(this.gameWidth-75, this.gameHeight/2, 30)
      this.holes.push(h4)
      this.addChild(h4)


      this.createTableBounds()
      this.rackLetterPucks()
      this.addStriker()

      let wordStyle = new PIXI.TextStyle({
         fill: "#BDD5EA",
         fontFamily: "Arial",
         fontSize: 20,
         lineHeight: 20
      })
      this.word = new PIXI.Text("", wordStyle)
      this.word.anchor.set(0.5,1)
      this.word.x = this.gameWidth/2
      this.word.y = this.gameHeight - 20
      this.addChild(this.word)

      this.app.stage.eventMode = 'static'
      this.app.stage.hitArea = this.app.screen
      this.app.stage.on('pointerup', this.dragEnd.bind(this))
      this.app.stage.on('pointerupoutside', this.dragEnd.bind(this))
   }

   createTableBounds() {
      // walls
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

      // angled corner bumpers
      var tru = PhysicsShape.createTriangle( 30,30, 60, 60, 0x660000, 0x577399, true)
      tru.setOutlined(false)
      this.addPhysicsItem(tru)
      var t2 = PhysicsShape.createTriangle( this.gameWidth-30,30, 60, 60, 0x660000, 0x577399, true)
      t2.setOutlined(false)
      t2.setAngle(1.57)
      this.addPhysicsItem(t2)
      var t3 = PhysicsShape.createTriangle( this.gameWidth-30,this.gameHeight-30, 60, 60, 0x660000, 0x577399, true)
      t3.setOutlined(false)
      t3.setAngle(3.14)
      this.addPhysicsItem(t3)
      var t4 = PhysicsShape.createTriangle( 30,this.gameHeight-30, 60, 60, 0x660000, 0x577399, true)
      t4.setOutlined(false)
      t4.setAngle(4.71)
      this.addPhysicsItem(t4)
   }

   rackLetterPucks() {
      let rackLeft = (this.gameWidth-120)/2
      let rackTop = this.gameHeight/4
      let sz = 4
      let xPos = rackLeft
      for (let r = 0; r<4;r++) {
         for ( let c = 0; c< sz; c++) {
            this.addBall(xPos, rackTop)
            xPos += 40
         }
         sz--
         xPos = rackLeft+20*(4-sz)
         rackTop+=36
      }
   }

   addStriker() {
      let striker = new Striker(this.gameWidth/2, this.gameHeight*0.75, 0x000066, 0x5E5FF5)
      striker.setTouchListener( this.dragStart.bind(this))
      this.addPhysicsItem(striker)
   }

   addBall(x,y) {
      if ( this.pool.hasTilesLeft() == false ) {
         this.pool.refill()
      }
      let letter = this.pool.pop()
      let ball = new LetterBall(x,y,letter)
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
         ratePxMerMs = Math.min(ratePxMerMs, 0.18)
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
                  this.word.text += i.text
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
            Matter.Body.applyForce( shape.body, shape.body.position, {x:dX/2000, y:dY/2000})
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


