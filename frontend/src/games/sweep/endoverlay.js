import * as PIXI from "pixi.js"
import Button from "@/games/common/button"

export default class EndOverlay extends PIXI.Container {
   constructor(replayHandler, backHandler) {
      super()

      this.x = 35 
      this.y = 80
      this.popupW = 300
      this.popupH = 200
      this.replayHandler = replayHandler
      this.backHandler = backHandler

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(6, 0xADE8F4, 1)
      this.graphics.beginFill(0x23E8A)
      this.graphics.drawRect(0,0, this.popupW, this.popupH)
      this.graphics.endFill()
      this.graphics.lineStyle(1, 0x03045E, 1)
      this.graphics.drawRect(0,0, this.popupW, this.popupH)

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

      this.msg = new PIXI.Text(`GAME OVER`, style)
      this.msg.anchor.set(0.5, 0.5)
      this.msg.x = this.popupW / 2
      this.msg.y = 35

      this.addChild(this.graphics)
      this.graphics.addChild(this.msg)

      let againBtn = new Button( 150, 90, "Play Again", replayHandler, 
         0xCAF0F8,0x0077B6,0x48CAE4)
      this.addChild(againBtn)

      let backBtn = new Button( 150, 150, "Back to Studio332", backHandler, 
         0xCAF0F8,0x0077B6,0x48CAE4)
      this.addChild(backBtn)
   }

   
}