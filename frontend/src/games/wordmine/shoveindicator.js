import { Container, Graphics} from "pixi.js"

export default class ShoveIndicator extends Container {
   gfx = null
   arrowLength = 75
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
   }

   setRotation( deg ) {
      this.angle = deg -90
   }

   draw() {
      this.gfx.clear() 

      // start circle and box for pwer meter
      this.gfx.rect(this.pointWidth/2.0-3, 0, 6, this.arrowLength). 
         fill(0xF3E9DC).stroke({width:1, color: 0x333333 })
      
      const pts = [
         {x: this.pointWidth/2.0, y:this.arrowLength+10 }, 
         {x: this.pointWidth, y: this.arrowLength}, 
         {x: 0, y: this.arrowLength}
      ]
      this.gfx.poly(pts).fill(0xF3E9DC).stroke({width:1, color: 0x333333 })
      this.gfx.circle(this.pointWidth/2.0, 0, 10).
         fill(0xF3E9DC).stroke({width:1, color: 0x333333 })
   }
}