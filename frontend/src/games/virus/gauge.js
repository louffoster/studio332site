import * as PIXI from "pixi.js"

export default class Gauge extends PIXI.Container {
   constructor(x, y, label, maxValue ) {
      super()
      this.x = x 
      this.y = y
      this.value = 0
      this.maxValue = maxValue

      let style = new PIXI.TextStyle({
         fill: "#cccccc",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 18,
      })
      this.label = new PIXI.Text(label, style)
      this.label.x = 0
      this.label.y = 0
      this.label.resolution = window.devicePixelRatio
      this.addChild( this.label )

      this.gfx = new PIXI.Graphics() 
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
      this.gfx.lineStyle(1, 0xaaaaaa, 1)
      this.gfx.drawRect(30,0, this.gaugeWidth, 20)

      if (this.value > 0) {
         let percent = this.value / this.maxValue
         let fillW = (this.gaugeWidth * percent)
         this.gfx.lineStyle(0,0x000000)
         this.gfx.beginFill(0x44aa55)
         this.gfx.drawRect(30,0, fillW, 20)
      }

      let sectionW = this.gaugeWidth / this.maxValue
      let sectionX = 30+sectionW
      for (let i=1; i< this.maxValue; i++) {
         this.gfx.lineStyle(1, 0xaaaaaa, 1)
         this.gfx.moveTo(sectionX, 0)
         this.gfx.lineTo(sectionX, 20)
         sectionX += sectionW
      }
   }
}