
import Cookies from 'js-cookie'
import Phaser from 'phaser'

export default class Menu extends Phaser.Scene {
   constructor ()   {
      super({ key: 'menu' })
   }
   preload () {
   }

   create () {
      var cfg = {
         fontFamily: 'Arial',
         fontSize: '56px',
         fill: '#fff',
         stroke: "#448AFF",
         strokeThickness:10
      }
      var title = this.add.text( 230,120, "LatticeWords",cfg)
      title.setOrigin(0.5)
      title.setShadow(3,3, "#222", 2, true, false)

      var btnCfg = {
         fontFamily: 'Arial',
         fontSize: '22px',
         fill: '#fff',
         stroke: "#222",
         strokeThickness:4,
         inputEnabled: true
      }
      var play = this.add.text( 230,220, "Play Now!", btnCfg)
      play.setOrigin(0.5)
      play.setFontSize(32)
      play.setInteractive()
      play.on('pointerup', function(/*_pointer, _x, _y*/) {
          this.scene.start('latticewords')
      }, this)

      this.input.on('gameobjectover', function (_pointer, gameObject) {
         gameObject.setTint(0xffff00)
      })
      this.input.on('gameobjectout', function (_pointer, gameObject) {
         gameObject.clearTint()
      })

      var bestLabel = this.add.text( 230,400, "Best Score", btnCfg)
      bestLabel.setOrigin(0.5)
      var best = this.add.text( 230,440, "0", btnCfg)
      best.setOrigin(0.5)
      var bestScore = Cookies.get('bestScore')
      if ( bestScore ) {
         best.setText( bestScore)
      }
   }
}
