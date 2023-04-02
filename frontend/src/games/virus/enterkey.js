import * as PIXI from "pixi.js"

export default class EnterKey extends PIXI.Container {
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
      this.graphics.hitArea = new PIXI.Rectangle(0,0,60,35)
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