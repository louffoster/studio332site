import * as PIXI from "pixi.js"

export default class Letter extends PIXI.Container {
   constructor(letter, x,y, clickHandler ) {
      super()

      this.x = x
      this.y = y
      this.selected = false
      this.cleared = false
      this.disabled = false

      this.style = new PIXI.TextStyle({
         fill: "#CAF0F8",
         fontFamily: "Arial",
         fontSize: 36,
         stroke: '#03045E',
         strokeThickness: 4,
      })

      this.graphics = new PIXI.Graphics()
      this.letter = new PIXI.Text(letter, this.style)
      this.letter.anchor.set(0.5)
      this.letter.x = Letter.WIDTH / 2.0 
      this.letter.y = Letter.HEIGHT / 2.0

      this.draw()

      this.eventMode = 'static'
      this.hitArea =  new PIXI.Rectangle(0,0,Letter.WIDTH,Letter.HEIGHT)
      this.cursor ="pointer"
      this.pointerDown = false
      this.on('pointerup', () => {
         if ( this.selected == false && 
              this.cleared == false && this.disabled == false) {
            this.selected = true 
            clickHandler( this.letter.text )
            this.draw()
         }
      })

      this.addChild(this.graphics)
      this.addChild(this.letter)
   }

   disable() {
      this.disabled = true
      this.eventMode = 'none'
      this.cursor ="default"
   }
   enable() {
      this.disabled = false
      this.eventMode = 'static'
      this.cursor ="pointer"
   }

   deselect() {
      if (this.selected && !this.cleared) {
         this.selected = false 
         this.draw(0)
      }
   }

   clear() {
      this.cleared = true
      this.selected = false
      this.removeChild(this.letter)
      this.eventMode = 'none'
      this.cursor ="default"
      this.draw()
   }

   draw() {
      if ( this.cleared) {
         this.graphics.clear()
         this.graphics.beginFill(0x005796)
         this.graphics.lineStyle(1, 0x03045E, 1)
         this.graphics.drawRect(0,0, Letter.WIDTH, Letter.HEIGHT)
         this.graphics.endFill()
         return
      }
      this.graphics.clear()
      this.graphics.beginFill(0x0077B6)
      this.graphics.lineStyle(1, 0x03045E, 1)

      if (this.selected) {
         this.graphics.beginFill(0x00B4D8)
      } 
      this.graphics.drawRect(0,0, Letter.WIDTH, Letter.HEIGHT)
      this.graphics.endFill()
   }
}

Letter.WIDTH = 60 
Letter.HEIGHT = 60 
