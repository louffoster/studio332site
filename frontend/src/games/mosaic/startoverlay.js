import * as PIXI from "pixi.js"

export default class StartOverlay extends PIXI.Container {
   constructor(startTimeMS, startHandler) {
      super()

      this.x = 10 
      this.y = 100
      this.startCallback = startHandler

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(6, 0x80D3E1, 1)
      this.graphics.beginFill(0x34565c)
      this.graphics.drawRect(0,0, 340,150)
      this.graphics.endFill()
      this.graphics.lineStyle(2, 0x333333, 1)
      this.graphics.drawRect(0,0, 340,150)

      let style = new PIXI.TextStyle({
         fill: "#f0f0ff",
         fontFamily: "Arial",
         fontSize: 20,
         wordWrap: true,
         fontWeight: 'bold',
         wordWrapWidth: 330,
         dropShadow: true,
         dropShadowColor: '#000000',
         dropShadowBlur: 2,
         dropShadowDistance: 1,
         align: "center"
      })

      let secs = startTimeMS / 1000
      let mins = Math.floor(secs / 60)
      if ( mins > 0) {
         secs = secs - mins*60
      }
      let timeStr = `${mins}`.padStart(2,"0")+":"+`${secs}`.padStart(2,"0")

      this.msg = new PIXI.Text(`Match as many patterns as possible in ${timeStr}`, style)
      // this.msg.anchor.set(0.5)
      this.msg.x = 40
      this.msg.y = 26

      this.addChild(this.graphics)
      this.graphics.addChild(this.msg)
      this.addStartButton()
   }

   addStartButton() {
      this.btnX = 120 
      this.btnY = 85
      this.btnWidth = 100 
      this.btnHeight = 40
      this.graphics.cursor = "pointer"
      this.graphics.eventMode = 'static' 
      this.graphics.hitArea = new PIXI.Rectangle(this.btnX, this.btnY, this.btnWidth, this.btnHeight)

      this.graphics.lineStyle(2, 0x333333, 1)
      this.graphics.beginFill(0x33aabf)
      this.graphics.drawRect(this.btnX, this.btnY, this.btnWidth, this.btnHeight)
      this.graphics.endFill()
      let style = new PIXI.TextStyle({
         fill: "#f0f0ff",
         fontFamily: "Arial",
         fontSize: 18,
         fontWeight: "bold",
         dropShadow: true,
         dropShadowColor: '#000000',
         dropShadowBlur: 2,
         dropShadowDistance: 1,
         align: "center"
      })
      let btnTxt = new PIXI.Text("Begin", style)
      btnTxt.anchor.set(0.5, 0.5)
      btnTxt.x = 170
      btnTxt.y = 105
      this.graphics.addChild(btnTxt)

      // add the this param as context for the click event. If not, any reference
      // to click in the clickHandler will bet to the txt or graphics, not the overlay class
      this.graphics.on('pointerup', this.clickHandler, this) 
      btnTxt.on('pointerup', this.clickHandler, this)
   }

   clickHandler() {
      this.startCallback()
   }
}