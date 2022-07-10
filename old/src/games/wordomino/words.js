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

   showError() {
      this.letter.setFill("#cc0000") 
      this.scene.tweens.add({
         targets: this.letter,
         alpha: 0.7,
         duration: 100,
         angle: { from: -20, to: 20 },
         ease: 'Linear',
         yoyo: true,
         repeat: 2,
         delay: 0,
         onComplete: ()=> {
            this.letter.angle = 0  
         }
      })
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

// Button used to control words card; clear and submit
class CardButton {
   constructor(scene, x, y, text) {
      var cfg = {
         fontFamily: 'Josefin Sans',
         fontSize: '14px',
         align: 'center',
         color: '#ffffff'
      }

      this.rect = new Phaser.Geom.Rectangle(x, y, 90, 30)
      this.text = scene.add.text(x + 45, y + 15, text, cfg)
      this.text.setOrigin(0.5);
      this.graphics = scene.graphics
      this.enabled = false
   }

   mouseDown(x,y) {
      if (this.enabled == false) return false
      return (this.rect.contains(x, y)) 
   }
   
   draw() {
      if ( this.enabled) {
         this.graphics.lineStyle(1, 0xdadada)
         this.graphics.fillStyle(0x1565c0)
         this.text.setFill("#ffffff") 
      } else {
         this.graphics.lineStyle(1, 0xdadada)
         this.graphics.fillStyle(0x000013)
         this.text.setFill("#333333")    
      }
      this.graphics.fillRoundedRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height,
         { tl: 0, tr: 0, bl: 10, br: 10 })
      this.graphics.strokeRoundedRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height,
         { tl: 0, tr: 0, bl: 10, br: 10 })
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
      this.tweens = scene.tweens
      this.eventBus = scene.eventBus
      this.graphics = scene.graphics
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

      
      this.clearBtn = new CardButton(scene, 255,235, "Clear")
      this.submitBtn = new CardButton(scene, 390, 235, "Submit")

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
      this.clearBtn.enabled = true
      this.draw()
   }
   deactivate() {
      this.active = false
      this.submitBtn.enabled = false
      this.clearBtn.enabled = false
      this.draw()
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
      for (let r = 0; r < 5; r++) {
         for (let c = 0; c < 5; c++) {
            if (this.tiles[r][c].isAvailable()) {
               this.submitBtn.enabled = false
               this.draw()
               this.eventBus.emit("cardNotFull")
               return false
            }
         }
      }
      this.submitBtn.enabled = true 
      this.eventBus.emit("cardFull")
      this.draw()
      return true
   }

   clearWords() {
      for (let r = 0; r < 5; r++) {
         for (let c = 0; c < 5; c++) {
            let tile = this.tiles[r][c]
            if (tile.placed) {
               let letterInfo = tile.clearPlacedetter()
               this.eventBus.emit("letterReturned", letterInfo)
            }
         }
      }
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
      
      let data = { words: submit.join(",") }
      this.eventBus.emit("wordsSubmitted")
      axios.post('/api/wordomino/check', data).then( response => {
         this.handleWordResults(response.data)
      }).catch( () => {
         this.showFailedSubmit()
      })
   }

   handleWordResults(data) {
      if ( data.success == false ) {
         this.showFailedSubmit()
      } else {
         this.eventBus.emit("wordsValid", this.cardInfo)
      }
   }

   showFailedSubmit() {
      let letters = []
      for (let r = 0; r < 5; r++) {
         for (let c = 0; c < 5; c++) {
            let tile = this.tiles[r][c]
            if (tile.placed) {
               tile.letter.setFill("#cc0000") 
               letters.push( tile.letter )
            }
         }
      }
      this.tweens.add({
         targets: letters,
         alpha: 0.7,
         duration: 100,
         angle: { from: -20, to: 20 },
         ease: 'Linear',
         yoyo: true,
         repeat: 2,
         delay: 0,
         onComplete: ()=> {
            letters.forEach(l => {
               l.angle = 0
               l.setFill("#ffffff")
            })
            this.eventBus.emit("wordsFailed")
         }
      })
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
         if (this.submitBtn.mouseDown(x,y)) {
            this.submitWords()
            return
         }
         if (this.clearBtn.mouseDown(x, y)) {
            this.clearWords()
            return
         }
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
                  this.isCardFull()
               } else {
                  clicked.tile.showError()    
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

     this.clearBtn.draw() 
     this.submitBtn.draw()
   }
}