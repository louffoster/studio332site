import { Container, Graphics} from "pixi.js"

export default class ShotIndicator extends Container {
   gfx = null
   arrowLength = 150
   pointWidth = 20

   constructor() {
      super() 
      this.gfx = new Graphics() 
      this.pivot.set(this.pointWidth/2.0, 0)
      this.addChild(this.gfx)
      this.draw()
   }

   place( x, y ) {
      this.x = x 
      this.y = y 
      this.angle = 180
      this.power = 0
   }

   setRotation( deg ) {
      this.angle = deg -90
   }

   setPullbackDistance( dist ) {
      if ( dist >= this.arrowLength) {
         this.power = 1.0
      } else {
         this.power = dist / this.arrowLength
      }
      this.draw()
   }

   draw() {
      this.gfx.clear() 
      this.gfx.alpha = 0.6

      // start circle and box for pwer meter
      this.gfx.circle(this.pointWidth/2.0, 0, 10).
         fill(0xF3E9DC).stroke({width:1, color: 0x2A3D45 })
      this.gfx.rect(this.pointWidth/2.0-3, 0, 6, this.arrowLength). 
         fill(0xF3E9DC).stroke({width:1, color: 0x2A3D45 })

      this.gfx.rect(this.pointWidth/2.0-2, 0, 4, this.arrowLength* this.power).fill(0x0e9594)
      
      const pts = [
         {x: this.pointWidth/2.0, y:this.arrowLength+10 }, 
         {x: this.pointWidth, y: this.arrowLength}, 
         {x: 0, y: this.arrowLength}
      ]
      this.gfx.poly(pts).fill(0x2A3D45)
   }
}