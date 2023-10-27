import * as PIXI from "pixi.js"
import Button from "@/games/common/button"


export default class EndOverlay extends PIXI.Container {
   constructor(replayHandler, backHandler) {
      super()

      this.x = 10 
      this.y = 100
      this.popupW = 340
      this.popupH = 200

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


      this.heading = new PIXI.Text(`GAME OVER`, style)
      this.heading.anchor.set(0.5, 0.5)
      this.heading.x = this.popupW / 2
      this.heading.y = 40

      this.addChild( this.graphics )
      this.addChild( this.heading )
      
      let againBtn = new Button( this.popupW / 2, 105, "Play Again", replayHandler)
      this.addChild(againBtn)
      let backBtn = new Button( this.popupW / 2, 160, "Back to Studio332 Site", backHandler)
      this.addChild(backBtn)
   }
}
// LIGHT: #514c49
// DARK: #464340