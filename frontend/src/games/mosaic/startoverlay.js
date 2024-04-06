import { Container, Graphics, Text } from "pixi.js"
import Button from "@/games/common/button"

export default class StartOverlay extends Container {
   constructor(startTimeMS, startHandler) {
      super()

      this.x = 10 
      this.y = 55
      const panelW = 340
      const panelH = 250

      const graphics = new Graphics()
      graphics.rect(5,5, panelW-10, panelH-10).stroke({width:10,color:0x80D3E1}).fill(0x34565c)
      graphics.rect(0,0, panelW, panelH).stroke({width: 2, color: 0x000000})
      this.addChild( graphics )

      let style = {
         fill: "#f0f0ff",
         fontFamily: "Arial",
         fontSize: 20,
         wordWrap: true,
         wordWrapWidth: panelW - 40,
         align: "center"
      }

      let secs = startTimeMS / 1000
      let mins = Math.floor(secs / 60)
      if ( mins > 0) {
         secs = secs - mins*60
      }
      let timeStr = `${mins}`.padStart(2,"0")+":"+`${secs}`.padStart(2,"0")

      const msg = new Text({text:`Match as many patterns as possible in ${timeStr}`, style:style})
      msg.anchor.set(0.5,0.5)
      msg.x = panelW/2
      msg.y = 40
      this.addChild(msg)

      const note1 = new Text({text: `Standard mode uses two colors`, style: style})
      note1.anchor.set(0.5,0.5)
      note1.x = panelW/2
      note1.y = 100
      this.addChild(note1)
      const note2 = new Text({text: `Advanced mode uses three`, style: style})
      note2.anchor.set(0.5,0.5)
      note2.x = panelW/2
      note2.y = 130
      this.addChild(note2)

      let stdButton = new Button( 50, 180, "Standard", () => {
         startHandler("standard")
      })
      stdButton.alignTopLeft()
      this.addChild(stdButton)

      let advButton = new Button( 180, 180, "Advanced", () => {
         startHandler("advanced")
      })
      advButton.alignTopLeft()
      this.addChild(advButton)
   }
}