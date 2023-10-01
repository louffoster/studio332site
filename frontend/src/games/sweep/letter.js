import * as PIXI from "pixi.js"

export default class Letter extends PIXI.Container {
   constructor(letter, x,y, r,c, clickHandler ) {
      super()

      this.x = x
      this.y = y
      this.row = r 
      this.col = c 
      this.selected = false

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
         if ( Letter.Active && this.selected == false ) {
            this.selected = true 
            clickHandler( this.row, this.col, this.letter.text )
            this.draw()
         }
      })

      this.addChild(this.graphics)
      this.addChild(this.letter)
   }

   deselect() {
      if (this.selected) {
         this.selected = false 
         this.draw(0)
      }
   }

   destroy() {
      this.removeChildren()
   }

   draw() {
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
Letter.Active = true