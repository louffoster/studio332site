import { Container, Graphics, Text } from "pixi.js"

export default class Gauge extends Container {
   constructor(x, y, label, maxValue ) {
      super()
      this.x = x 
      this.y = y
      this.value = 0
      this.maxValue = maxValue

      let gaugeLabel = new Text({text: label, style: {
         fill: "#cccccc",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 18,
      }})
      gaugeLabel.x = 0
      gaugeLabel.y = 0
      gaugeLabel.resolution = window.devicePixelRatio
      this.addChild( gaugeLabel )

      this.gfx = new Graphics() 
      this.addChild( this.gfx )
      this.gaugeWidth = 290
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
      this.gfx.rect(30,0, this.gaugeWidth, 20).stroke({width:1, color:0xaaaaaa})

      if (this.value > 0) {
         let percent = this.value / this.maxValue
         let fillW = (this.gaugeWidth * percent)
         this.gfx.rect(30,0, fillW, 20).fill(0x44aa55)
      }

      let sectionW = this.gaugeWidth / this.maxValue
      let sectionX = 30+sectionW
      for (let i=1; i< this.maxValue; i++) {
         this.gfx.moveTo(sectionX, 0).lineTo(sectionX, 20).stroke({width: 1, color: 0xaaaaaa})
         sectionX += sectionW
      }
   }
}