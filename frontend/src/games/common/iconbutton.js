import {Sprite, Container, Graphics } from "pixi.js"

export default class IconButton extends Container {
   static RADIUS = 48 

   enabled = true
   down = false
   btnSprite = null
   gfx = null
   bkgColor = null
   
   constructor( x,y, image, bkgColor = null) {
      super()

      this.btnSprite = Sprite.from(image)
      this.btnSprite.anchor.set(0.5,0.5)
      this.x = x
      this.y = y

      this.gfx = new Graphics() 
      this.addChild(this.gfx)
      this.bkgColor = bkgColor

      this.btnSprite.eventMode = 'static'
      this.btnSprite.cursor ="pointer"
      this.addChild(this.btnSprite)

      this.draw()
   }

   setEnabled( flag ) {
      this.enabled = flag 
      this.btnSprite.alpha = 1
      this.gfx.alpha = 1
      if ( this.enabled == false) {
         this.btnSprite.alpha = 0.2
         this.gfx.alpha = 0.2
      }
   }

   setListener( listener ) {
      this.btnSprite.on('pointerdown', () => {
         if (this.enabled == true && this.down == false) {
            this.down = true 
            this.btnSprite.tint = 0xaaaaaa
         }
      })
      this.btnSprite.on('pointerup', () => {
         if (this.enabled == true) {
            this.down = false
            this.btnSprite.tint = null
            listener()
         }
      })
   }

   draw() {
      if ( this.bkgColor ) {
         this.gfx.clear() 
         this.gfx.circle(0,0,IconButton.RADIUS/2).fill(this.bkgColor)
      }
   }
}