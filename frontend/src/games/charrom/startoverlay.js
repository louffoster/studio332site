import * as PIXI from "pixi.js"
import Button from "@/games/common/button"
import axios from 'axios'

export default class StartOverlay extends PIXI.Container {
   constructor(apiURL, gameW, gameH, startHandler) {
      super()

      this.startCallback = startHandler
      this.panelW = gameW*0.75
      this.panelH = gameH*0.4
      this.apiService = apiURL
      this.x = (gameW - this.panelW) / 2
      this.y = 150

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(10, 0x7A6C5D, 1)
      this.graphics.beginFill(0x4A5D65)
      this.graphics.drawRect(5,5, this.panelW-10,this.panelH-10)
      this.graphics.endFill()
      this.graphics.lineStyle(2, 0x333333, 1)
      this.graphics.drawRect(0,0, this.panelW, this.panelH)
      this.graphics.drawRect(10,10, this.panelW-20,this.panelH-20)      

      this.addChild(this.graphics)

      let style = new PIXI.TextStyle({
         fill: "#FCFAFA",
         fontFamily: "Arial",
         fontSize: 18,
         lineHeight: 18,
         wordWrap: true,
         wordWrapWidth: this.panelW - 50,
      })

      let msg = `Each turn, place your striker behind the red line. `
      msg += "Flick it into the letter pucks to sink them into the pockets. "
      msg += "Red pockets trash the letter, blue add it to your letter supply."
      let note1 = new PIXI.Text(msg, style)
      note1.anchor.set(0.5,0)
      note1.x = this.panelW/2
      note1.y = 25
      this.addChild(note1)

      msg = "Tap letters from your supply in any order to create and score words."
      let note2 = new PIXI.Text(msg, style)
      note2.anchor.set(0.5,0)
      note2.x = this.panelW/2
      note2.y = 120
      this.addChild(note2)

      msg = `The game is over when your letter rack exceeds 10 letters, time expires or you scratch 5 times.`
      let note3 = new PIXI.Text(msg, style)
      note3.anchor.set(0.5,0)
      note3.x = this.panelW/2
      note3.y = 180
      this.addChild(note3)

      this.msg = new PIXI.Text(`Initializing...`, style)
      this.msg.anchor.set(0.5, 0)
      this.msg.x = this.panelW/2
      this.msg.y = 240
      this.addChild(this.msg)

      this.startGameInit() 
   }

   addStartButton() {
      let startBtn = new Button( this.panelW/2, 255, "Start Game", () => {
         this.startCallback()
      }, 0xFCFAFA,0x34629c,0x5482bc)
      startBtn.noShadow()
      this.addChild(startBtn)
      this.removeChild(this.msg)
   }

   async startGameInit( ) {
      let url = `${this.apiService}/start?game=letterdrop`
      let retries = 3 
      let done = false

      while (retries > 0 && done == false) {
         await axios.post(url, null, {timeout: 20*1000}).then( response => {
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data}` 
            this.addStartButton()
            done = true
         }).catch( (e) => {
         if (e.message.includes("timeout")) {
            if (retries == 1) {
               this.msg.text = "Finaly initialize attempt..."
            } else {
               this.msg.text = "Retry initialize..."
            }
            retries--
         } else {
            this.msg.text = "Initialize failed: "+e.message
            done = true
         }
         })
      }

      if ( done == false ) {
         this.msg.text = "Unable to initialize... try again later"
      }
   }
}