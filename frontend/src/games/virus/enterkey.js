import * as PIXI from "pixi.js"

export default class EnterKey extends PIXI.Container {
   constructor( x,y, listener) {
      super()

      this.x = x
      this.y = y
      this.btnWidth = 60 
      this.btnHeight = 35
      this.enabled = false

      this.eventMode = 'static'
      this.pointerDown = false
      this.on('pointerdown', this.handlePointerDown)
      this.on('pointerup', this.clickHandler)
      this.clickListener = listener
      this.hitArea = new PIXI.Rectangle(0,0, this.btnWidth, this.btnHeight)
      this.cursor ="pointer"

      this.graphics = new PIXI.Graphics()
      this.drawButton()
      this.addChild(this.graphics)
   }

   setEnabled( flag ) {
      this.enabled = flag
      this.drawButton()
   }

   drawButton() {
      this.graphics.clear()
      this.graphics.lineStyle(1, 0xcccccc, 1)
      let fill = 0x445577
      if ( this.enabled == false ) {
         fill = 0x444a66
         this.graphics.lineStyle(1, 0x666666, 1)
      }
      this.graphics.beginFill(fill)
      if ( this.pointerDown) {
         this.graphics.beginFill(0x77aaff)
      }
      this.graphics.drawRect(0,0, 60,35)
      if ( this.pointerDown) {
         this.graphics.lineStyle(1, 0x333333, 1)
      }
      this.graphics.moveTo(10,20)
      this.graphics.lineTo(50,20)
      this.graphics.lineTo(50,10)
      this.graphics.moveTo(10,20)
      this.graphics.lineTo(25,14)
      this.graphics.moveTo(10,20)
      this.graphics.lineTo(25,26)  
      this.graphics.eventMode = 'static'
      this.graphics.hitArea = new PIXI.Rectangle(0,0, this.btnWidth, this.btnHeight)
   }

   handlePointerDown() {
      if ( this.enabled ) {
         this.pointerDown = true 
         this.drawButton()
      }
   }

   clickHandler() {
      if ( this.enabled ) {
         this.clickListener()
      }
   }

   wordSubmitted() {
      this.pointerDown = false
      this.drawButton()   
   }
}