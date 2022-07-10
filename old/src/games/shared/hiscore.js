import store from '../../store'

export default class HighScore {
   constructor(scene, x, y) {
      this.scene = scene
      this.hsGroup = this.scene.add.container(x, y)

      let txtCfg = {
         fontFamily: 'Arial',
         fontSize: '22px',
         fill: '#fff',
         stroke: "#222",
         strokeThickness: 4,
      }
      let hsCfg = {
         fontFamily: 'Courier',
         fontSize: '14px',
         fill: '#fff',
         stroke: "#000",
         strokeThickness: 3,
         align: 'left'
      }
      var hsLabel = this.scene.add.text(230, 0, "High Scores", txtCfg)
      hsLabel.setOrigin(0.5)
      this.hsGroup.add(hsLabel)
      let scores = store.getters.highScores
      if (scores.length == 0) {
         let noHS = this.scene.add.text(230, 40, "No high scores yet!", hsCfg)
         noHS.setOrigin(0.5)
         noHS.setFontSize(14)
         this.hsGroup.add(noHS)
      } else {
         let y=20
         scores.forEach( (hsObj,idx) => {
            let x = 160 

            if (idx == 0) {
               x-=20
               let num = this.scene.add.text(x, y, `${(idx + 1)}. ${hsObj.player}`, hsCfg)
               num.setFontSize(20)
               num.setColor("#ff0")
               this.hsGroup.add(num)
            } else {
               let num = this.scene.add.text(x, y, `${(idx + 1)}.`, hsCfg)
               num.setOrigin(0.5,0)
               this.hsGroup.add(num)
               let name = this.scene.add.text(180, y, hsObj.player, hsCfg)
               this.hsGroup.add(name)
            }
            
            let score = this.scene.add.text(260, y, `${hsObj.score}`, hsCfg)
            score.setOrigin(0,0)
            if (idx == 0) {
               score.setFontSize(18)
               score.setColor("#ff0")
            }
            
            this.hsGroup.add(score)

            y+= 20
            if (idx == 0 ) {
               y+= 10
            }
         })
      }
   }
}