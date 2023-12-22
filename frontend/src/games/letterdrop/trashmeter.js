import * as PIXI from "pixi.js"

export default class TrashMeter extends PIXI.Container {
   constructor(x, y, w, h ) {
      super()
      this.x = x 
      this.y = y
      this.meterW = w 
      this.meterH = h
      this.value = 0
      this.maxValue = 5

      this.gfx = new PIXI.Graphics() 
      this.addChild( this.gfx )
      this.drawGauge()
   }

   isFull() {
      return (this.value == this.maxValue)
   }

   reset() {
      this.value = 0
   }

   increaseValue() {
      this.value++
      this.value = Math.min(this.value, this.maxValue)
      this.drawGauge()
   }

   drawGauge() {
      this.gfx.clear()
      this.gfx.lineStyle(1, 0x2E4347, 1)
      this.gfx.beginFill(0x6E8387)
      this.gfx.drawRect(0,0, this.meterW, this.meterH)
      this.gfx.endFill()

      if (this.value > 0) {
         let percent = this.value / this.maxValue
         let fillH = (this.meterH * percent)
         this.gfx.lineStyle(0,0x2E4347)
         this.gfx.beginFill(0x759eb8)
         this.gfx.drawRect(0, this.meterH-fillH, this.meterW, fillH)
         this.gfx.endFill()
      }
   }
}