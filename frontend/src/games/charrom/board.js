import * as PIXI from "pixi.js"
import Matter from 'matter-js'

export default class Board extends PIXI.Container {
   boardW = 0 
   boardH = 0 
   gfx = null
   holes = []

   constructor( game, w, h ) {
      super()
      this.gfx = new PIXI.Graphics()
      this.addChild( this.gfx )
      this.boardW = w 
      this.boardH = h


      let h1 = new Hole(35,35, 35)
      this.holes.push(h1)
      this.addChild(h1)

      let h2 = new Hole(this.boardW-35, 35, 35)
      this.holes.push(h2)
      this.addChild(h2)

      let h3 = new Hole(35, this.boardH-35, 35)
      this.holes.push(h3)
      this.addChild(h3)

      let h4 = new Hole(this.boardW-35, this.boardH-35, 35)
      this.holes.push(h4)
      this.addChild(h4)

      // add non-rendered rails around the edge of the board
      let b = Matter.Bodies.rectangle(this.boardW/2, this.boardH+25, this.boardW, 50, { isStatic: true, friction: 0, restitution: 1})
      Matter.Composite.add(game.physics.world, b)
      let t = Matter.Bodies.rectangle(this.boardW/2, -25, this.boardW, 50, { isStatic: true, friction: 0, restitution: 1})
      Matter.Composite.add(game.physics.world, t)
      let l = Matter.Bodies.rectangle(-25, this.boardH/2, 50, this.boardH, { isStatic: true, friction: 0, restitution: 1})
      Matter.Composite.add(game.physics.world, l)
      let r = Matter.Bodies.rectangle(this.boardW+25, this.boardH/2, 50, this.boardH, { isStatic: true, friction: 0, restitution: 1})
      Matter.Composite.add(game.physics.world, r)

      this.draw()
   }

   isSunk( puck ) {
      let sunk = false
      this.holes.forEach( h => {
         if ( h.checkForSink( puck ) ) {
            sunk = true
         }
      })
      return sunk
   }

   draw() {
      this.gfx.beginFill(0x7A6C5D)
      this.gfx.drawRect(0,0, this.boardW, this.boardH)

      this.gfx.beginFill(0xDDC9B4)
      this.gfx.lineStyle( 3, 0x7A6C5D, 1 )
      this.gfx.drawRoundedRect(0,0, this.boardW, this.boardH, 50)
      this.gfx.endFill()
   }
}

class Hole extends PIXI.Container {
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
      this.gfx.lineStyle(1, 0x7A6C5D, 1)
      this.gfx.beginFill( 0x020202 )
      this.gfx.drawCircle(0,0,this.radius)
      this.gfx.endFill()    
   }
}