import Phaser from 'phaser'
import * as letters from './letters'
import * as cards from './cards'
import Puzzle from './puzzle'
import Words from './words'
import MessageBox from './messages'

export default class Wordomino extends Phaser.Scene {
   constructor() {
      super({ key: 'wordomino' })
   }

   create() {
      this.gameState = "PICK_CARD"
      this.helpTiles = [1,1]

      this.graphics = this.add.graphics()
      
      this.letterPool = new letters.Pool(this, 10,10)
      this.letterPool.fillGrid()
      
      this.cardPool = new cards.Pool(this)
      this.cardPool.setChoiceCoordinates( 10,255, 125,255)
      this.msgBox = new MessageBox(this,10,380)
      this.msgBox.setMessage("Pick a puzzle shape card")

      this.words = new Words(this, 255, 10)
      this.puzzle = new Puzzle(this,255,255)
      
      this.draw()
      this.gameTimer = this.time.addEvent({ delay: 1000, callback: this.tick, callbackScope: this, loop: true })

      this.input.on('pointermove', pointer => {
         if ( this.cardPool.isActive()) {
            this.cardPool.mouseMove(pointer.x, pointer.y)
         }
      });
      this.input.on('pointerdown', pointer => {
         if (this.cardPool.isActive()) {
            this.cardPool.mouseDown(pointer.x, pointer.y)
         }
      });
   }

   tick() {
      if (this.gameState == "PICK_CARD") {
         let cardInfo = this.cardPool.cardPicked() 
         if ( cardInfo ) {
            this.gameState = "PICK_LETTERS"
            this.msgBox.setMessage("Fill shape with letters")
            this.msgBox.draw()
            this.words.setCard( cardInfo )
            this.words.draw()
         }
      }
   }

   draw() {
      this.letterPool.draw()
      this.cardPool.draw()
      this.msgBox.draw()
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