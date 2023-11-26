import * as PIXI from "pixi.js"
import Button from "@/games/common/button"

export default class EndOverlay extends PIXI.Container {
   constructor(replayHandler, backHandler) {
      super()

      this.x = 10 
      this.y = 10
      this.popupW = 350
      this.popupH = 270
      this.replayHandler = replayHandler
      this.backHandler = backHandler

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(6, 0xADE8F4, 1)
      this.graphics.beginFill(0x23E8A)
      this.graphics.drawRect(0,0, this.popupW, this.popupH)
      this.graphics.endFill()
      this.graphics.lineStyle(1, 0x03045E, 1)
      this.graphics.drawRect(0,0, this.popupW, this.popupH)

      let style = new PIXI.TextStyle({
         fill: "#f0f0ff",
         fontFamily: "Arial",
         fontSize: 20,
         wordWrap: true,
         fontWeight: 'bold',
         wordWrapWidth: this.popupW-20,
         dropShadow: true,
         dropShadowColor: '#000000',
         dropShadowBlur: 2,
         dropShadowDistance: 1,
         align: "center"
      })
      let small = new PIXI.TextStyle({
         fill: "#f0f0ff",
         fontFamily: "Arial",
         fontSize: 16,
         lineHeight: 16,
         wordWrap: true,
         wordWrapWidth: this.popupW-20,
         align: "center"
      })

      this.heading = new PIXI.Text(`GAME OVER`, style)
      this.heading.anchor.set(0.5, 0.5)
      this.heading.x = this.popupW / 2
      this.heading.y = 35

      this.msg = new PIXI.Text(`woof`, style)
      this.msg.anchor.set(0.5, 0.5)
      this.msg.x = this.popupW / 2
      this.msg.y = 75

      this.totalMsg = new PIXI.Text(`xx`, small)
      this.totalMsg.anchor.set(0.5, 0.5)
      this.totalMsg.x = this.popupW / 2
      this.totalMsg.y = 110

      this.addChild(this.graphics)
      this.addChild(this.heading)
      this.addChild(this.msg)
      this.addChild(this.totalMsg)

      let lX = 30 
      let lY = 135
      this.wordCounts = []
      for (let i=3; i<10; i++) {
         let label = new PIXI.Text(`${i+1} letters:`, small)   
         label.x = lX 
         label.y = lY
         this.addChild(label)

         let cnt =  new PIXI.Text(`0`, small)  
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
   
   setWin( timeStr, wordCounts ) {
      this.heading.text = "Congratulations!"
      this.msg.text = `Board cleared in ${timeStr}`
      this.createTotalWordsMessage(wordCounts)
   }
   setLoss( tilesLeft, wordCounts ) {
      this.heading.text = "GAME OVER"
      this.msg.text = `${tilesLeft} letters remain`
      this.createTotalWordsMessage(wordCounts)
   }
}