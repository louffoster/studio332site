import BaseGame from "@/games/common/basegame"
import Matter from 'matter-js'
import * as PIXI from "pixi.js"

export default class PhysicsGame extends BaseGame {
   engine = null 
   items = [] 

   initialize() {
      this.engine = Matter.Engine.create()

      var ground = new Box(this, this.gameWidth/2, this.gameHeight-10, this.gameWidth, 20, 0xF7F7FF, 0x577399, true)
      this.items.push( ground )

      var box = new Box(this, 100, 0, 80,80, 0x577399, 0xBDD5EA)
      this.items.push( box )

      var box2 = new Box(this, 150, 100, 80,80, 0x577399, 0xBDD5EA)
      this.items.push( box2 )

      var box3 = new Box(this, this.gameWidth-90, 100, 80,80, 0x577399, 0xBDD5EA)
      this.items.push( box3 )

   }

   update() {
      Matter.Engine.update(this.engine, 1000 / 60)
      this.items.forEach( i => i.update() )
   }
}


class Box extends PIXI.Container {
   gfx = null
   lineColor = null 
   fillColor = null
   physBody = null

   constructor( game, x,y, w,h, lineColor, fillColor, isStatic=false) {
      super()
      this.x = x 
      this.y = y 
      this.w = w 
      this.h = h
      this.pivot.set(w/2, h/2)

      this.lineColor = new PIXI.Color(lineColor)
      this.fillColor = new PIXI.Color(fillColor)

      this.gfx = new PIXI.Graphics()
      this.addChild(this.gfx)
      game.addChild( this )

      this.physBody = Matter.Bodies.rectangle(x, y, w,h, { isStatic: isStatic })
      Matter.Composite.add(game.engine.world, this.physBody)
      this.update()

      this.draw() 
   }

   update() {
      this.position.set(this.physBody.position.x, this.physBody.position.y)
      this.rotation = this.physBody.angle
   }

   draw() {
      this.gfx.clear() 
      this.gfx.lineStyle(1, this.lineColor, 1)
      this.gfx.beginFill( this.fillColor )
      console.log(this.w+", "+this.h)
      this.gfx.drawRect(0,0,this.w, this.h)
      this.gfx.endFill()
   }
}