import {Graphics} from "pixi.js"

export default class Tile extends Graphics {
   static WIDTH = 70
   static HEIGHT = 70

   constructor(colorCode, x,y, r,c, small ) {
      super()
      this.x = x 
      this.y = y
      this.row = r 
      this.col = c
      this.colorIndex = colorCode
      this.tileW = Tile.WIDTH
      this.tileH = Tile.HEIGHT
      this.border = true
      if ( small === true ) {
         this.tileW = this.tileW * 0.5
         this.tileH = this.tileH * 0.5
         this.border = false
      }
      this.draw()
   }

   get width() {
      return this.tileW
   }
   get height() {
      return this.tileH
   }

   draw() {
      let colors = [0xeeefff, 0x33aabf, 0x19545E]
      this.clear()
      this.rect(0, 0, this.tileW, this.tileH).
         fill( colors[ this.colorIndex ])
      if ( this.border === false) {
         this.stroke({width:1, color: 0x777777, alpha: 0.5})
      } else {
         this.stroke({width: 1, color: 0x222222})
      }
   }
}