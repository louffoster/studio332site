import { Container, Rectangle, Graphics, Sprite } from "pixi.js"

export default class IconButton extends Container {
   static WIDTH = 60
   static HEIGHT = 60

   buttonColor = 0xe1d9cd 
   borderColor = 0x582F0E 
   selectColor = 0xBBE5ED  
   down = false
   enabled = true
   btnSprite = null
   
   constructor( x,y, image) {
      super()

      this.x = x
      this.y = y
      this.btnSprite = Sprite.from(image)

      this.eventMode = 'static'
      this.hitArea = new Rectangle(0,0, IconButton.WIDTH,IconButton.HEIGHT)
      this.cursor ="pointer"

      this.graphics = new Graphics()
      this.draw()

      this.addChild(this.graphics)
      this.btnSprite.anchor.set(0.5,0.5)
      this.btnSprite.x = IconButton.WIDTH/2 
      this.btnSprite.y = IconButton.HEIGHT/2
      this.addChild(this.btnSprite)
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
         if (this.enabled == true && this.down == false) {
            this.down = true 
            this.draw()   
         }
      })
      this.on('pointerup', () => {
         if (this.enabled == true) {
            this.down = false
            this.draw()   
            listener()
         }
      })
   }

   draw() {
      this.graphics.clear()
      let alpha = 1.0 
      if ( this.enabled == false) {
         alpha = 0.3
      }
      this.graphics.roundRect(0,0, IconButton.WIDTH, IconButton.HEIGHT, 5). 
         stroke({width: 2, color: this.borderColor, alpha: alpha})
      if ( this.down ) {
         this.graphics.fill( {color: this.selectColor, alpha: alpha} )   
      } else {
         this.graphics.fill( {color: this.buttonColor, alpha: alpha} )
      }   
   }
}