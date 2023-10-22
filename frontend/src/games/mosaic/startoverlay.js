import * as PIXI from "pixi.js"
import Button from "@/games/common/button"

export default class StartOverlay extends PIXI.Container {
   constructor(startTimeMS, startHandler) {
      super()

      this.x = 10 
      this.y = 55
      this.startCallback = startHandler
      this.panelW = 340
      this.panelH = 250

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(6, 0x80D3E1, 1)
      this.graphics.beginFill(0x34565c)
      this.graphics.drawRect(0,0, this.panelW, this.panelH)
      this.graphics.endFill()
      this.graphics.lineStyle(2, 0x333333, 1)
      this.graphics.drawRect(0,0, this.panelW, this.panelH)

      let style = new PIXI.TextStyle({
         fill: "#f0f0ff",
         fontFamily: "Arial",
         fontSize: 20,
         wordWrap: true,
         fontWeight: 'bold',
         wordWrapWidth: this.panelW - 20,
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
      this.msg.anchor.set(0.5,0.5)
      this.msg.x = this.panelW/2
      this.msg.y = 40

      this.addChild(this.graphics)
      this.graphics.addChild(this.msg)

      let note1 = new PIXI.Text(`Standard mode uses two colors`, style)
      note1.anchor.set(0.5,0.5)
      note1.x = this.panelW/2
      note1.y = 100
      this.graphics.addChild(note1)
      let note2 = new PIXI.Text(`Advanced mode uses three`, style)
      note2.anchor.set(0.5,0.5)
      note2.x = this.panelW/2
      note2.y = 130
      this.graphics.addChild(note2)

      let stdButton = new Button( 50, 180, "Standard", () => {
         startHandler("standard")
      })
      stdButton.alignTopLeft()
      this.addChild(stdButton)

      let advButton = new Button( 180, 180, "Advanced", () => {
         startHandler("advanced")
      })
      advButton.alignTopLeft()
      this.addChild(advButton)
   }
}