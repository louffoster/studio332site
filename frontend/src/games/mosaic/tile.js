import * as PIXI from "pixi.js"

export default class Tile extends PIXI.Graphics {
   constructor(colorCode, x,y, r,c, small ) {
      super()
      this.x = x 
      this.y = y
      this.row = r 
      this.col = c
      this.colorIndex = colorCode
      this.tileW = Tile.width
      this.tileH = Tile.height
      this.border = true
      if ( small === true ) {
         this.tileW = this.tileW * 0.5
         this.tileH = this.tileH * 0.5
         this.border = false
      }
      this.draw()
   }

   draw() {
      let colors = [0xeeefff, 0x33aabf, 0x19545E]
      this.clear()
      this.beginFill( colors[ this.colorIndex ])
      this.lineStyle(1, 0x222222, 1)
      if ( this.border === false) {
         this.lineStyle(1, 0x777777, 0.5)
      }
      this.drawRect(0,0, this.tileW, this.tileH)
      this.endFill()
   }
}

Tile.width = 70
Tile.height = 70