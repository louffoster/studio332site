import * as PIXI from "pixi.js"

export default class Button extends PIXI.Container {
   constructor( x,y, txt, listener, txtColor="white", btnColor=0x33aabf, highlight=0x44bbcf) {
      super()

      this.x = x
      this.y = y
      this.btnColor = new PIXI.Color(btnColor)
      this.highlight = new PIXI.Color(highlight)
      this.txtColor = new PIXI.Color(txtColor)

      let style = new PIXI.TextStyle({
         fill: this.txtColor,
         fontFamily: "Arial",
         fontSize: 18,
         fontWeight: "bold",
         dropShadow: true,
         dropShadowColor: '#000000',
         dropShadowBlur: 2,
         dropShadowDistance: 1,
         align: "center"
      })

      let btnTxt = new PIXI.Text(txt, style)
      this.btnWidth = btnTxt.width + 40
      this.btnHeight = btnTxt.height + 20

      btnTxt.anchor.set(0.5, 0.5)
      btnTxt.x = this.btnWidth / 2.0
      btnTxt.y = this.btnHeight / 2.0

      this.eventMode = 'static'
      this.pointerDown = false
      this.on('pointerdown', this.handlePointerDown)
      this.on('pointerup', this.clickHandler)
      this.hitArea = new PIXI.Rectangle(0,0, this.btnWidth, this.btnHeight)
      this.cursor ="pointer"
      this.clickListener = listener

      this.graphics = new PIXI.Graphics()
      this.drawButton()

      this.addChild(this.graphics)
      this.graphics.addChild(btnTxt)
   }

   drawButton() {
      this.graphics.clear()
      this.graphics.lineStyle(1, this.txtColor, 1)
      this.graphics.beginFill( this.btnColor.toHex() )
      if ( this.pointerDown) {
         this.graphics.beginFill( this.highlight.toHex())// 0x44bbcf)
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