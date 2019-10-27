import Phaser from 'phaser'
import * as letters from './letters'
import * as cards from './cards'
import Puzzle from './puzzle'
import Words from './words'

export default class Wordomino extends Phaser.Scene {
   constructor() {
      super({ key: 'wordomino' })
   }

   create() {
      this.helpTiles = [1,1]

      this.graphics = this.add.graphics()
      this.graphics.lineStyle(1, 0xffffff)
      
      this.letterPool = new letters.Pool(this, 10,10)
      this.letterPool.fillGrid()
      
      this.cardPool = new cards.Pool(this)
      this.cardPool.setChoiceCoordinates( 10,255, 125,255)

      this.words = new Words(this, 255, 10)
      this.puzzle = new Puzzle(this,255,255)
      
      this.draw()
   }

   draw() {
      this.letterPool.draw()
      this.cardPool.draw()
      this.words.draw()
      this.puzzle.draw()

      let sz = 45
      this.graphics.lineStyle(1, 0x444444)
      this.graphics.fillStyle(0xdadada)
      for (let i=0; i<this.helpTiles.length; i++) {
         let x = 190 
         let y = 380+ (sz * i) + (10*i)
         let rect = new Phaser.Geom.Rectangle(x, y, sz, sz)
         this.graphics.strokeRectShape(rect)
         if (this.helpTiles[i] == 1) {
            this.graphics.fillRectShape(rect)
         }

      }
   }
}