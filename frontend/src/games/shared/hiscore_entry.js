// import store from '../../store'
import Phaser from 'phaser'

export default class HighScoreEntry {
   constructor(scene, x, y) {
      this.scene = scene
      this.hsGroup = this.scene.add.container(x, y)

      this.name = []
      this.nameIdx = 0
      this.visible = true

      let txtCfg = {
         fontFamily: 'Courier',
         fontSize: '32px',
         fill: '#333',
         strokeThickness: 0,
         inputEnabled: true,
      }
      let letters = [
         'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 
         'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 
         'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '<'
      ]

      let lx=30
      let ly=0
      letters.forEach( (c,idx)=> {
         if (idx % 9 == 0) {
            ly+= 50
            lx = 30
         }
         let b = this.scene.add.rectangle(lx, ly, 45, 45, 0xffffff)
         b.setOrigin(0.5,0.5)
         this.hsGroup.add(b)
         if (c != "<") {
            let l = this.scene.add.text(lx, ly, c, txtCfg)
            l.setOrigin(0.5)
            l.setInteractive()
            l.on('pointerup', () => {
               if (this.nameIdx < 3) {
                  this.name[this.nameIdx].text = l.text
                  this.nameIdx++
               }
            })
            this.hsGroup.add(l)
         } else {
            var del = this.scene.add.sprite(lx,ly, 'del')
            del.setOrigin(0.5)
            del.setInteractive()
            del.on("pointerup", () =>{
               if (this.nameIdx > 0) {
                  this.nameIdx--
                  this.name[this.nameIdx].text = "_"
               }
            })
            this.hsGroup.add(del)
         }
         lx+=50
      })

      lx = 180
      ly = 225
      for (let i=0; i<3; i++) {
         let b = this.scene.add.rectangle(lx, ly, 45, 45, 0xffffff)
         b.setOrigin(0.5, 0.5)
         this.hsGroup.add(b)
         let l = this.scene.add.text(lx, ly, "_", txtCfg)
         l.setOrigin(0.5)
         this.hsGroup.add(l)
         this.name.push(l)
         lx+=50
      }

      this.scene.input.keyboard.on("keyup", (event) => {
         if ( this.visible) {
            let code = event.keyCode
            if (code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE || code === Phaser.Input.Keyboard.KeyCodes.DELETE) {
               if (this.nameIdx > 0) {
                  this.nameIdx--
                  this.name[this.nameIdx].text = "_"
               }
            } else if (code >= Phaser.Input.Keyboard.KeyCodes.A && code <= Phaser.Input.Keyboard.KeyCodes.Z) {
               if (this.nameIdx < 3) {
                  this.name[this.nameIdx].text = String.fromCharCode(code)
                  this.nameIdx++
               }
            }
         }
      })
   }
}