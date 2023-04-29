import * as PIXI from "pixi.js"

export default class ShuttleKey extends PIXI.Container {
   constructor( x,y, listener) {
      super()

      this.x = x
      this.y = y
      this.btnWidth = 150
      this.btnHeight = 30

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
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 16,
      })
      let btnTxt = new PIXI.Text("Randomize", style)
      btnTxt.anchor.set(0.5, 0.5)
      btnTxt.x = 75
      btnTxt.y = 16

      this.addChild(this.graphics)
      this.graphics.addChild(btnTxt)
   }

   drawButton() {
      this.graphics.clear()
      this.graphics.lineStyle(1, 0xcccccc, 1)
      this.graphics.beginFill(0x445577)
      if ( this.pointerDown) {
         this.graphics.beginFill(0x77aaff)
      }
      this.graphics.drawRect(0,0, this.btnWidth, this.btnHeight)
      if ( this.pointerDown) {
         this.graphics.lineStyle(1, 0x333333, 1)
      }
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