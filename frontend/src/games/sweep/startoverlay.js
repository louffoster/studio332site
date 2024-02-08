import * as PIXI from "pixi.js"
import Button from "@/games/common/button"

export default class StartOverlay extends PIXI.Container {
   constructor(startHandler) {
      super()

      this.x = 5 
      this.y = 372
      this.startCallback = startHandler
      this.panelW = 360
      this.panelH = 182

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(6, 0xADE8F4, 1)
      this.graphics.beginFill(0x23E8A)
      this.graphics.drawRect(0,0, this.panelW, this.panelH)
      this.graphics.endFill()
      this.graphics.lineStyle(1, 0x03045E, 1)
      this.graphics.drawRect(0,0, this.panelW, this.panelH)

      let style = new PIXI.TextStyle({
         fill: "#CAF0F8",
         fontFamily: "Arial",
         fontSize: 18,
         wordWrap: true,
         lineHeight: 18,
         wordWrapWidth: this.panelW - 40,
         dropShadow: true,
         dropShadowColor: '#000000',
         dropShadowBlur: 2,
         dropShadowDistance: 1,
         align: "center"
      })

      let msg = "Clear the board by creating words with 4 to 10 letters. "
      msg += "You will get to choose 3 letters to help with this goal."
      let txt = new PIXI.Text(msg, style)
      txt.anchor.set(0.5, 0)
      txt.x = this.panelW/2
      txt.y = 15

      this.addChild(this.graphics)
      this.graphics.addChild(txt)

      this.msg = new PIXI.Text(`Initializing...`, style)
      this.msg .anchor.set(0.5, 0)
      this.msg .x = this.panelW/2
      this.msg .y = 105
      this.addChild(this.msg )

      this.addStartButton()
   }

   addStartButton() {
      let advButton = new Button( this.panelW/2, 130, "Pick Helper Letters", () => {
         this.startCallback()
      }, 0xCAF0F8,0x0077B6,0x48CAE4)
      this.addChild(advButton)
      this.removeChild(this.msg)
   }
}