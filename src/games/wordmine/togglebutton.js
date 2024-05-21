import { Container, Rectangle, Graphics } from "pixi.js"

export default class ToggleButton extends Container {
   static WIDTH = 60
   static HEIGHT = 60

   buttonColor = 0xe1d9cd  
   borderColor = 0x582F0E 
   selectColor = 0xBBE5ED  
   selected = false
   enabled = true
   name = ""
   btnImage = null
   
   constructor( x,y, name, image) {
      super()

      this.name = name
      this.x = x
      this.y = y
      this.btnImage = image

      this.eventMode = 'static'
      this.hitArea = new Rectangle(0,0, ToggleButton.WIDTH,ToggleButton.HEIGHT)
      this.cursor ="pointer"

      this.graphics = new Graphics()
      this.draw()

      this.addChild(this.graphics)
      image.anchor.set(0.5,0.5)
      image.x = ToggleButton.WIDTH/2 
      image.y = ToggleButton.HEIGHT/2

      this.btnImage.angle = 0
      this.addChild(this.btnImage)
   }

   setSelected( flag ) {
      this.selected = flag 
      this.draw()
   }

   setEnabled( flag ) {
      this.enabled = flag 
      this.draw()
   }

   setListener( listener ) {
      this.on('pointerdown', () => {
         if (this.enabled == true && this.selected == false) {
            this.selected = !this.selected 
            this.draw()   
            listener(this.name)
         }
      })
   }

   draw() {
      this.graphics.clear()
      let alpha = 1.0 
      if ( this.enabled == false) {
         alpha = 0.3
      }
      this.graphics.roundRect(0,0, ToggleButton.WIDTH, ToggleButton.HEIGHT, 5). 
         stroke({width: 2, color: this.borderColor, alpha: alpha})
      if ( this.selected ) {
         this.graphics.fill( {color: this.selectColor, alpha: alpha} )   
      } else {
         this.graphics.fill( {color: this.buttonColor, alpha: alpha} )
      }   
   }
}