import * as PIXI from "pixi.js"

export default class Tile extends PIXI.Graphics {
   constructor(colorCode, x,y, r,c ) {
      super()
      this.x = x 
      this.y = y
      this.row = r 
      this.col = c
      this.colorIndex = colorCode
      this.draw()
   }

   draw() {
      let colors = [0xeeefff, 0x33aabf]
      this.clear()
      this.beginFill( colors[ this.colorIndex ])
      this.lineStyle(2, 0x333333, 1)
      this.drawRect(0,0, Tile.width, Tile.height)
      this.endFill()
   }
}

Tile.width = 64
Tile.height = 64