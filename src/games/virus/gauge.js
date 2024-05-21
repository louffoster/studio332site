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

   get enableZap() {
      return (this.value >= this.maxValue/2)
   }

   reset() {
      this.value = 0
   }

   zapUsed() {
      this.value -= 30
      this.value = Math.max(this.value, 0)
      this.drawGauge()  
   }

   increaseValue( delta ) {
      this.value+= delta
      this.value = Math.min(this.value, this.maxValue)
      this.drawGauge()
   }

   drawGauge() {
      this.gfx.clear()
      this.gfx.roundRect(0,0, this.gaugeWidth, 25, 20).stroke({width:1, color:0xdbdbff})
      this.gfx.moveTo(this.gaugeWidth*0.5, 0).lineTo(this.gaugeWidth*0.5, 25).stroke({width:1, color:0x666666})

      if (this.value > 0) {
         let percent = this.value / this.maxValue
         let fillW = (this.gaugeWidth * percent)
         this.gfx.roundRect(0,0, fillW, 25, 20)
         if ( this.value < this.maxValue/2) {
            this.gfx.fill(0x9393d9)
         } else {
            this.gfx.fill(0x3aab80)
         }
      }
   }
}