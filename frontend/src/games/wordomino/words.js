import Tile from './tile'
import Phaser from 'phaser'

// WordTile is a single tile used on the words board
//
class WordTile extends Tile {
   constructor(scene, x, y) {
      super(scene,x,y,'')
      this.placed = false 
      this.srcRow = -1
      this.srcCol = -1
   }

   reset() {
      this.setLetter('')
      this.placed = false
      this.srcRow = -1
      this.srcCol = -1
      this.draw()
   }

   place(letterInfo) {
      this.placed = true
      this.srcRow = letterInfo.srcRow
      this.srcCol = letterInfo.srcCol
      this.draw()
   }

   mouseDown(x, y) {
      return this.rect.contains(x, y)
   }

   draw() {
      if (this.placed) {
         this.scene.graphics.fillStyle(0x000a12)
         this.scene.graphics.lineStyle(1, 0xdadada)
         this.letter.setFill("#ffffff") 
         return
      } 

      this.scene.graphics.fillStyle(0x162238)
      this.scene.graphics.lineStyle(1, 0xdadada)
      if (this.active) {
         this.scene.graphics.fillStyle(0x1565c0)
         this.letter.setFill("#ffffff")   
         if (this.mouseOver) {
            this.scene.graphics.fillStyle(0x003c8f)
         }  
      } else {
         this.letter.setFill("#cc0000") 
         if (this.mouseOver) {
            this.scene.graphics.fillStyle(0x162238)
         } 
      }

      this.scene.graphics.fillRectShape(this.rect)
      this.scene.graphics.strokeRectShape(this.rect) 
   }
}

// Words is the board where letter tiles are arranged to form words
//
export default class Words {
   constructor(scene, x, y) {
      this.active = false
      this.x = x
      this.y = y
      this.cardInfo = null
      this.tiles = []
      this.clearActiveLetter()
      this.eventBus = scene.eventBus
      let sz = Tile.SIZE
      this.boardRect = new Phaser.Geom.Rectangle(x, y, sz * 5, sz * 5)
      for (let r = 0; r < 5; r++) {
         this.tiles.push([])
         for (let c = 0; c < 5; c++) {
            let x = this.x + (sz * c)
            let y = this.y + (sz * r)
            let tile = new WordTile(scene, x, y)
            this.tiles[r].push(tile)
         }
      }
      this.reset()
   }

   setNewLetter(letterInfo) {
      if (this.targetRow > -1 && this.targetCol > -1) { 
         this.tiles[this.targetRow][this.targetCol].setLetter("")
         this.tiles[this.targetRow][this.targetCol].draw()
      }
      this.targetRow = 0
      this.targetCol = 0
      this.tiles[0][0].setLetter(letterInfo.letter)
      this.activeLetterInfo = letterInfo
      this.tiles[this.targetRow][this.targetCol].draw()
   }

   clearActiveLetter() {
      this.targetRow = -1
      this.targetCol = -1   
      this.activeLetterInfo = null
   }
   isPlacingLetter() {
      return this.activeLetterInfo != null
   }

   isActive() {
      return this.active
   }
   activate() {
      this.active = true
   }
   deactivate() {
      this.active = false
   }

   reset() {
      this.cardInfo = null
      this.clearActiveLetter()
      for (let r = 0; r < 5; r++) {
         for (let c = 0; c < 5; c++) {
            this.tiles[r][c].reset()
         }
      }
   }

   setCard( card ) {
      this.cardInfo = card
      for (let r = 0; r < 5; r++) {
         for (let c = 0; c < 5; c++) {
            if (this.cardInfo.layout[r][c] == 1) {
               this.tiles[r][c].active = true
            }
         }
      }
   }

   isCardSelected() {
      return this.cardInfo != null
   }

   mouseMove(x, y) {
      if (this.active) {
         if (this.boardRect.contains(x, y) == false) {
            return false
         }
         if (this.isPlacingLetter() == false ) {
            return false
         }
         for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
               if (this.tiles[r][c].mouseMove(x,y)) {
                  if (r != this.targetRow || c != this.targetCol) {
                     let letter = this.tiles[this.targetRow][this.targetCol].letter.text
                     this.tiles[this.targetRow][this.targetCol].setLetter("")   
                     this.tiles[r][c].setLetter(letter)   
                     this.targetRow = r
                     this.targetCol = c
                  }
               }
            }
         }
      }
      return false
   }

   mouseDown(x, y) {
      if (this.active) {
         if (this.boardRect.contains(x, y) == false) {
            return
         }
         if (this.isPlacingLetter() == false) {
            return
         }
         let clicked = {r: -1, c: -1, tile: null}
         for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
               if (this.tiles[r][c].mouseDown(x, y)) {
                  clicked = { r: r, c: c, tile: this.tiles[r][c]}
                  break
               }
            }
            if (clicked.tile != null) {
               break
            }
         }

         // If placing a letter, targetRow/Col will be set. See if it was the tile clicked...
         if (clicked.tile != null) {
            if (clicked.r == this.targetRow && clicked.c == this.targetCol && clicked.tile.active) {
               clicked.tile.place(this.activeLetterInfo)    
               this.eventBus.emit("letterPlaced", this.activeLetterInfo)
               this.clearActiveLetter()
               return 
            } else {
               // See if a tile is already placed here. If so, return to pool
            }
         }
      }
   }

   draw() {
      for (let r = 0; r < 5; r++) {
         for (let c = 0; c < 5; c++) {
            this.tiles[r][c].draw()
         }
      }
   }
}