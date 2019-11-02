import Phaser from 'phaser'

export default class Words {
   static get TILE_SIZE() {
      return 45
   }
   constructor(scene, x, y) {
      this.x = x
      this.y = y
      this.scene = scene
      this.cardInfo = null
      this.reset()
   }

   reset() {
      this.cardInfo = null
      this.spaces = []
      for (let r = 0; r < 5; r++) {
         this.spaces.push([])
         for (let c = 0; c < 5; c++) {
            this.spaces[r].push("")
         }
      }
   }

   setCard( card ) {
      this.cardInfo = card
   }

   isCardSelected() {
      return this.cardInfo != null
   }

   draw() {
      let sz = Words.TILE_SIZE
      this.scene.graphics.fillStyle(0x444444)
      this.scene.graphics.lineStyle(1, 0xe5e5e5)
      for (let r = 0; r < 5; r++) {
         for (let c = 0; c < 5; c++) {
            let x = this.x + (sz * c)
            let y = this.y + (sz * r)
            let rect = new Phaser.Geom.Rectangle(x, y, sz, sz)
            this.scene.graphics.strokeRectShape(rect)
            if (this.isCardSelected()) {
               if ( this.cardInfo.layout[r][c] == 0) {
                  this.scene.graphics.fillRectShape(rect)
               }
            }
         }
      }
   }
}