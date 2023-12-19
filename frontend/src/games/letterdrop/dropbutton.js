import * as PIXI from "pixi.js"

export default class DropButton extends PIXI.Container {
   disabled = false 
   btnW = 60 
   btnH = 45
   pointerDown = false
   symbolColor = new PIXI.Color(0xbbcde5)
   buttonColor = new PIXI.Color(0x759eb8)
   highlightColor = new PIXI.Color(0x95bed8)
   trashIcon = false

   constructor( x,y, listener) {
      super()

      this.disabled = false
      this.x = x
      this.y = y

      this.eventMode = 'static'
      this.pointerDown = false
      this.on('pointerdown', () => {
         if ( this.disabled == false ) {
            this.pointerDown = true 
            this.drawButton()
         }
      })
      this.on('pointerup', () => {
         if (this.disabled == false) {
            this.pointerDown = false 
            this.drawButton()   
            listener()
         }
      })
      this.hitArea = new PIXI.Rectangle(0,0, this.btnW, this.btnH)
      this.cursor ="pointer"

      this.graphics = new PIXI.Graphics()
      this.drawButton()

      this.addChild(this.graphics)
   }

   useTrashIcon() {
      this.trashIcon = true
      this.buttonColor =  new PIXI.Color(0x957186) //0xFCFAFA,0x9c5060,0x5482bc
      this.highlightColor =  new PIXI.Color(0xa58196)
      this.symbolColor = new PIXI.Color(0xc57186)
      this.drawButton()
   }

   drawButton() {
      this.graphics.clear()
      let alpha = 1.0 
      if ( this.disabled) {
         alpha = 0.4
      }
      this.graphics.lineStyle(1, 0x2E4347)
      if ( this.pointerDown) {
         this.graphics.beginFill( this.highlightColor )
      } else {
         this.graphics.beginFill( this.buttonColor, alpha )
      }
      this.graphics.drawRect(0,0, this.btnW, this.btnH)
      this.graphics.endFill()

      if ( this.trashIcon ) {
         this.graphics.beginFill( this.symbolColor, alpha )
         this.graphics.lineStyle( 1, 0x2E4347, alpha )
         this.graphics.drawCircle( this.btnW/2, this.btnH/2, this.btnH/3)
         this.graphics.endFill()
         this.graphics.moveTo(20,15)
         this.graphics.lineTo(this.btnW-20, this.btnH-15)
         this.graphics.moveTo(this.btnW-20, 15)
         this.graphics.lineTo(20, this.btnH-15)
      } else {
         this.graphics.beginFill( this.symbolColor, alpha )
         this.graphics.lineStyle( 1, 0x2E4347, alpha )
         this.graphics.moveTo(15,15)
         this.graphics.lineTo(this.btnW-15, 15)
         this.graphics.lineTo(this.btnW/2, this.btnH-15)
         this.graphics.lineTo(15,15)
         this.graphics.closePath()
         this.graphics.endFill()
      }
   }

   setEnabled( flag ) {
      this.disabled = !flag 
      this.drawButton()
   }
}