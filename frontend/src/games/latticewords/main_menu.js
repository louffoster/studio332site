
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
      play.on('pointerup', () => {
          this.scene.start('latticewords')
      })

      this.input.on('gameobjectover', function (_pointer, gameObject) {
         gameObject.setTint(0xffff00)
      })
      this.input.on('gameobjectout', function (_pointer, gameObject) {
         gameObject.clearTint()
      })


      var rulesBtn = this.add.text(230, 270, "How to play", btnCfg)
      rulesBtn.setFontSize(16)
      rulesBtn.setInteractive()
      rulesBtn.setOrigin(0.5)
      rulesBtn.on('pointerup', () => {
         this.helpGroup.setVisible(true)
      })

      var bestLabel = this.add.text( 230,400, "Best Score", btnCfg)
      bestLabel.setOrigin(0.5)
      var best = this.add.text( 230,440, "0", btnCfg)
      best.setOrigin(0.5)
      var bestScore = Cookies.get('bestScore')
      if ( bestScore ) {
         best.setText( bestScore)
      }

      this.createRulesMenu()
   }

   createRulesMenu() {
      let bkg = this.add.rectangle(0, 140, 460, 550, 0x2F41A5)  //B not F5
      bkg.setOrigin(0, 0)

      var txtCfg = {
         fontFamily: 'Arial',
         fontSize: '22px',
         fill: '#fff',
         stroke: "#222",
         strokeThickness: 3,
         wordWrap: { width: 420, useAdvancedWrap: true }
      }
      var foo = this.add.text(20, 160, "How to play", txtCfg)
      foo.setOrigin(0,0)

      let txt = [
         "+ Drag rows and columns to arrange letters into words",
         "+ Words must be selected to score",
         "+ Tap to select a letter",
         "+ Last selected letter is marked with a dot",
         "+ Double tap to select letters connected to the dot",
         "+ Form words from left to right and top to bottom",
         "+ Only one word per row or column is allowed",
         "+ Tap a selected word or letter to deselect it",
         "+ Tap 'Score Grid' to score all selected words",
         "+ Base score is determined by word length",
         "+ Score is doubled for each word after the first",
      ]
      var help = this.add.text(30, 210, txt, txtCfg)
      help.setFontSize(16)
      help.setOrigin(0,0)

      var ok = this.add.text(40, 480, "OK", txtCfg)
      ok.setFontSize(20)
      ok.setInteractive()
      ok.setOrigin(0.5)
      ok.on('pointerup', () => {
         this.helpGroup.setVisible(false)
      })

      this.helpGroup = this.add.container(0, 40, [bkg, foo, help, ok])
      this.helpGroup.setVisible(false)
   }
}