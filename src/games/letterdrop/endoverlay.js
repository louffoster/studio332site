import { Container, Text, Graphics } from "pixi.js"
import Button from "@/games/common/button"


export default class EndOverlay extends Container {
   constructor(replayHandler, backHandler) {
      super()

      this.x = 25 
      this.y = 25
      const panelW = 330
      const panelH = 255

      const graphics = new Graphics()
      graphics.rect(5,5, panelW-10, panelH-10). 
         stroke({width: 10, color: 0xcCcAcA}).fill(0x4E6367)
      graphics.rect(0,0, panelW, panelH).stroke({width:2, color:0xA4B8C4 })
      this.addChild(graphics)
      
      let heading = new Text({text: `GAME OVER`, style: {
         fill: "#FCFAFA",
         fontFamily: "Arial",
         fontSize: 18,
         fontWeight: 'bold',
         align: "center"
      }})
      heading.anchor.set(0.5, 0.5)
      heading.x = panelW / 2
      heading.y = 40
      this.addChild( heading )

      let statStyle = {
         fill: "#FCFAFA",
         fontFamily: "Arial",
         fontSize: 16,
         lineHeight: 16,
         align: "center"
      }
      let scoreLabel = new Text({text: `Score:`, style: statStyle})
      scoreLabel.anchor.set(1, 0.5)
      scoreLabel.x = panelW / 2
      scoreLabel.y = 80
      this.addChild( scoreLabel )

      this.score  = new Text({text: "00000", style: statStyle})
      this.score.anchor.set(0, 0.5)
      this.score.x = panelW / 2 + 5
      this.score.y = 80
      this.addChild( this.score  )

      let timeLabel = new Text({text: `Time Played:`, style: statStyle})
      timeLabel.anchor.set(1, 0.5)
      timeLabel.x = panelW / 2
      timeLabel.y = 100
      this.addChild( timeLabel )

      this.time  = new Text({text: "00:00", style: statStyle})
      this.time.anchor.set(0, 0.5)
      this.time.x = panelW / 2 + 5
      this.time.y = 100
      this.addChild( this.time  )
      
      let againBtn = new Button( panelW / 2, 155, "Play Again", 
         replayHandler, 0xFCFAFA,0x34629c,0x5482bc)
      this.addChild(againBtn)
      let backBtn = new Button( panelW / 2, 210, "Back to Studio332 Site", 
         backHandler, 0xFCFAFA,0x34629c,0x5482bc)
      this.addChild(backBtn)
   }

   setStats( score, gameTimeStr ) {
      this.score.text = `${score}`.padStart(5,"0")
      this.time.text = gameTimeStr
   }
}