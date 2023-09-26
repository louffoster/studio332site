import * as PIXI from "pixi.js"

export default class Letter extends PIXI.Container {
   constructor(letter, x,y, r,c ) {
      super()

      this.x = x
      this.y = y
      this.row = r 
      this.col = c 
      this.selected = false

      this.style = new PIXI.TextStyle({
         fill: "#bbccff",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 36,
         stroke: '#111111',
         strokeThickness: 3,
      })

      this.graphics = new PIXI.Graphics()
      this.letter = new PIXI.Text(letter, this.style)
      this.letter.anchor.set(0.5)
      this.letter.x = Letter.WIDTH / 2.0 
      this.letter.y = Letter.HEIGHT / 2.0

      this.draw()

      this.addChild(this.graphics)
      this.addChild(this.letter)
   }

   destroy() {
      this.removeChildren()
   }

   draw() {
      this.graphics.clear()
      this.graphics.beginFill(0x445599)
      this.graphics.lineStyle(1, 0x001155, 1)

      if (this.selected) {
         this.graphics.lineStyle(2, 0xaaddff, 1)
      } 
      this.graphics.drawRect(0,0, Letter.WIDTH, Letter.HEIGHT)
      this.graphics.endFill()
   }
}

Letter.WIDTH = 60 
Letter.HEIGHT = 60 