import {Text, Graphics, Container, Rectangle} from "pixi.js"

export default class Tile extends Container {
   static WIDTH = 50 
   static HEIGHT = 50 

   constructor(x,y, r,c, clickHandler ) {
      super()

      this.x = x
      this.y = y
      this.row = r 
      this.col = c

      this.graphics = new Graphics()
      this.draw()

      this.eventMode = 'static'
      this.hitArea =  new Rectangle(0,0,Tile.WIDTH,Tile.HEIGHT)
      this.cursor ="pointer"
      this.on('pointerdown', () => {
         clickHandler( this )
      })

      this.addChild(this.graphics)
   }

   setHighlight(_flag) {
      this.draw()
   }

   draw() {
      this.graphics.clear()

      this.graphics.rect(0,0, Tile.WIDTH, Tile.HEIGHT).stroke({width: 1, color: 0x1B065E})
      this.graphics.fill(0xEDF6F9)
   }
}
