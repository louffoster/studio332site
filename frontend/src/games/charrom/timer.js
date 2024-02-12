import * as PIXI from "pixi.js"
export default class Timer extends PIXI.Container {
   static SPEEDUP_DELAY_MS = 60 * 1000    // how often to get faster
   static RATE_INCREASE = 0.15            // timer rate increases by this much
   static MAX_RATE = 5.0                  // 5 second countdown is the fastest

   meterW = 0
   meterH = 0 
   percent = 100
   percentPerSec = 1.75 // minute ish
   speedUpDelayMS = Timer.SPEEDUP_DELAY_MS
   maxRateHit = false

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
      this.percent += 20
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

      if ( this.maxRateHit == false) {
         this.speedUpDelayMS -= deltaMS 
         if ( this.speedUpDelayMS <= 0) {
            this.speedUpDelayMS = Timer.SPEEDUP_DELAY_MS
            this.percentPerSec += Timer.RATE_INCREASE 
            if (this.percentPerSec >= Timer.MAX_RATE) {
               this.maxRateHit = true
               this.percentPerSec = Timer.MAX_RATE
            }
         }
      }
   }
}