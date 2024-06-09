import { Container, Graphics, Circle } from "pixi.js"
import Matter from 'matter-js'


// PALETTE: https://coolors.co/palette/7a6c5d-2a3d45-ddc9b4-bcac9b-c17c74
export default class Board extends Container {
   boardW = 0 
   boardH = 0 
   gfx = null
   holes = []
   bottomShotLineY = 0
   topShotLineY = 0
   shotZoneH = 135

   constructor( game, top, w, h ) {
      super()
      this.gfx = new Graphics()
      this.addChild( this.gfx )
      this.boardW = w 
      this.boardH = h
      this.y = top

      this.topShotLineY = this.shotZoneH
      this.bottomShotLineY = this.boardH - this.shotZoneH

      let hp = [ 
         {x: 30, y: 30, r: 30}, {x: this.boardW-30, y: 30, r: 30},
         {x: 30, y: this.boardH/2, r: 30}, {x: this.boardW-30, y: this.boardH/2, r: 30},
         {x: 30, y: this.boardH-30, r: 30}, {x: this.boardW-30, y: this.boardH-30, r: 30}
      ]
      hp.forEach( pos => {
         let h = new Hole(top, pos.x, pos.y, pos.r)
         this.holes.push(h)
         this.addChild(h)
      })

      // add non-rendered rails around the edge of the board
      let b = Matter.Bodies.rectangle(this.boardW/2, this.y+this.boardH+25, this.boardW, 50, { isStatic: true, friction: 0, restitution: 1})
      Matter.Composite.add(game.physics.world, b)
      let t = Matter.Bodies.rectangle(this.boardW/2, this.y-25, this.boardW, 50, { isStatic: true, friction: 0, restitution: 1})
      Matter.Composite.add(game.physics.world, t)
      let l = Matter.Bodies.rectangle(-25, this.y+this.boardH/2, 50, this.boardH, { isStatic: true, friction: 0, restitution: 1})
      Matter.Composite.add(game.physics.world, l)
      let r = Matter.Bodies.rectangle(this.boardW+25, this.y+this.boardH/2, 50, this.boardH, { isStatic: true, friction: 0, restitution: 1})
      Matter.Composite.add(game.physics.world, r)

      let m = new Graphics() 
      m.rect(0, 0, this.boardW, this.boardH).fill(0x000000)
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
         }
      })
      return sunk
   }

   canPlaceStriker(x,y, radius) {
      if ( y+radius > this.boardH+this.y) return false
      if ( y-radius < this.y) return false

      if ( this.lowerShotArea.contains(x,y-this.y-radius) ) return true
      if ( this.upperShotArea.contains(x,y-this.y-radius)  ) return true
      return false
   }

   draw() {
      // board sides and face
      this.gfx.rect(0,0, this.boardW, this.boardH).fill(0x7A6C5D)
      this.gfx.roundRect(0,0, this.boardW, this.boardH, 50).
         fill(0xcDb9a4).stroke({width:3, color: 0x7A6C5D})

      // shot lines
      this.gfx.circle(this.boardW/2, this.boardH, 150).
         fill({color: 0xccccff, alpha: 0.2}).stroke({width:2, color: 0x5574bd})
      this.gfx.circle(this.boardW/2, 0, 150).
         fill({color: 0xccccff, alpha: 0.2}).stroke({width:2, color: 0x5574bd})
      this.upperShotArea = new Circle(this.boardW/2, 0, 150)
      this.lowerShotArea = new Circle(this.boardW/2, this.boardH, 150)
      
      // rack circle
      this.gfx.circle(this.boardW/2, this.boardH/2, 85).stroke({width: 1, color: 0x7A6C5D})
      this.gfx.circle(this.boardW/2, this.boardH/2, 10).fill(0x7A6C5D)

      // score markers
      this.gfx.circle(30, 30, 50).stroke({width:6, color: 0x5574bd})
      this.gfx.circle(this.boardW-30, 30, 50).stroke({width:6, color: 0x5574bd})

      this.gfx.circle(30, this.boardH/2, 50).stroke({width:6, color: 0x5574bd})
      this.gfx.circle(this.boardW-30, this.boardH/2, 50).stroke({width:6, color: 0x5574bd})

      this.gfx.circle(30, this.boardH-30, 50).stroke({width:6, color: 0x5574bd})
      this.gfx.circle(this.boardW-30, this.boardH-30, 50).stroke({width:6, color: 0x5574bd})
   }
}

class Hole extends Container {
   gfx = null

   constructor( physTop, x,y, radius) {
      super() 
      this.physTop = physTop
      this.x = x 
      this.y = y 
      this.radius = radius
      this.pivot.set(0,0)
      this.gfx = new Graphics()
      this.addChild(this.gfx)
      this.draw()
   }

   checkForSink( shape ) {
      if ( Matter.Vector.magnitude(shape.body.velocity) > 0) {
         let dX = this.x - shape.x 
         let dY = (this.y+this.physTop) - shape.y 
         let dist = Math.sqrt( dX*dX + dY*dY)
         if ( dist <= shape.radius/2 ) {
            shape.stop()
            return true
         } else if ( dist <= this.radius+(shape.radius*.25) ) { // 3/4 of the puck is over the hole before it gets pulled in
            Matter.Body.applyForce( shape.body, shape.body.position, {x:dX/5000, y:dY/5000})
         }
      }
      return false
   }

   draw() {
      this.gfx.clear() 
      this.gfx.circle(0,0,this.radius).fill(0x020202)
   }
}