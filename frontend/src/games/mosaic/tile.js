import * as PIXI from "pixi.js"

export default class Tile extends PIXI.Container {
   constructor(colorCode, x,y, r,c ) {
      super()

      // set the container position. all other drawing is in reference 
      // of the container, so x and y for drawing and letters is based in 0,0
      this.x = x 
      this.y = y
      this.row = r 
      this.col = c
      this.colorIndex = colorCode

      this.graphics = new PIXI.Graphics()
      this.draw()

      this.addChild(this.graphics)
   }

   draw() {
      let colors = [0xeeefff, 0x33aabf]
      this.graphics.clear()
      this.graphics.beginFill( colors[ this.colorIndex ])
      this.graphics.lineStyle(2, 0x333333, 1)
      this.graphics.drawRect(0,0, 70, 70)
      this.graphics.endFill()
   }
}