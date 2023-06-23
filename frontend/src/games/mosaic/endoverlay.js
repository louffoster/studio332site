import * as PIXI from "pixi.js"

export default class EndOverlay extends PIXI.Container {
   constructor(replayHandler) {
      super()

      this.x = 10 
      this.y = 100
      this.popupW = 340
      this.replayHandler = replayHandler

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


      this.msg = new PIXI.Text(`GAME OVER`, style)
      this.msg.anchor.set(0.5, 0.5)
      this.msg.x = this.popupW / 2
      this.msg.y = 40

      this.addChild(this.graphics)
      this.graphics.addChild(this.msg)
      this.addStartButton()
   }

   addStartButton() {
      this.btnWidth = 150 
      this.btnHeight = 40
      this.btnX = (this.popupW - this.btnWidth) / 2.0
      this.btnY = 85
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
      let btnTxt = new PIXI.Text("Play Again", style)
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
      this.replayHandler()
   }
}