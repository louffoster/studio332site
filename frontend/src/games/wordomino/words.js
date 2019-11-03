import Tile from './tile'

class WordTile extends Tile {
   constructor(scene, x, y) {
      super(scene,x,y,'')
      this.active = false
   }

   reset() {
      this.setLetter('')
      this.active = false
   }

   hit(x, y) {
      return this.rect.contains(x, y)
   }

   draw() {
      this.scene.graphics.fillStyle(0x162238)
      this.scene.graphics.lineStyle(1, 0xdadada)
      this.scene.graphics.strokeRectShape(this.rect)
      if ( this.active ) {
         this.scene.graphics.fillStyle(0x1565c0)//(0x000a12)
      }
      this.scene.graphics.fillRectShape(this.rect)
   }
}

export default class Words {
   constructor(scene, x, y) {
      this.active = false
      this.x = x
      this.y = y
      this.cardInfo = null
      this.tiles = []
      this.targetRow = -1
      this.targetCol = -1
      let sz = Tile.SIZE
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

   setNewLetter(letter) {
      if ( this.active ) {
         this.tiles[this.targetRow][this.targetCol].setLetter("")
      }
      this.active = true
      this.targetRow = 0
      this.targetCol = 0
      this.tiles[0][0].setLetter(letter)
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
         for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
               if (this.tiles[r][c].hit(x, y)) {
                  if ( r != this.targetRow || c != this.targetCol ) {
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
   }

   draw() {
      for (let r = 0; r < 5; r++) {
         for (let c = 0; c < 5; c++) {
            this.tiles[r][c].draw()
         }
      }
   }
}