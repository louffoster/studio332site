import { Container, Graphics } from "pixi.js"

export default class TrashMeter extends Container {
   constructor(x, y, w, h ) {
      super()
      this.x = x 
      this.y = y
      this.meterW = w 
      this.meterH = h
      this.value = 0
      this.maxValue = 5

      this.gfx = new Graphics() 
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

   canTrash( letterCount ) {
      return (this.value + letterCount <= this.maxValue)
   }

   drawGauge() {
      this.gfx.clear()
      this.gfx.rect(0,0, this.meterW, this.meterH). 
         stroke({width: 1, color: 0x2E4347, alpha: 1}). 
         fill( 0x6E8387 )

      if (this.value > 0) {
         let percent = this.value / this.maxValue
         let fillH = (this.meterH * percent)
         this.gfx.rect(0, this.meterH-fillH, this.meterW, fillH).fill(0x759eb8)
      }
   }
}