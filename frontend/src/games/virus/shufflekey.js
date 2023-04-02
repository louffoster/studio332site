import * as PIXI from "pixi.js"

export default class ShuttleKey extends PIXI.Container {
   constructor( x,y, listener) {
      super()
      this.eventMode = 'static'
      this.pointerDown = false
      this.on('pointerdown', this.handlePointerDown)
      this.on('pointerup', this.clickHandler)
      this.clickListener = listener
      this.x = x
      this.y = y
      this.graphics = new PIXI.Graphics()
      this.graphics.eventMode = 'static' 
      this.graphics.hitArea = new PIXI.Rectangle(0,0,75,25)
      this.graphics.cursor ="pointer"
      this.drawButton()
      this.addChild(this.graphics)
   }

   drawButton() {
      this.graphics.clear()
      this.graphics.lineStyle(1, 0xcccccc, 1)
      this.graphics.beginFill(0x445577)
      if ( this.pointerDown) {
         this.graphics.beginFill(0x77aaff)
      }
      this.graphics.drawRect(0,0, 50,35)
      if ( this.pointerDown) {
         this.graphics.lineStyle(1, 0x333333, 1)
      }
      this.graphics.moveTo(10,10)
      this.graphics.lineTo(20,10)
      this.graphics.lineTo(40,25)
      this.graphics.lineTo(35,25)
      this.graphics.moveTo(40,25)
      this.graphics.lineTo(40,20)

      this.graphics.moveTo(10,25)
      this.graphics.lineTo(20,25)
      this.graphics.lineTo(40,10)

      this.graphics.lineTo(35,10)
      this.graphics.moveTo(40,10)
      this.graphics.lineTo(40,15)
 
      this.graphics.eventMode = 'static' 
      this.graphics.hitArea = new PIXI.Rectangle(0,0,50,35)
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