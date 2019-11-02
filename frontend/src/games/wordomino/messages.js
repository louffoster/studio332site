import Phaser from 'phaser'

export default class MessageBox {
   constructor(scene, x, y) {
      this.scene = scene
      this.message = ""
      this.rect = new Phaser.Geom.Rectangle(x, y, 170, 26)
      var cfg = {
         fontFamily: 'Josefin Slab',
         fontSize: '14px',
         align: 'center',
         color: '#ffffff'
      }
      this.msgDisplay = this.scene.add.text(this.rect.left+85, this.rect.top + 13, this.message, cfg)
      this.msgDisplay.setOrigin(0.5);
      this.draw()
   }

   setMessage(msg) {
      this.message = msg
      this.msgDisplay.setText(msg)
      this.draw()
   }

   draw() {
      this.scene.graphics.lineStyle(2, 0xf0f0f0)
      this.scene.graphics.strokeRectShape(this.rect)
   }
}