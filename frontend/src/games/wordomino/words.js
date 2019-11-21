import Tile from './tile'
import Phaser from 'phaser'
import axios from 'axios'

// WordTile is a single tile used on the words board
//
class WordTile extends Tile {
   constructor(scene, x, y) {
      super(scene,x,y,'')
      this.placed = false 
      this.placedLetterInfo = null
   }

   reset() {
      this.setLetter('')
      this.placed = false
      this.placedLetterInfo = null
      this.draw()
   }

   replacePriorLetter() {
      if (this.placed ) {
         this.letter.setText(this.placedLetterInfo.letter)  
      } else {
         this.letter.setText("")  
      }
      this.draw()
   }

   place(letterInfo) {
      this.placed = true
      this.placedLetterInfo = letterInfo
      this.draw()
   }

   clearPlacedetter() {
      this.placed = false
      this.selected = false
      this.mouseOver = false
      let info = this.placedLetterInfo
      this.placedLetterInfo = null
      this.letter.setText("")  
      this.draw()
      return info
   }

   isAvailable() {
      return this.active && !this.placed
   }

   mouseDown(x, y) {
      return this.rect.contains(x, y)
   }

   draw() {
      if (this.placed ) {
         this.scene.graphics.fillStyle(0x000a12)
         this.scene.graphics.lineStyle(1, 0xdadada)
         if (this.placedLetterInfo.letter == this.letter.text) {
            this.letter.setFill("#ffffff") 
         } else {
            this.letter.setFill("#cc0000") 
         }
         return
      } 

      this.scene.graphics.fillStyle(0x162238)
      this.scene.graphics.lineStyle(1, 0xdadada)
      if (this.active && !this.placed) {
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

   isCardFull() {
      let totalLen = 0
      this.cardInfo.words.forEach( w=> {
         totalLen += w.wordLength
      })   
      let placedLen = 0
      for (let r = 0; r < 5; r++) {
         for (let c = 0; c < 5; c++) {
            if (this.tiles[r][c].placed) {
               placedLen++
            }
         }
      }
      return placedLen == totalLen
   }

   submitWords() {
      let submit = []
      this.cardInfo.words.forEach(w => {
         let sr = w.startRow
         let sc = w.startCol
         let len = w.wordLength
         let word = ""
         if (w.direction == "right") {
            for (let c=sc; c<(sc+len); c++) {
               word = word + this.tiles[sr][c].getLetter()
            }
         } else {
            for (let r = sr; r < (sr + len); r++) {
               word = word + this.tiles[r][sc].getLetter()
            }
         }
         submit.push(word)
      }) 
      
      let data = { words: words.join(",") }
      this.eventBus.emit("wordsSubmitted")
      axios.post('/api/wordomino/check', data).then( response => {
         this.handleWordResults(response.data)
      }).catch(error => {
         console.log(error)
      })
   }

   handleWordResults(data) {
      alert(JSON.stringify(data))
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
                  // if placing a letter and mouse moves into a new location
                  // clear out the old tile and set target letter in new
                  if (r != this.targetRow || c != this.targetCol) {
                     let letter = this.tiles[this.targetRow][this.targetCol].letter.text
                     this.tiles[this.targetRow][this.targetCol].replacePriorLetter()  
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
            if (this.isPlacingLetter()) {
               if (clicked.r == this.targetRow && clicked.c == this.targetCol && clicked.tile.isAvailable()) {
                  clicked.tile.place(this.activeLetterInfo)    
                  this.eventBus.emit("letterPlaced", this.activeLetterInfo)
                  this.clearActiveLetter()
               }
            } else {
               // See if a tile is already placed here. If so, return to pool
               if (clicked.tile.placed) {
                  let letterInfo = clicked.tile.clearPlacedetter()
                  this.eventBus.emit("letterReturned", letterInfo)
               }
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