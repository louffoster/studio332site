import Phaser from 'phaser'

export default class Tile {
   static get SIZE() {
      return 45
   }
   constructor(scene, x, y, letter) {
      let sz = Tile.SIZE
      this.scene = scene
      this.rect = new Phaser.Geom.Rectangle(x, y, sz, sz)
      this.selected = false
      this.mouseOver = false
      var cfg = {
         fontFamily: 'Josefin Slab',
         fontSize: '24px',
      }

      this.letter = this.scene.add.text(this.rect.left + 22, this.rect.top + 23, letter, cfg)
      this.letter.setOrigin(0.5)
   }

   isEmpty() {
      return this.letter.text == ""
   }

   setLetter(l) {
      this.letter.setText(l)
   }

   mouseMove(x, y) {
      let old = this.mouseOver
      this.mouseOver = this.rect.contains(x, y)
      if (this.mouseOver != old) {
         this.draw()
      }
   }

   mouseDown(x, y) {
      if (this.rect.contains(x, y)) {
         this.selected = true
         this.letter.setFill("#1565c0")
      } else {
         let old = this.selected
         this.selected = false
         this.letter.setFill("#ffffff")    
         if (old != this.selected) {
            this.draw()
         }
      }
      return this.selected
   }

   draw() {
      this.scene.graphics.fillStyle(0x000a12)
      this.scene.graphics.lineStyle(1, 0xdadada)
      if (this.mouseOver || this.selected) {
         this.scene.graphics.fillStyle(0x162238)
      }
      this.scene.graphics.fillRectShape(this.rect)
      this.scene.graphics.strokeRectShape(this.rect)
   }
}
