import * as PIXI from "pixi.js"

export default class ToggleButton extends PIXI.Container {
   static WIDTH = 60
   static HEIGHT = 60

   buttonColor = new PIXI.Color(0xe1d9cd)  
   borderColor = new PIXI.Color(0x582F0E) 
   selectColor = new PIXI.Color(0xBBE5ED)  
   selected = false
   enabled = true
   name = ""
   
   constructor( x,y, name, image) {
      super()

      this.name = name
      this.x = x
      this.y = y

      this.eventMode = 'static'
      this.hitArea = new PIXI.Rectangle(0,0, ToggleButton.WIDTH,ToggleButton.HEIGHT)
      this.cursor ="pointer"

      this.graphics = new PIXI.Graphics()
      this.draw()

      this.addChild(this.graphics)
      image.anchor.set(0.5,0.5)
      image.x = ToggleButton.WIDTH/2 
      image.y = ToggleButton.HEIGHT/2
      this.graphics.addChild(image)
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
      this.graphics.lineStyle(2, this.borderColor, alpha)
      this.graphics.beginFill( this.buttonColor, alpha )
      if ( this.selected ) {
         this.graphics.beginFill( this.selectColor, alpha )   
      }
      this.graphics.drawRoundedRect(0,0, ToggleButton.WIDTH, ToggleButton.HEIGHT, 5)
      this.graphics.endFill()
   }
}