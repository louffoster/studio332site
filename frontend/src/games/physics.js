import BaseGame from "@/games/common/basegame"
import Matter from 'matter-js'
import * as PIXI from "pixi.js"

export default class PhysicsGame extends BaseGame {
   engine = null 
   items = [] 
   targetObject = null
   dragStartTime = -1
   dragStartX = 0 
   dragStartY = 0
   gameTimeMs = 0
   holes = []
   ballCnt = 0

   initialize() {
      this.engine = Matter.Engine.create()

      this.engine.gravity.scale = 0

      this.holes.push(new Hole(this, this.gameWidth/2, this.gameHeight-90, 30))
      this.holes.push(new Hole(this, this.gameWidth/2, 90, 30))

      // note: make walls thick so ou cany move someting so fast it skips thru the wall
      var ground = Shape.createBox(this, "bottom", this.gameWidth/2, this.gameHeight+90, this.gameWidth, 200, 0xF7F7FF, 0x577399, true)
      this.items.push( ground )
      var top = Shape.createBox(this, "top", this.gameWidth/2, -90, this.gameWidth, 200, 0xF7F7FF, 0x577399, true)
      this.items.push( top )
      var left = Shape.createBox(this, "left", -90, this.gameHeight/2, 200, this.gameHeight, 0xF7F7FF, 0x577399, true)
      this.items.push( left )
      var right = Shape.createBox(this, "right", this.gameWidth+90, this.gameHeight/2, 200, this.gameHeight, 0xF7F7FF, 0x577399, true)
      this.items.push( right )

      this.addBall(100,this.gameHeight/2)
      this.addBall(140,this.gameHeight/2)
      this.addBall(220,this.gameHeight/2)
      this.addBall(300,this.gameHeight/2)

      this.app.stage.eventMode = 'static'
      this.app.stage.hitArea = this.app.screen
      this.app.stage.on('pointerup', this.dragEnd.bind(this))
      this.app.stage.on('pointerupoutside', this.dragEnd.bind(this))
   }

   removeShape( shape ) {
      Matter.Composite.remove(this.engine.world, shape.physBody)
      this.removeChild( shape ) 
      let idx = this.items.findIndex( s => s == shape )
      this.items.splice(idx,1)
   }

   addBall(x,y) {
      this.ballCnt++
      var box3 = Shape.createCircle(this, `${this.ballCnt}`, x,y, 25, 0x660000, 0xFE5F55)
      box3.setTouchListener( this.dragStart.bind(this))
      this.items.push( box3 )

      console.log(Matter.Composite.allBodies( this.engine.world ).length)
   }

   dragStart( clickPos, tgt ) {
      this.targetObject = tgt 
      this.dragStartTime = this.gameTimeMs
      this.dragStartX = clickPos.x
      this.dragStartY = clickPos.y
   }
   dragEnd(e) {
      if ( this.targetObject ) {
         let elapsedMS = this.gameTimeMs - this.dragStartTime 
         let dX = e.global.x - this.dragStartX
         let dY = e.global.y - this.dragStartY

         let dist = Math.sqrt( dX*dX + dY*dY) 
         let ratePxMerMs = dist / elapsedMS
         let fX = Math.min(dX * (ratePxMerMs / 1000), 0.05)
         let fY = Math.min(dY * (ratePxMerMs / 1000), 0.05)

         this.targetObject.applyForce(fX,fY)
         this.targetObject = null 
         this.dragStartTime = -1
         this.dragStartX = 0
         this.dragStartY = 0
      }
   }

   update() {
      this.gameTimeMs += this.app.ticker.deltaMS
      Matter.Engine.update(this.engine, 1000 / 60) // 60 fps
      this.items.forEach( i => {
         i.update() 
         this.holes.forEach( h => {
            if ( h.checkForSink( i ) ) {
               this.removeShape( i )
               this.addBall(this.gameWidth/2, this.gameHeight/2)
            }
         })
      })
   }
}

class Hole extends  PIXI.Container {
   gfx = null
   constructor( game, x,y, radius) {
      super() 
      this.x = x 
      this.y = y 
      this.radius = radius
      this.pivot.set(0,0)
      this.gfx = new PIXI.Graphics()
      this.addChild(this.gfx)
      game.addChild( this )
      this.draw()
   }

   checkForSink( shape ) {
      if ( Matter.Vector.magnitude(shape.physBody.velocity) > 0) {
         let dX = this.x - shape.x 
         let dY = this.y - shape.y 
         let dist = Math.sqrt( dX*dX + dY*dY)
         if ( dist <= shape.radius/2 ) {
            shape.stop()
            return true
         } else if ( dist <= this.radius ) {
            Matter.Body.applyForce( shape.physBody, shape.physBody.position, {x:dX/9000, y:dY/9000})
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


class Shape extends PIXI.Container {
   gfx = null
   lineColor = null 
   fillColor = null
   physBody = null
   dragging = false 
   shape = "box"
   touchListener = null
   isStatic = false

   static createCircle(game, id, x,y,radius, lineColor, fillColor) {
      let params = {type: "circle", radius: radius, lineColor: lineColor, fillColor: fillColor }
      return new Shape(game, id, x,y, params)
   }

   static createBox(game, id, x,y, w,h, lineColor, fillColor, isStatic = false) {
      let params = {type: "box", w: w, h: h, lineColor: lineColor, fillColor: fillColor, isStatic: isStatic }
      return new Shape(game, id, x,y, params)    
   }

   constructor( game, id, x,y, params = {type: "box", w: 40, h:40, lineColor: 0xffffff, fillColor: 0x666666}) {
      super()
      this.x = x 
      this.y = y 
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

      this.gfx = new PIXI.Graphics()
      this.addChild(this.gfx)
      let label = new PIXI.Text(id, {fontSize: 12, fill: 0x550000, fontWeight: "bold"})
      label.anchor.set(0.5,0.5)
      this.addChild(label)
      game.addChild( this )

      if (params.type == "circle") {
         this.w = params.radius*2
         this.h = params.radius*2
         this.radius = params.radius
         this.pivot.set(0,0)
         this.physBody = Matter.Bodies.circle(x, y, params.radius, {restitution: 1,isStatic: this.isStatic, id: id, frictionAir: 0.02})
         this.hitArea = new PIXI.Circle(0,0, params.radius)
      } else {
         this.w = params.w 
         this.h = params.h
         this.pivot.set(this.w/2, this.h/2)   
         this.physBody = Matter.Bodies.rectangle(x, y, this.w, this.h, { isStatic: this.isStatic, id: id })
         this.hitArea = new PIXI.Rectangle(0,0, this.w, this.h)
      }

      Matter.Composite.add(game.engine.world, this.physBody)
      this.update()

      this.draw() 

      this.cursor ="pointer"
      this.eventMode = 'static'
      this.on('pointerdown', (event) => {
         if ( this.isStatic || !this.touchListener ) return

         this.dragging = true
         this.touchListener( event.global, this )
         this.alpha = 0.8

         // let dX = -25
         // let dY = -0.9
         // Matter.Body.applyForce( this.physBody, this.physBody.position, {x:dX/8000, y:dY/8000})
         
         // Matter.Body.setAngularVelocity(this.physBody, 0.1)
         // Matter.Body.applyForce( this.physBody, this.physBody.position, {x:0, y:0.3})
      })
   }

   get id() {
      return this.physBody.id
   }

   stop() {
      Matter.Body.setVelocity(this.physBody, {x:0, y:0})
      Matter.Body.setAngularVelocity(this.physBody, 0)
   }

   applyForce(fX, fY) {
      Matter.Body.applyForce( this.physBody, this.physBody.position, {x:fX, y:fY})
      this.alpha = 1.0
   }

   setTouchListener( l ) {
      this.touchListener = l
   }

   update() {
      this.position.set(this.physBody.position.x, this.physBody.position.y)
      this.rotation = this.physBody.angle
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

/* old logic for pulli ng puck into hole. hole is a sensor 
   // near the hole
   if (dist <= this.sinkDist) {
      // flag pending state so game layer can handle properly
      if (puck.getStatus() == Puck.Status.READY) {
         puck.setStaus(Status.SUNK);
         puck.stop();
         puck.remove();
         SoundManager.instance().playSound(SoundManager.DROP);
      }
   } else if (dist <= this.pullDist) {
      Vector2 distV = holeCenter.sub(position);
      float force = intenstity / distV.len2();
      Vector2 forceV = distV.scl(force);
      forceV = forceV.nor();

      // pull the puck towards the hole
      b.applyLinearImpulse(forceV, position, true);
   }
*/