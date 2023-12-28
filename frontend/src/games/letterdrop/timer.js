import * as PIXI from "pixi.js"

export default class Timer extends PIXI.Container {
   static SPEEDUP_DELAY_MS = 20 * 1000 // ow often to get faster
   static RATE_INCREASE = 0.09         // timer rate increases by this much
   static MAX_RATE = 20.0              // 5 second countdown is the fastest

   constructor(x, y, w, h ) {
      super()
      this.x = x 
      this.y = y
      this.meterW = w 
      this.meterH = h
      this.percent = 100
      this.percentPerSec = 6.5 // 15ish secs to empty
      this.speedUpDelayMS = Timer.SPEEDUP_DELAY_MS
      this.maxRateHit = false

      this.gfx = new PIXI.Graphics() 
      this.addChild( this.gfx )

      this.draw()
   }

   reset() {
      this.percent = 100
   }

   setTimeoutHandler( handler ) {
      this.timeoutHandler = handler
   }

   draw() {
      this.gfx.clear()
      this.gfx.lineStyle(1, 0x2E4347, 1)
      this.gfx.beginFill(0x4E6367)
      this.gfx.drawRect(0,0, this.meterW, this.meterH)
      this.gfx.endFill()

      if ( this.percent > 0) {
         let emptyH = this.percent/100.0*this.meterH
         this.gfx.beginFill(0x75c482)
         this.gfx.lineStyle(1, 0x75c482, 1)
         if ( this.percent < 25) {
            this.gfx.beginFill(0xc68da3)
            this.gfx.lineStyle(1, 0xc68da3, 1)
         } else if ( this.percent < 50 ) {
            this.gfx.beginFill(0xdfd689)
            this.gfx.lineStyle(1, 0xdfd689, 1)
         }
         this.gfx.drawRect(1,this.meterH-emptyH, this.meterW-2, emptyH-1)
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