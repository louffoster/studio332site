import Phaser from 'phaser'
import Pool from './pool'

export default class WordPuzzle extends Phaser.Scene {
   constructor() {
      super({ key: 'wordpuzzle' })
   }

   create() {
      this.graphics = this.add.graphics()
      this.graphics.lineStyle(1, 0xffffff)
      let SZ = 45
      this.pool = new Pool(this, 10,10)
      this.pool.fillGrid()
      this.pool.draw()

      for (let r = 0; r < 5; r++) {
         for (let c = 0; c < 5; c++) {
            let x = 255 + (SZ * c) 
            let y = 10 + (SZ * r) 
            let rect = new Phaser.Geom.Rectangle(x, y, SZ, SZ)
            this.graphics.strokeRectShape(rect)
         }
      }

      let PSZ = 25
      for (let r = 0; r < 9; r++) {
         for (let c = 0; c < 9; c++) {
            let x = 255 + (PSZ * c)
            let y = 255 + (PSZ * r)
            let rect = new Phaser.Geom.Rectangle(x, y, PSZ, PSZ)
            this.graphics.strokeRectShape(rect)
         }
      }

      let CSZ = 22
      for (let r = 0; r < 5; r++) {
         for (let c = 0; c < 5; c++) {
            let x = 10 + (CSZ * c)
            let y = 255 + (CSZ * r)
            let rect = new Phaser.Geom.Rectangle(x, y, CSZ, CSZ)
            this.graphics.strokeRectShape(rect)
         }
      }
      for (let r = 0; r < 5; r++) {
         for (let c = 0; c < 5; c++) {
            let x = 125 + (CSZ * c)
            let y = 255 + (CSZ * r)
            let rect = new Phaser.Geom.Rectangle(x, y, CSZ, CSZ)
            this.graphics.strokeRectShape(rect)
         }
      }
   }
}