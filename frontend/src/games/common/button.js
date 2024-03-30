import {Color, Text, Graphics, Container, Rectangle} from "pixi.js"

export default class Button extends Container {
   constructor( x,y, txt, listener, txtColor="white", btnColor=0x33aabf, highlight=0x44bbcf) {
      super()

      this.disabled = false
      this.round = false
      this.btnColor = new Color(btnColor)
      this.highlight = new Color(highlight)
      this.txtColor = new Color(txtColor)

      this.btnTxt = new Text({
         text: txt, 
         style: {
            fill: this.txtColor,
            fontFamily: "Arial",
            fontSize: 18,
            align: "center"
         }
      })
      this.btnWidth = this.btnTxt.width + 40
      this.btnHeight = this.btnTxt.height + 20

      this.btnTxt.anchor.set(0.5, 0.5)
      this.btnTxt.x = this.btnWidth / 2.0
      this.btnTxt.y = this.btnHeight / 2.0

      this.x = x-this.btnWidth / 2.0
      this.y = y-this.btnHeight / 2.0

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
            this.clickListener()
         }
      })
      this.hitArea = new Rectangle(0,0, this.btnWidth, this.btnHeight)
      this.cursor ="pointer"
      this.clickListener = listener

      this.graphics = new Graphics()
      this.drawButton()

      this.addChild(this.graphics)
      this.addChild(this.btnTxt)
   }

   roundButton() {
      this.round = true 
      this.drawButton()
   }

   small() {
      this.btnTxt.style.lineHeight = 14    
      this.btnTxt.style.fontSize = 14  
      
      this.btnWidth = this.btnTxt.width + 25
      this.btnHeight = this.btnTxt.height + 15
      this.btnTxt.x = this.btnWidth / 2.0
      this.btnTxt.y = this.btnHeight / 2.0
      this.drawButton()
   }

   noShadow() {
      this.btnTxt.style.fontWeight = "normal"
      this.btnTxt.style.dropShadow = false
   }

   alignTopLeft() {
      this.x += this.btnWidth / 2.0
      this.y += this.btnHeight / 2.0
   }

   alignTopRight() {
      this.x -= this.btnWidth * .25
      this.y += this.btnHeight / 2.0
   }

   drawButton() {
      this.graphics.clear()
      let alpha = 1.0 
      if ( this.disabled) {
         alpha = 0.3
      }
      if ( this.round ) {
         this.graphics.circle(this.btnWidth/2,this.btnHeight/2, this.btnWidth/2).
            stroke({width: 1, color: this.txtColor, alpha: alpha})
      } else {
         this.graphics.rect(0,0, this.btnWidth, this.btnHeight). 
            stroke({width: 1, color: this.txtColor, alpha: alpha})
      }
      if ( this.pointerDown) {
         this.graphics.fill( this.highlight)
      } else {
         this.graphics.fill( {color: this.btnColor, alpha: alpha} )
      }
   }

   setEnabled( flag) {
      this.disabled = !flag 
      this.drawButton()
   }

   disable() {
      this.disabled = true 
      this.drawButton()
   }

   enable() {
      this.disabled = false 
      this.drawButton()
   }
}