import * as PIXI from "pixi.js"

export default class EndOverlay extends PIXI.Container {
   constructor(replayHandler, backHandler) {
      super()

      this.x = 10 
      this.y = 100
      this.popupW = 340
      this.popupH = 200
      this.replayHandler = replayHandler
      this.backHandler = backHandler


      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(6, 0x80D3E1, 1)
      this.graphics.beginFill(0x34565c)
      this.graphics.drawRect(0,0, this.popupW, this.popupH )
      this.graphics.endFill()
      this.graphics.lineStyle(2, 0x333333, 1)
      this.graphics.drawRect(0,0, this.popupW, this.popupH )

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
      btnTxt.x = this.popupW / 2
      btnTxt.y = 105
      btnTxt.eventMode = 'static' 
      btnTxt.cursor ="pointer"
      btnTxt.hitArea = new PIXI.Rectangle(-70, -20, this.btnWidth, this.btnHeight)
      this.graphics.addChild(btnTxt)
      btnTxt.on('pointerup', this.replayHandler, this)

      let backTxt = new PIXI.Text("Back to Studio332 Site", style)
      backTxt.anchor.set(0.5, 0.5)
      backTxt.x = this.popupW / 2
      backTxt.y = 160
      backTxt.eventMode = 'static' 
      backTxt.cursor ="pointer"
      this.graphics.addChild(backTxt)
      backTxt.on('click', this.backHandler, this)
   }
}
// LIGHT: #514c49
// DARK: #464340