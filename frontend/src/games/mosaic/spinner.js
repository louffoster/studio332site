import * as PIXI from "pixi.js"

export default class Spinner extends PIXI.Container {
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

      // set the container position. all other drawing is in reference 
      // of the container, so x and y for drawing and letters is based in 0,0
      this.x = x 
      this.y = y

      this.graphics = new PIXI.Graphics()
      this.draw()

      this.addChild(this.graphics)
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
      this.graphics.clear()
      this.graphics.alpha = 0.4
      if (this.pointerDown ) {
         this.graphics.alpha = 0.8
      }
      this.graphics.beginFill( 0x55ccdd)
      this.graphics.lineStyle(2, 0x333333, 1)
      this.graphics.drawCircle(0,0, 24)
      this.graphics.endFill()
      this.graphics.beginFill( 0x333333)
      this.graphics.lineStyle(2, 0x333333, 1)
      this.graphics.drawCircle(0,0, 5)
   }
}