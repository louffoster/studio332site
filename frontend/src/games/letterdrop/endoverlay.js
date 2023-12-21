import * as PIXI from "pixi.js"
import Button from "@/games/common/button"


export default class EndOverlay extends PIXI.Container {
   constructor(replayHandler, backHandler) {
      super()

      this.x = 25 
      this.y = 25
      this.panelW = 330
      this.panelH = 255

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(5, 0xFCFAFA, 1)
      this.graphics.beginFill(0x4E6367)
      this.graphics.drawRect(0,0, this.panelW, this.panelH)
      this.graphics.endFill()
      this.graphics.lineStyle(3,0xA4B8C4, 1)
      this.graphics.drawRect(0,0, this.panelW, this.panelH)
      
      this.addChild(this.graphics)

      let style = new PIXI.TextStyle({
         fill: "#FCFAFA",
         fontFamily: "Arial",
         fontSize: 18,
         lineHeight: 18,
         wordWrap: true,
         fontWeight: 'bold',
         wordWrapWidth: this.panelW - 20,
         dropShadow: true,
         dropShadowColor: '#000000',
         dropShadowBlur: 2,
         dropShadowDistance: 1,
         align: "center"
      })

      let heading = new PIXI.Text(`GAME OVER`, style)
      heading.anchor.set(0.5, 0.5)
      heading.x = this.panelW / 2
      heading.y = 40
      this.addChild( heading )

      let statStyle = new PIXI.TextStyle({
         fill: "#FCFAFA",
         fontFamily: "Arial",
         fontSize: 16,
         lineHeight: 16,
         align: "center"
      })
      let scoreLabel = new PIXI.Text(`Score:`, statStyle)
      scoreLabel.anchor.set(1, 0.5)
      scoreLabel.x = this.panelW / 2
      scoreLabel.y = 80
      this.addChild( scoreLabel )

      this.score  = new PIXI.Text("00000", statStyle)
      this.score.anchor.set(0, 0.5)
      this.score.x = this.panelW / 2 + 5
      this.score.y = 80
      this.addChild( this.score  )

      let timeLabel = new PIXI.Text(`Time Played:`, statStyle)
      timeLabel.anchor.set(1, 0.5)
      timeLabel.x = this.panelW / 2
      timeLabel.y = 100
      this.addChild( timeLabel )

      this.time  = new PIXI.Text("00:00", statStyle)
      this.time.anchor.set(0, 0.5)
      this.time.x = this.panelW / 2 + 5
      this.time.y = 100
      this.addChild( this.time  )
      
      let againBtn = new Button( this.panelW / 2, 155, "Play Again", 
         replayHandler, 0xFCFAFA,0x34629c,0x5482bc)
      againBtn.noShadow()
      this.addChild(againBtn)
      let backBtn = new Button( this.panelW / 2, 210, "Back to Studio332 Site", 
         backHandler, 0xFCFAFA,0x34629c,0x5482bc)
      backBtn.noShadow()
      this.addChild(backBtn)
   }

   setStats( score, gameTimeStr ) {
      this.score.text = `${score}`.padStart(5,"0")
      this.time.text = gameTimeStr
   }
}