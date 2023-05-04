import * as PIXI from "pixi.js"

export default class DeleteKey extends PIXI.Container {
   constructor( x,y, listener) {
      super()

      this.x = x
      this.y = y
      this.btnWidth = 50
      this.btnHeight = 35
      this.enabled = false

      this.eventMode = 'static'
      this.pointerDown = false
      this.on('pointerdown', this.handlePointerDown)
      this.on('pointerup', this.clickHandler)
      this.hitArea = new PIXI.Rectangle(0,0, this.btnWidth, this.btnHeight)
      this.cursor = "pointer"
      this.clickListener = listener

      let style = new PIXI.TextStyle({
         fill: "#cccccc",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 16,
      })
      this.btnTxt = new PIXI.Text("DEL", style)
      this.btnTxt.anchor.set(0.5, 0.5)
      this.btnTxt.x = 25
      this.btnTxt.y = 17

      this.graphics = new PIXI.Graphics()
      this.drawButton()

      this.addChild(this.graphics)
      this.graphics.addChild(this.btnTxt)
   }

   setEnabled( flag ) {
      this.enabled = flag
      this.drawButton()
   }

   drawButton() {
      this.graphics.clear()
      this.graphics.lineStyle(1, 0xcccccc, 1)
      this.btnTxt.style.fill = 0xcccccc
      let fill = 0x445577
      if ( this.enabled == false ) {
         fill = 0x444a66
         this.graphics.lineStyle(1, 0x666666, 1)
         this.btnTxt.style.fill = 0x666666
      }
      this.graphics.beginFill(fill)
      if ( this.pointerDown) {
         this.graphics.beginFill(0x77aaff)
      }

      this.graphics.drawRect(0,0, this.btnWidth, this.btnHeight)
      if ( this.pointerDown) {
         this.graphics.lineStyle(1, 0x333333, 1)
      }
   }

   handlePointerDown() {
      if ( this.enabled ) {
         this.pointerDown = true 
         this.drawButton()
      }
   }

   clickHandler() {
      if ( this.enabled ) {
         this.pointerDown = false 
         this.drawButton()   
         this.clickListener()
      }
   }
}