import BaseGame from "@/games/common/basegame"
import Matter from 'matter-js'
import * as PIXI from "pixi.js"

export default class PhysicsGame extends BaseGame {
   engine = null 
   items = [] 

   initialize() {
      this.engine = Matter.Engine.create()

      this.engine.gravity.scale = 0

      var ground = Shape.createBox(this, this.gameWidth/2, this.gameHeight-10, this.gameWidth, 20, 0xF7F7FF, 0x577399, true)
      this.items.push( ground )
      var top = Shape.createBox(this, this.gameWidth/2, 10, this.gameWidth, 20, 0xF7F7FF, 0x577399, true)
      this.items.push( top )
      var left = Shape.createBox(this, 10, this.gameHeight/2, 20, this.gameHeight, 0xF7F7FF, 0x577399, true)
      this.items.push( left )
      var right = Shape.createBox(this, this.gameWidth-10, this.gameHeight/2, 20, this.gameHeight, 0xF7F7FF, 0x577399, true)
      this.items.push( right )

      var box = Shape.createBox(this, 100, 95, 80,80, 0x577399, 0xBDD5EA)
      this.items.push( box )

      var box2 = Shape.createBox(this, 150, 100, 80,80, 0x577399, 0xBDD5EA)
      this.items.push( box2 )

      var box3 = Shape.createCircle(this,160, 150, 40, 0x577399, 0xFE5F55)
      this.items.push( box3 )

   }

   update() {
      Matter.Engine.update(this.engine, 1000 / 60) // 60 fps
      this.items.forEach( i => i.update() )
   }
}


class Shape extends PIXI.Container {
   gfx = null
   lineColor = null 
   fillColor = null
   physBody = null

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
         this.physBody = Matter.Bodies.circle(x, y, params.radius, {restitution: 0.8, friction: 0.2})
         this.hitArea = new PIXI.Circle(0,0, params.radius)
         Matter.Body.setMass(this.physBody, 10)
      } else {
         this.w = params.w 
         this.h = params.h
         this.pivot.set(this.w/2, this.h/2)   
         this.physBody = Matter.Bodies.rectangle(x, y, this.w, this.h, { isStatic: params.isStatic })
         this.hitArea = new PIXI.Rectangle(0,0, this.w, this.h)
      }


      Matter.Composite.add(game.engine.world, this.physBody)
      this.update()

      this.draw() 

      this.cursor ="pointer"
      this.eventMode = 'static'
      this.on('pointerup', () => {
         Matter.Body.setAngularVelocity(this.physBody, 0.1)
         Matter.Body.applyForce( this.physBody, this.physBody.position, {x:0, y:0.3})
         // Matter.Body.applyForce(body, position, force)
         // Matter.Body.setVelocity(body, velocity)
         // force and velocity are both vectors:  Matter.Vector.create(x, y) 
      })
   }

   update() {
      this.position.set(this.physBody.position.x, this.physBody.position.y)
      this.rotation = this.physBody.angle
   }

   draw() {
      this.gfx.clear() 
      this.gfx.lineStyle(1, this.lineColor, 1)
      this.gfx.beginFill( this.fillColor )
      if (this.shape == "circle") {
         this.gfx.drawCircle(0,0,this.radius)
      } else {
         this.gfx.drawRect(0,0,this.w, this.h)
      }
      this.gfx.endFill()
   }
}