import Phaser from 'phaser'

// Shape is a polyomino shape to be placed on the puzzle
//
class Shape  {
   constructor(scene, x,y, layout, blockSize) {
      this.container = scene.add.container(x, y)
      this.layout = layout 
      this.scene = scene
      let rx = 0
      let ry = 0
      let maxX=-1, maxY=-1
      let minX = 999, minY = 999
      this.blocks = []
      for (let r = 0; r<5; r++ ) {
         rx = 0
         for (let c=0; c<5; c++) {
            if ( layout[r][c]) {
               let rect = scene.add.rectangle(rx, ry, blockSize, blockSize, 0x1565c0)
               if (rx < minX)  {
                  minX = rx
               }
               if (rx+blockSize > maxX) {
                  maxX = rx + blockSize 
               }
               if (ry < minY) { 
                  minY = ry
               }
               if (ry+blockSize > maxY) {
                  maxY = ry+blockSize
               }
               
               
               rect.setOrigin(0,0)
               this.container.add(rect)
               this.blocks.push(rect)
            }
            rx += blockSize  
         }
         ry += blockSize
      }

      this.centerX = (maxX - minX) / 2.0
      this.centerY = (maxY - minY) / 2.0
      // console.log(`CALC: W: ${(maxX - minX)} H: ${(maxY - minY)}`)
   }
}

// Space is a space in the puzzle grid
//
class Space {
   constructor(scene, x, y, sz) {
      this.scene = scene
      this.rect = new Phaser.Geom.Rectangle(x, y, sz, sz)
      this.filled = false
   }

   clear() {
      this.filled = false
   }

   draw() {
      this.scene.graphics.lineStyle(1, 0x444444)
      this.scene.graphics.fillStyle(0xdadada)
      this.scene.graphics.strokeRectShape(this.rect)
      if (this.filled) {
         this.scene.graphics.fillRectShape(this.rect)
      }
   }
}

// Puzzle is the main puzzle grid
//
export default class Puzzle {
   static get SIZE() {
      return 25
   }
   constructor(scene, x, y) {
      this.x = x
      this.y = y
      this.scene = scene
      let sz = Puzzle.SIZE
      this.rect = new Phaser.Geom.Rectangle(this.x, this.y, sz * 9, sz * 9)
      this.spaces = []
      for (let r = 0; r < 9; r++) {
         this.spaces.push([])
         for (let c = 0; c < 9; c++) {
            let x = this.x + (sz * c)
            let y = this.y + (sz * r)  
            let space = new Space(this.scene, x,y, sz)
            this.spaces[r].push(space)
         }
      }
      this.reset()
   }

   reset() {
      this.active = false
      this.shape = null
      for (let r = 0; r < 9; r++) {
         for (let c = 0; c < 9; c++) {
            this.spaces[r][c].clear()
         }
      }  
   }

   setNewShape(layout) {
      this.shape = new Shape(this.scene, this.x, this.y, layout, Puzzle.SIZE)
   }

   activate()  {
      this.active = true 
      this.draw()
   }

   deactivate() {
      this.active = false
      this.draw()
   }

   mouseMove(x, y) {
      if (this.active) {
         if (this.rect.contains(x, y) == false) {
            return false
         }
         if (this.shape == null) {
            return false
         }
         for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
               // if (this.spaces[r][c].mouseMove(x, y)) {
               //    // if placing a letter and mouse moves into a new location
               //    // clear out the old tile and set target letter in new
               //    if (r != this.targetRow || c != this.targetCol) {
               //       let letter = this.tiles[this.targetRow][this.targetCol].letter.text
               //       this.tiles[this.targetRow][this.targetCol].replacePriorLetter()
               //       this.tiles[r][c].setLetter(letter)
               //       this.targetRow = r
               //       this.targetCol = c
               //    }
               // }
            }
         }
      }
      return false
   }

   draw() {
      for (let r = 0; r < 9; r++) {
         for (let c = 0; c < 9; c++) {
            this.spaces[r][c].draw()
         }
      }

      // if (this.shape != null ) {
      //    this.shape.draw()
      // }

      this.scene.graphics.lineStyle(1, 0xdadada)
      this.scene.graphics.strokeRectShape(this.rect)
   }
}