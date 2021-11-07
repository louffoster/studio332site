import store from '../../store'
import Phaser from 'phaser'

// pass data to scene:
// this.scene.start('GameOverScene', { score: this.playerScore }); 
// init(data) {
//   this.finalScore = data.score;
// }

export default class HighScoreEntry extends Phaser.Scene {
   constructor() {
      super({ key: 'high_score_menu' })
   }
   preload() {
      this.load.image('del', '/latticewords/images/del.png')
   }

   create() {
      this.name = []
      this.nameIdx = 0

      // console.log(store)

      let txtCfg = {
         fontFamily: 'Courier',
         fontSize: '32px',
         fill: '#333',
         strokeThickness: 0,
         inputEnabled: true,
      }
      var hdrCfg = {
         fontFamily: 'Arial',
         fontSize: '32px',
         fill: '#fff',
         stroke: "#222",
         strokeThickness: 3
      }
      let letters = [
         'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 
         'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 
         'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '<'
      ]

      let t = this.add.text(230, 40, "You got a new high score!", hdrCfg)
      t.setOrigin(0.5,0)

      // let msg = `# ${store.state.highScoreRank}: ${store.state.highScore}`
      // console.log(msg)
      let t2 = this.add.text(190, 110, "Rank", hdrCfg)
      t2.setFontSize(16)
      t2.setOrigin(0.5, 0)
      t2 = this.add.text(190, 135, "" + store.state.highScoreRank, hdrCfg)
      t2.setFontSize(16)
      t2.setOrigin(0.5, 0)
      t2 = this.add.text(230, 110, "Score", hdrCfg)
      t2.setFontSize(16)
      t2.setOrigin(0, 0)
      t2 = this.add.text(230, 135, "" + store.state.highScore, hdrCfg)
      t2.setFontSize(16)
      t2.setOrigin(0, 0)

      let lx=30
      let ly=180
      letters.forEach( (c,idx)=> {
         if (idx % 9 == 0) {
            ly+= 50
            lx = 30
         }
         let b = this.add.rectangle(lx, ly, 45, 45, 0xffffff)
         b.setOrigin(0.5,0.5)
         if (c != "<") {
            let l = this.add.text(lx, ly, c, txtCfg)
            l.setOrigin(0.5)
            l.setInteractive()
            l.on('pointerup', () => {
               if (this.nameIdx < 3) {
                  this.name[this.nameIdx].text = l.text
                  this.nameIdx++
               }
            })
         } else {
            var del = this.add.sprite(lx,ly, 'del')
            del.setOrigin(0.5)
            del.setInteractive()
            del.on("pointerup", () =>{
               if (this.nameIdx > 0) {
                  this.nameIdx--
                  this.name[this.nameIdx].text = "_"
               }
            })
         }
         lx+=50
      })

      lx = 180
      ly = 400
      for (let i=0; i<3; i++) {
         let b = this.add.rectangle(lx, ly, 45, 45, 0xffffff)
         b.setOrigin(0.5, 0.5)
         let l = this.add.text(lx, ly, "_", txtCfg)
         l.setOrigin(0.5)
         this.name.push(l)
         lx+=50
      }

      // this.input.keyboard.on("keyup", (event) => {
      //       let code = event.keyCode
      //       if (code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE || code === Phaser.Input.Keyboard.KeyCodes.DELETE) {
      //          if (this.nameIdx > 0) {
      //             this.nameIdx--
      //             this.name[this.nameIdx].text = "_"
      //          }
      //       } else if (code >= Phaser.Input.Keyboard.KeyCodes.A && code <= Phaser.Input.Keyboard.KeyCodes.Z) {
      //          if (this.nameIdx < 3) {
      //             this.name[this.nameIdx].text = String.fromCharCode(code)
      //             this.nameIdx++
      //          }
      //       }
      //    }
      // })
   }
}