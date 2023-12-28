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

   initialize() {
      this.engine = Matter.Engine.create()

      this.engine.gravity.scale = 0

      // note: make walls thick so ou cany move someting so fast it skips thru the wall
      var ground = Shape.createBox(this, this.gameWidth/2, this.gameHeight+90, this.gameWidth, 200, 0xF7F7FF, 0x577399, true)
      this.items.push( ground )
      var top = Shape.createBox(this, this.gameWidth/2, -90, this.gameWidth, 200, 0xF7F7FF, 0x577399, true)
      this.items.push( top )
      var left = Shape.createBox(this, -90, this.gameHeight/2, 200, this.gameHeight, 0xF7F7FF, 0x577399, true)
      this.items.push( left )
      var right = Shape.createBox(this, this.gameWidth+90, this.gameHeight/2, 200, this.gameHeight, 0xF7F7FF, 0x577399, true)
      this.items.push( right )

      var box = Shape.createBox(this, 100, 95, 40,40, 0x577399, 0xBDD5EA)
      box.setTouchListener( this.dragStart.bind(this))
      this.items.push( box )

      var box2 = Shape.createBox(this, 150, 100, 40,40, 0x577399, 0xBDD5EA)
      box2.setTouchListener( this.dragStart.bind(this))
      this.items.push( box2 )

      var box3 = Shape.createCircle(this,160, 150, 20, 0x577399, 0xFE5F55)
      box3.setTouchListener( this.dragStart.bind(this))
      this.items.push( box3 )

      this.app.stage.eventMode = 'static'
      this.app.stage.hitArea = this.app.screen
      this.app.stage.on('pointerup', this.dragEnd.bind(this))
      this.app.stage.on('pointerupoutside', this.dragEnd.bind(this))
   }

   dragStart( clickPos, tgt ) {
      this.targetObject = tgt 
      this.dragStartTime = this.gameTimeMs
      this.dragStartX = clickPos.x
      this.dragStartY = clickPos.y
      console.log("START "+this.dragStartX+","+this.dragStartY)
   }
   dragEnd(e) {
      if ( this.targetObject ) {
         let elapsedMS = this.gameTimeMs - this.dragStartTime 
         let dX = e.global.x - this.dragStartX
         let dY = e.global.y - this.dragStartY
         this.targetObject.applyForce(dX,dY, elapsedMS)
         this.targetObject = null 
         this.dragStartTime = -1
         this.dragStartX = 0
         this.dragStartY = 0
      }
   }

   update() {
      this.gameTimeMs += this.app.ticker.deltaMS
      Matter.Engine.update(this.engine, 1000 / 60) // 60 fps
      this.items.forEach( i => i.update() )
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

   static createCircle(game, x,y,radius, lineColor, fillColor) {
      let params = {type: "circle", radius: radius, lineColor: lineColor, fillColor: fillColor }
      return new Shape(game, x,y, params)
   }

   static createBox(game, x,y, w,h, lineColor, fillColor, isStatic = false) {
      let params = {type: "box", w: w, h: h, lineColor: lineColor, fillColor: fillColor, isStatic: isStatic }
      return new Shape(game, x,y, params)    
   }

   constructor( game, x,y, params = {type: "box", w: 40, h:40, lineColor: 0xffffff, fillColor: 0x666666}) {
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
      game.addChild( this )

      if (params.type == "circle") {
         console.log(`create circle ${this.x}, ${this.y} r=${params.radius}`)
         this.w = params.radius*2
         this.h = params.radius*2
         this.radius = params.radius
         this.pivot.set(0,0)
         this.physBody = Matter.Bodies.circle(x, y, params.radius, {restitution: 0.5, friction: 0.2, isStatic: this.isStatic})
         this.hitArea = new PIXI.Circle(0,0, params.radius)
      } else {
         this.w = params.w 
         this.h = params.h
         this.pivot.set(this.w/2, this.h/2)   
         this.physBody = Matter.Bodies.rectangle(x, y, this.w, this.h, { isStatic: this.isStatic })
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
         
         // Matter.Body.setAngularVelocity(this.physBody, 0.1)
         // Matter.Body.applyForce( this.physBody, this.physBody.position, {x:0, y:0.3})
      })
   }

   applyForce(dX, dY, delMS) {
      let dist = Math.sqrt( dX*dX + dY*dY) 
      let ratePxMerMs = (dist*0.8) / delMS
      let fX = Math.min(dX * (ratePxMerMs / 1000), 0.25)
      let fY = Math.min(dY * (ratePxMerMs / 1000), 0.25)
      console.log(`dist ${dist}; rate ${ratePxMerMs} ${fX}, ${fY} `)
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
      this.gfx.lineStyle(0, this.lineColor, 1)
      this.gfx.beginFill( this.fillColor )
      if (this.shape == "circle") {
         this.gfx.drawCircle(0,0,this.radius)
      } else {
         this.gfx.drawRect(0,0,this.w, this.h)
      }
      this.gfx.endFill()
   }
}