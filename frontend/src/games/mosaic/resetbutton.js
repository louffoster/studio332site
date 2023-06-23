import * as PIXI from "pixi.js"

export default class ResetButton extends PIXI.Container {
   constructor( x,y, listener) {
      super()

      this.x = x
      this.y = y
      this.btnWidth = 166
      this.btnHeight = 41

      this.eventMode = 'static'
      this.pointerDown = false
      this.on('pointerdown', this.handlePointerDown)
      this.on('pointerup', this.clickHandler)
      this.hitArea = new PIXI.Rectangle(0,0, this.btnWidth, this.btnHeight)
      this.cursor ="pointer"
      this.clickListener = listener

      this.graphics = new PIXI.Graphics()
      this.drawButton()

      let style = new PIXI.TextStyle({
         fill: "#ffffff",
         fontFamily: "Arial",
         fontSize: 18,
         fontWeight: "bold",
         dropShadow: true,
         dropShadowColor: '#000000',
         dropShadowBlur: 2,
         dropShadowDistance: 1,
         align: "center"
      })
      let btnTxt = new PIXI.Text("Reset Tiles", style)
      btnTxt.anchor.set(0.5, 0.5)
      btnTxt.x = 82
      btnTxt.y = 22

      this.addChild(this.graphics)
      this.graphics.addChild(btnTxt)
   }

   drawButton() {
      this.graphics.clear()
      this.graphics.lineStyle(1, 0x333333, 1)
      this.graphics.beginFill(0x33aabf)
      if ( this.pointerDown) {
         this.graphics.beginFill(0x44bbcf)
      }
      this.graphics.drawRect(0,0, this.btnWidth, this.btnHeight)
   }

   handlePointerDown() {
      this.pointerDown = true 
      this.drawButton()
   }

   clickHandler() {
      this.pointerDown = false 
      this.drawButton()   
      this.clickListener()
   }
}