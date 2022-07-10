import Phaser from 'phaser'

export default class MessageBox {
   constructor(scene, x, y) {
      this.scene = scene
      this.message = ""
      this.rect = new Phaser.Geom.Rectangle(x, y, 225, 30)
      var cfg = {
         fontFamily: 'Josefin Sans',
         fontSize: '14px',
         align: 'center',
         color: '#ffffff'
      }
      this.msgDisplay = this.scene.add.text(this.rect.left+113, this.rect.top + 15, this.message, cfg)
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