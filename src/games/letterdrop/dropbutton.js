import { Container, Color, Rectangle, Graphics } from "pixi.js"

export default class DropButton extends Container {
   disabled = false 
   btnW = 60 
   btnH = 45
   pointerDown = false
   symbolColor = new Color(0xbbcde5)
   buttonColor = new Color(0x759eb8)
   highlightColor = new Color(0x95bed8)
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
         if (this.disabled == false && this.pointerDown == true) {
            this.pointerDown = false 
            this.drawButton()   
            listener()
         }
      })
      this.hitArea = new Rectangle(0,0, this.btnW, this.btnH)
      this.cursor ="pointer"

      this.graphics = new Graphics()
      this.drawButton()

      this.addChild(this.graphics)
   }

   useTrashIcon() {
      this.trashIcon = true
      this.buttonColor =  new Color(0x957186) 
      this.highlightColor =  new Color(0xa58196)
      this.symbolColor = new Color(0xc57186)
      this.drawButton()
   }

   drawButton() {
      this.graphics.clear()
      let alpha = 1.0 
      if ( this.disabled) {
         alpha = 0.4
      }

      this.graphics.rect(0,0, this.btnW, this.btnH).stroke({width:1, color:0x2E4347})
      if ( this.pointerDown) {
         this.graphics.fill( this.highlightColor )
      } else {
         this.graphics.fill( {color: this.buttonColor, alpha: alpha} )
      }

      if ( this.trashIcon ) {
         this.graphics.circle( this.btnW/2, this.btnH/2, this.btnH/3). 
            stroke({width:1, color:0x2E4347, alpha: alpha}). 
            fill({color: this.symbolColor, alpha: alpha})
         this.graphics.moveTo(20,15)
         this.graphics.lineTo(this.btnW-20, this.btnH-15)
         this.graphics.moveTo(this.btnW-20, 15)
         this.graphics.lineTo(20, this.btnH-15)
         this.graphics.stroke({width:1, color:0x2E4347, alpha: alpha})
      } else {
         const pts = [{x:15, y:15}, {x:this.btnW-15, y:15}, {x:this.btnW/2, y:this.btnH-15}]
         this.graphics.poly(pts).
            stroke({width: 1, color: 0x2E4347, alpha: alpha}).
            fill({color: this.symbolColor, alpha: alpha})
      }
   }

   setEnabled( flag ) {
      this.disabled = !flag 
      this.drawButton()
   }
}