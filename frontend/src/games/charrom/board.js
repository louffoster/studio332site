import * as PIXI from "pixi.js"
import Matter from 'matter-js'


// PALETTE: https://coolors.co/palette/7a6c5d-2a3d45-ddc9b4-bcac9b-c17c74
export default class Board extends PIXI.Container {
   boardW = 0 
   boardH = 0 
   gfx = null
   holes = []
   shotLineY = 0

   constructor( game, w, h ) {
      super()
      this.gfx = new PIXI.Graphics()
      this.addChild( this.gfx )
      this.boardW = w 
      this.boardH = h
      this.shotLineY = this.boardH * 0.7

      let h1 = new Hole(35,35, 35)
      this.holes.push(h1)
      this.addChild(h1)

      let h2 = new Hole(this.boardW-35, 35, 35)
      this.holes.push(h2)
      this.addChild(h2)

      let h3 = new Hole(35, this.boardH-35, 35)
      h3.setTrashMode()
      this.holes.push(h3)
      this.addChild(h3)

      let h4 = new Hole(this.boardW-35, this.boardH-35, 35)
      h4.setTrashMode()
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

      let m = new PIXI.Graphics() 
      m.beginFill(0x000000)
      m.drawRect(0, 0, this.boardW, this.boardH);
      m.endFill()
      this.addChild(m)
      this.mask = m

      this.draw()
   }

   checkSunk( puck ) {
      let sunk = false
      let trash = false
      this.holes.forEach( h => {
         if ( h.checkForSink( puck ) ) {
            sunk = true
            trash = h.trashPucks
         }
      })
      return {sunk: sunk, trash: trash}
   }

   canPlaceStriker(y, radius) {
      return ( y-radius*.5 >= this.shotLineY && y+radius < this.boardH )
   }

   draw() {
      // board sides and face
      this.gfx.beginFill(0x7A6C5D)
      this.gfx.drawRect(0,0, this.boardW, this.boardH)
      this.gfx.beginFill(0xDDC9B4)
      this.gfx.lineStyle( 3, 0x7A6C5D, 1 )
      this.gfx.drawRoundedRect(0,0, this.boardW, this.boardH, 50)
      this.gfx.endFill()

      // shot line
      this.gfx.lineStyle(4, 0xC17C74,1)
      this.gfx.moveTo(2, this.shotLineY)
      this.gfx.lineTo(this.boardW-2, this.shotLineY)

      // rack circle
      this.gfx.lineStyle(1, 0x7A6C5D,1)
      this.gfx.drawCircle(this.boardW/2, 162, 85)
      this.gfx.beginFill(0x7A6C5D)
      this.gfx.drawCircle(this.boardW/2, 162, 10)
      this.gfx.endFill()

      // trash marker
      this.gfx.lineStyle(10, 0xC17C74,1)
      this.gfx.drawCircle(35, this.boardH-35, 60)
      this.gfx.drawCircle(this.boardW-35, this.boardH-35, 60)

      // score marker
      this.gfx.lineStyle(10, 0x5574bd,1)
      this.gfx.drawCircle(35, 35, 60)
      this.gfx.drawCircle(this.boardW-35, 35, 60)
   }
}

class Hole extends PIXI.Container {
   gfx = null
   trashPucks = false

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

   setTrashMode() {
      this.trashPucks = true
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