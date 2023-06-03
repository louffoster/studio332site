import * as PIXI from "pixi.js"

export default class Spinner extends PIXI.Graphics {
   constructor(x,y, r,c, clickCallback) {
      super()

      // assoiated tiles order is clockwise from top left:
      //   top left, top right, bottom right, bottom left
      this.tiles = [
         {row: r, col: c}, {row: r, col: c+1},
         {row: r+1, col: c+1},{row: r+1, col: c}]

      this.eventMode = 'static'
      this.hitArea =  new PIXI.Circle(0,0,24)
      this.cursor ="pointer"
      this.pointerDown = false
      this.on('pointerdown', this.handlePointerDown)
      this.on('pointerup', this.clickHandler)
      this.clickCallback = clickCallback

      this.x = x 
      this.y = y

      this.draw()
   }

   handlePointerDown() {
      this.pointerDown = true 
      this.draw()
   }

   clickHandler() {
      this.pointerDown = false
      this.clickCallback( this.tiles )
      this.draw()
   }

   draw() {
      this.clear()
      this.alpha = 0.3
      if (this.pointerDown ) {
         this.alpha = 0.8
      }
      this.beginFill( 0x55ccdd)
      this.lineStyle(2, 0x333333, 1)
      this.drawCircle(0,0, 24)
      this.endFill()
      this.beginFill( 0x333333)
      this.lineStyle(2, 0x333333, 1)
      this.drawCircle(0,0, 5)
   }
}