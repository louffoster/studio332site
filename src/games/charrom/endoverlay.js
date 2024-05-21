import { Container, Graphics, Text } from "pixi.js"
import Button from "@/games/common/button"

export default class EndOverlay extends Container {
   constructor(gameW, gameH, reason, replayHandler, backHandler) {
      super()

      // resons: scratch, overflow, expired
      this.panelW = gameW*0.75
      this.panelH = gameH*0.5
      this.x = (gameW - this.panelW) / 2
      this.y = 75

      const graphics = new Graphics()
      graphics.rect(5,5, this.panelW-10, this.panelH-10).fill(0x4A5D65).stroke({width:10, color: 0x7A6C5D})
      graphics.rect(0,0, this.panelW, this.panelH).stroke({width:2, color: 0x333333})
      graphics.rect(10,10, this.panelW-20, this.panelH-20).stroke({width:2, color: 0x333333})      
      this.addChild(graphics)

      let over = new Text({text: "Game Over", style: {
         fill: "#FCFAFA",
         fontFamily: "Arial",
         fontSize: 26,
         lineHeight: 26
      }})
      over.anchor.set(0.5,0)
      over.x = this.panelW/2
      over.y = 30
      this.addChild(over)

      this.style = {
         fill: "#FCFAFA",
         fontFamily: "Arial",
         fontSize: 18,
         lineHeight: 18,
         wordWrap: true,
         wordWrapWidth: this.panelW - 50,
      }

      let endMsg = "Word creation timer expired"
      if ( reason == "scratch" ) {
         endMsg = "Scratch limit exceeded"
      } else if (reason == "oveflow") {
         endMsg = "Letter limit exceeded"
      }
      let resaonTxt = new Text({text: endMsg, style: this.style}) 
      resaonTxt.anchor.set(0.5,0)
      resaonTxt.x = this.panelW/2
      resaonTxt.y = 80
      this.addChild(resaonTxt)

      let againBtn = new Button( 30, this.panelH - 70, "Play Again", 
         replayHandler, 0xFCFAFA,0x34629c,0x5482bc)
      againBtn.alignTopLeft()
      this.addChild(againBtn)

      let backBtn = new Button( againBtn.x+againBtn.btnWidth+20, this.panelH - 70, "Back to Studio332 Site", 
         backHandler, 0xFCFAFA,0x34629c,0x5482bc)
      backBtn.alignTopLeft()
      this.addChild(backBtn)
   }  

   setResults(score, sunkCnt, wordCnt) { 
      let note2 = new Text({text: `${score}`.padStart(5,"0"), style: this.style})
      note2.anchor.set(0.5,0)
      note2.x = this.panelW/2
      note2.y = 115
      this.addChild(note2)

      let statsX = this.panelW / 2 + 50
      let sunkLabel = new Text({text: `Pucks Sunk:`, style: this.style})
      sunkLabel.anchor.set(1, 0.5)
      sunkLabel.x = statsX
      sunkLabel.y = 160
      this.addChild( sunkLabel )

      let sunk  = new Text({text: `${sunkCnt}`, style: this.style})
      sunk.anchor.set(0, 0.5)
      sunk.x = statsX + 5
      sunk.y = 160
      this.addChild( sunk  )

      let wordsLbl = new Text({text: `Words Created:`, style: this.style})
      wordsLbl.anchor.set(1, 0.5)
      wordsLbl.x = statsX
      wordsLbl.y = 190
      this.addChild( wordsLbl )

      let words  = new Text({text: `${wordCnt}`, style: this.style})
      words.anchor.set(0, 0.5)
      words.x = statsX + 5
      words.y = 190
      this.addChild( words  )
   }
}