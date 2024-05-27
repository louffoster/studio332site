import { Container, Graphics, Text } from "pixi.js"

export default class Gauge extends Container {
   constructor(x, y, width ) {
      super()
      this.x = x 
      this.y = y
      this.value = 0
      this.maxValue = 100
      this.targetValue = 0

      this.gfx = new Graphics() 
      this.addChild( this.gfx )
      this.gaugeWidth = width
      this.drawGauge()
   }

   get isFull() {
      return (this.value == this.maxValue)
   }

   get enableZap() {
      return (this.value >= this.maxValue/2)
   }

   reset() {
      this.value = 0
   }

   zapUsed() {
      this.targetValue = this.value - 30
      this.targetValue = Math.max(this.targetValue, 0)
   }

   increaseValue( delta ) {
      this.targetValue = this.value + delta
      this.targetValue = Math.min(this.targetValue, this.maxValue)
   }

   drawGauge() {
      this.gfx.clear()
      this.gfx.roundRect(0,0, this.gaugeWidth, 25, 5).stroke({width:1, color:0xdbdbff})
      this.gfx.moveTo(this.gaugeWidth*0.5, 0).lineTo(this.gaugeWidth*0.5, 25).stroke({width:1, color:0x666666})

      if (this.value > 0) {
         let percent = this.value / this.maxValue
         let fillW = (this.gaugeWidth * percent)
         this.gfx.roundRect(0,0, fillW, 25, 5)
         if ( this.value < this.maxValue/2) {
            this.gfx.fill(0x9393d9)
         } else {
            this.gfx.fill(0x3aab80)
         }
      }
   }

   update(deltaMS) {
      if ( this.targetValue == 0) {
         if ( this.value != this.maxValue) {
            this.value -= (0.4 * (deltaMS/1000.0))
            this.value = Math.max(0, this.value)
         }
      } else {
         if ( this.value > this.targetValue ) {
            this.value -= (50 * (deltaMS/1000.0))
            this.value = Math.max(this.value, this.targetValue)
         } else {
            this.value += (25 * (deltaMS/1000.0))
            this.value = Math.min(this.value, this.targetValue)
         }
         if (this.value == this.targetValue ) {
            this.targetValue = 0
         }
      }

      this.drawGauge() 
   }
}