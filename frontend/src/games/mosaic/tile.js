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
      if ( small === true ) {
         this.tileW = this.tileW * 0.5
         this.tileH = this.tileH * 0.5
      }
      this.draw()
   }

   draw() {
      let colors = [0xeeefff, 0x33aabf]
      this.clear()
      this.beginFill( colors[ this.colorIndex ])
      this.lineStyle(2, 0x333333, 1)
      this.drawRect(0,0, this.tileW, this.tileH)
      this.endFill()
   }
}

Tile.width = 70
Tile.height = 70