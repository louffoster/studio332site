import Phaser from 'phaser'

export default class Puzzle {
   static get SIZE() {
      return 25
   }
   constructor(scene, x, y) {
      this.x = x
      this.y = y
      this.scene = scene
      this.reset()
   }

   reset() {
      this.spaces = []
      for (let r = 0; r < 9; r++) {
         this.spaces.push([])
         for (let c = 0; c < 9; c++) {
            this.spaces[r].push(0)
         }
      }  
   }

   draw() {
      let sz = Puzzle.SIZE
      this.scene.graphics.lineStyle(1, 0x444444)
      this.scene.graphics.fillStyle(0xdadada)
      for (let r = 0; r < 9; r++) {
         for (let c = 0; c < 9; c++) {
            let x = this.x + (sz * c)
            let y = this.y + (sz * r)
            let rect = new Phaser.Geom.Rectangle(x, y, sz, sz)
            this.scene.graphics.strokeRectShape(rect)
            if (this.spaces[r][c] == 1) {
               this.scene.graphics.fillRectShape(rect)
            }
         }
      }

      this.scene.graphics.lineStyle(1, 0xdadada)
      let rect = new Phaser.Geom.Rectangle(this.x, this.y, sz*9, sz*9)
      this.scene.graphics.strokeRectShape(rect)
   }
}