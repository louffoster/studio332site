import * as PIXI from "pixi.js"

export default class ShotIndicator extends PIXI.Container {
   gfx = null
   arrowLength = 150
   pointWidth = 20

   constructor() {
      super() 
      this.gfx = new PIXI.Graphics() 
      this.pivot.set(this.pointWidth/2.0, 0)
      this.addChild(this.gfx)
      this.draw()
      this.visible = false
   }

   place( x, y ) {
      this.x = x 
      this.y = y 
      this.angle = 180
      this.visible = true
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

   hide() {
      this.visible = 0
   }

   draw() {
      this.gfx.clear() 
      this.gfx.lineStyle(1, 0x2A3D45, 1)
      this.gfx.beginFill( 0xF3E9DC )
      this.gfx.drawRect(this.pointWidth/2.0-3, 0, 6, this.arrowLength)

      this.gfx.lineStyle(0, 0x2A3D45, 1)
      this.gfx.beginFill( 0x0e9594 )
      this.gfx.drawRect(this.pointWidth/2.0-2, 0, 4, this.arrowLength* this.power)
      
      this.gfx.beginFill( 0x2A3D45 )
      this.gfx.moveTo(this.pointWidth/2.0, this.arrowLength+10)
      this.gfx.lineTo(this.pointWidth, this.arrowLength)
      this.gfx.lineTo(0, this.arrowLength)
      this.gfx.closePath()
      this.gfx.endFill()
   }
}