import Phaser from 'phaser'

export default class Tile {
   static get SIZE() {
      return 45
   }
   constructor(scene, x, y, letter) {
      let sz = Tile.SIZE
      this.scene = scene
      this.rect = new Phaser.Geom.Rectangle(x, y, sz, sz)
      this.letter = letter
      this.selected = false
   }

   isEmpty() {
      return this.letter == ""
   }

   setLetter( l) {
      this.letter = l
      var cfg = {
         fontFamily: 'Josefin Slab',
         fontSize: '24px',
      }

      var text = this.scene.add.text(this.rect.left+22, this.rect.top+23, this.letter, cfg)
      text.setOrigin(0.5)
   }

   hit(x, y) {
      let clicked = this.rect.contains(x, y)
      if (clicked) {
         this.selected = !this.selected
      }
      return clicked
   }

   draw() {
      this.scene.graphics.lineStyle(1, 0xffffff)
      this.scene.graphics.strokeRectShape(this.rect)
   }
}
