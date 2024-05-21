import {Container, Graphics, Text} from "pixi.js"
import Button from "@/games/common/button"

export default class EndOverlay extends Container {
   heading = null
   score = null

   constructor(replayHandler, backHandler) {
      super()

      this.x = 10 
      this.y = 10
      let popupW = 350
      let popupH = 270

      this.replayHandler = replayHandler
      this.backHandler = backHandler

      let graphics = new Graphics()
      graphics.rect(0,0, popupW, popupH).
         stroke({width:6, color:0xADE8F4}).fill(0x23E8A)
      graphics.rect(0,0, popupW, popupH).stroke({width:1, color: 0x03045E})

      let style = {
         fill: "#f0f0ff",
         fontFamily: "Arial",
         fontWeight: "bold",
         fontSize: 20,
         wordWrap: true,
         wordWrapWidth: popupW - 20,
      }

      let small = {
         fill: "#f0f0ff",
         fontFamily: "Arial",
         fontSize: 16,
         wordWrap: true,
         wordWrapWidth: popupW-20,
      }

      this.heading = new Text({text:`GAME OVER`, style: style})
      this.heading.anchor.set(0.5, 0.5)
      this.heading.x = popupW / 2
      this.heading.y = 25

      this.score = new Text({text: `00000`, style: style})
      this.score.anchor.set(0.5, 0.5)
      this.score.x = popupW / 2
      this.score.y = 55

      this.msg = new Text({text: `woof`, style: style})
      this.msg.anchor.set(0.5, 0.5)
      this.msg.x = this.popupW / 2
      this.msg.y = 85

      this.totalMsg = new Text({text: `xx`, style: small})
      this.totalMsg.anchor.set(0.5, 0.5)
      this.totalMsg.x = this.popupW / 2
      this.totalMsg.y = 115

      this.addChild(graphics)
      this.addChild(this.heading)
      this.addChild(this.score)
      this.addChild(this.msg)
      this.addChild(this.totalMsg)

      let lX = 30 
      let lY = 135
      this.wordCounts = []
      for (let i=3; i<10; i++) {
         let label = new Text({text: `${i+1} letters:`, style: small})   
         label.x = lX 
         label.y = lY
         this.addChild(label)

         let cnt =  new Text({text: `0`, style: small})  
         cnt.x = lX + 73
         if ( i == 9 ) { 
            cnt.x+= 10
         }
         cnt.y = lY
         this.addChild(cnt)
         this.wordCounts.push( cnt )

         if ( i == 8 ) {
            lY += 22
            lX = 124
         } else if (i == 2 || i==5 ) {
            lX = 30 
            lY += 22
         } else {
            lX+= 100
         }
      }

      let againBtn = new Button( 225, 225, "Play Again", replayHandler, 
         0xCAF0F8,0x0077B6,0x48CAE4)
      againBtn.small()
      againBtn.alignTopLeft()
      this.addChild(againBtn)

      let backBtn = new Button( 65, 225, "Back to Studio332", backHandler, 
         0xCAF0F8,0x0077B6,0x48CAE4)
      backBtn.small()
      backBtn.alignTopLeft()
      this.addChild(backBtn)
   }

   createTotalWordsMessage(wordCounts) {
      let total  = 0 
      wordCounts.slice(4,11).forEach( (cnt,idx) => {
         total += cnt
         this.wordCounts[ idx ].text = ""+cnt
      })
      this.totalMsg.text = "Total words created: "+total
   }
   
   setWin( score, timeStr, wordCounts ) {
      let txt = `${score}`.padStart(5,"0")
      this.score.text = "Score: "+txt
      this.heading.text = "Congratulations!"
      this.msg.text = `Board cleared in ${timeStr}`
      this.createTotalWordsMessage(wordCounts)
   }
   setLoss( score, tilesLeft, wordCounts ) {
      let txt = `${score}`.padStart(5,"0")
      this.score.text = "Score: "+txt
      this.heading.text = "GAME OVER"
      this.msg.text = `${tilesLeft} letters remain`
      this.createTotalWordsMessage(wordCounts)
   }
}