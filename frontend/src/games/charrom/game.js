import BasePhysicsGame from "@/games/common/basephysicsgame"
import BasePhysicsItem from "@/games/common/basephysicsitem"
import PhysicsShape from "@/games/common/physicsshape"
import LetterPool from "@/games/common/letterpool"
import LetterBall from "@/games/charrom/letterball"
import Matter from 'matter-js'
import * as PIXI from "pixi.js"
import { all } from "axios"

export default class Charrom extends BasePhysicsGame {
   pool = new LetterPool()
   targetObject = null
   dragStartTime = -1
   dragStartX = 0 
   dragStartY = 0
   gameTimeMs = 0
   holes = []
   word = null
   placePuck = true
   justFlicked = false
   flickTimeoutMS = 0

   initialize() {
      this.physics.gravity.scale = 0


      this.createTableBounds()
      this.rackLetterPucks()

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
      this.app.stage.on('pointerdown', this.pointerDown.bind(this))
      this.app.stage.on('pointerup', this.dragEnd.bind(this))
      this.app.stage.on('pointerupoutside', this.dragEnd.bind(this))
   }

   createTableBounds() {
      // walls
      var ground = PhysicsShape.createBox(this.gameWidth/2, this.gameHeight-5, this.gameWidth-110, 25, 0xF7F7FF, 0x577399, true)
      ground.setOutlined(false)
      this.addPhysicsItem(ground)
      var top = PhysicsShape.createBox( this.gameWidth/2, 5, this.gameWidth-110, 25, 0xF7F7FF, 0x577399, true)
      this.addPhysicsItem(top)
      top.setOutlined(false)

      var left = PhysicsShape.createBox( 5, this.gameHeight*.25+5, 25, this.gameHeight/2-100, 0xF7F7FF, 0x577399, true)
      left.setOutlined(false)
      this.addPhysicsItem(left)
      var left2 = PhysicsShape.createBox( 5, this.gameHeight*.75-5, 25, this.gameHeight/2-100, 0xF7F7FF, 0x577399, true)
      left2.setOutlined(false)
      this.addPhysicsItem(left2)
     
      var right = PhysicsShape.createBox(this.gameWidth-5, this.gameHeight*.25+5, 25, this.gameHeight/2-100, 0xF7F7FF, 0x577399, true)
      this.addPhysicsItem(right)
      right.setOutlined(false)
      var right2 = PhysicsShape.createBox(this.gameWidth-5, this.gameHeight*.75-5, 25, this.gameHeight/2-100, 0xF7F7FF, 0x577399, true)
      this.addPhysicsItem(right2)
      right2.setOutlined(false)

      let h1 = new Hole(15,15, 35)
      this.holes.push(h1)
      this.addChild(h1)

      let hx = new Hole(10,this.gameHeight/2, 35)
      this.holes.push(hx)
      this.addChild(hx)
      let hy = new Hole(this.gameWidth-10,this.gameHeight/2, 35)
      this.holes.push(hy)
      this.addChild(hy)

      let h2 = new Hole(this.gameWidth-15, 15, 35)
      this.holes.push(h2)
      this.addChild(h2)

      let h3 = new Hole(15, this.gameHeight-15, 35)
      this.holes.push(h3)
      this.addChild(h3)

      let h4 = new Hole(this.gameWidth-15, this.gameHeight-15, 35)
      this.holes.push(h4)
      this.addChild(h4)

      // angled corner bumpers
      // var tru = PhysicsShape.createTriangle( 30,30, 60, 60, 0x660000, 0x577399, true)
      // tru.setOutlined(false)
      // this.addPhysicsItem(tru)
      // var t2 = PhysicsShape.createTriangle( this.gameWidth-30,30, 60, 60, 0x660000, 0x577399, true)
      // t2.setOutlined(false)
      // t2.setAngle(1.57)
      // this.addPhysicsItem(t2)
      // var t3 = PhysicsShape.createTriangle( this.gameWidth-30,this.gameHeight-30, 60, 60, 0x660000, 0x577399, true)
      // t3.setOutlined(false)
      // t3.setAngle(3.14)
      // this.addPhysicsItem(t3)
      // var t4 = PhysicsShape.createTriangle( 30,this.gameHeight-30, 60, 60, 0x660000, 0x577399, true)
      // t4.setOutlined(false)
      // t4.setAngle(4.71)
      // this.addPhysicsItem(t4)
   }

   rackLetterPucks() {
      // let rackLeft = (this.gameWidth-120)/2
      let rackLeft = (this.gameWidth-160)/2
      let rackTop = this.gameHeight/5
      let sz = 5
      let xPos = rackLeft
      for (let r = 0; r<5;r++) {
         for ( let c = 0; c< sz; c++) {
            this.addBall(xPos, rackTop)
            xPos += 50
         }
         sz--
         xPos = rackLeft+25*(5-sz)
         rackTop+=46
      }
   }

   pointerDown(e) {
      if ( this.placePuck )    {
         let striker = new Striker(e.global.x, e.global.y, 0x000066, 0x5E5FF5)
         striker.setTouchListener( this.dragStart.bind(this))
         this.addPhysicsItem(striker)
         this.placePuck = false
      }
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
         ratePxMerMs = Math.min(ratePxMerMs, 0.15)
         let fX = dX * (ratePxMerMs / 100)
         let fY = dY * (ratePxMerMs / 100)

         this.targetObject.applyForce(fX,fY)
         this.targetObject = null 
         this.dragStartTime = -1
         this.dragStartX = 0
         this.dragStartY = 0
         this.flickTimeoutMS = 1500
         this.justFlicked = true
      }
   }

   update() {
      super.update()
      this.gameTimeMs += this.app.ticker.deltaMS
      if ( this.placePuck || this.justFlicked == false ) return 

      if ( this.flickTimeoutMS > 0) {
         this.flickTimeoutMS -= this.app.ticker.deltaMS
         this.flickTimeoutMS = Math.max(0, this.flickTimeoutMS)
      }

      let removeItems = []
      let allStopped = true
      let striker = null
      this.items.forEach( i => {

         if ( this.flickTimeoutMS == 0 ) {
            if ( i.velocity > 0.005) {
               allStopped = false
               i.stop()
            }
         } else {
            allStopped = false
         }

         if ( i.tag == "striker") {
            striker = i
         }

         this.holes.forEach( h => {
            if ( h.checkForSink( i ) ) {
               removeItems.push( i )
               striker  = null
               if ( i.tag != "striker") {
                  this.word.text += i.text
               }
            }
         })
      })

      if (allStopped ) {
         this.justFlicked = false 
         this.placePuck = true
         if ( striker ) {
            removeItems.push( striker)
         }
      }
 
      removeItems.forEach( i => this.removePhysicsItem( i ) )
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
      this.gfx.lineStyle(3, 0x6666aa, 1)
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


