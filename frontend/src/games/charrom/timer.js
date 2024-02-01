import * as PIXI from "pixi.js"
export default class Timer extends PIXI.Container {
   meterW = 0
   meterH = 0 
   percent = 100
   percentPerSec = 3.25 // 30 secs

   constructor(x, y, w, h ) {
      super()
      this.x = x 
      this.y = y
      this.meterW = w 
      this.meterH = h
   
      this.gfx = new PIXI.Graphics() 
      this.addChild( this.gfx )

      this.draw()
   }

   reset() {
      this.percent = 100
   }
   puckSunk() {
      this.percent += 15
      this.percent = Math.min(this.percent, 100.0)
   }

   setTimeoutHandler( handler ) {
      this.timeoutHandler = handler
   }

   draw() {
      this.gfx.clear()
      this.gfx.lineStyle( 2, 0x5E3023, 1 )
      this.gfx.beginFill(0x2A3D45)
      this.gfx.drawRect(0,0, this.meterW, this.meterH)
      this.gfx.endFill()

      if ( this.percent > 0) {
         let emptyW = this.percent/100.0*this.meterW
         this.gfx.beginFill(0x75c482)
         this.gfx.lineStyle(1, 0x75c482, 1)
         if ( this.percent < 25) {
            this.gfx.beginFill(0xc68da3)
            this.gfx.lineStyle(1, 0xc68da3, 1)
         } else if ( this.percent < 50 ) {
            this.gfx.beginFill(0xdfd689)
            this.gfx.lineStyle(1, 0xdfd689, 1)
         }
         this.gfx.drawRect(this.meterW-emptyW+1,1, emptyW-1, this.meterH-2)
         this.gfx.endFill()
      }
   }

   tick(deltaMS) {
      if ( this.percent > 0) {
         let delta = this.percentPerSec * (deltaMS/1000.0)
         this.percent -= delta
         if ( this.percent <= 0) {
            this.percent = 0 
            this.timeoutHandler()
         }
         this.draw()
      }
   }
}