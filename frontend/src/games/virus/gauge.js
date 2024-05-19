import { Container, Graphics, Text } from "pixi.js"

export default class Gauge extends Container {
   constructor(x, y, width ) {
      super()
      this.x = x 
      this.y = y
      this.value = 0
      this.maxValue = 100

      this.gfx = new Graphics() 
      this.addChild( this.gfx )
      this.gaugeWidth = width
      this.drawGauge()
   }

   get isFull() {
      return (this.value == this.maxValue)
   }

   reset() {
      this.value = 0
   }

   increaseValue( delta ) {
      this.value+= delta
      this.value = Math.min(this.value, this.maxValue)
      this.drawGauge()
   }

   drawGauge() {
      this.gfx.clear()
      this.gfx.roundRect(0,0, this.gaugeWidth, 25, 20).stroke({width:1, color:0xdbdbff})

      if (this.value > 0) {
         let percent = this.value / this.maxValue
         let fillW = (this.gaugeWidth * percent)
         this.gfx.roundRect(0,0, fillW, 25, 20).fill(0x9393d9)
      }
   }
}