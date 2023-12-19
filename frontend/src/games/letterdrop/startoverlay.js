import * as PIXI from "pixi.js"
import Button from "@/games/common/button"
import axios from 'axios'

export default class StartOverlay extends PIXI.Container {
   constructor(apiURL, startHandler) {
      super()

      this.x = 5 
      this.y = 5
      this.startCallback = startHandler
      this.panelW = 370
      this.panelH = 300
      this.apiService = apiURL

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

      let note1 = new PIXI.Text(`Drop tiles into columns of the board and use them to create words.`, style)
      note1.anchor.set(0.5,0)
      note1.x = this.panelW/2
      note1.y = 10
      this.addChild(note1)

      let note2 = new PIXI.Text(`Words are created by selecting strings of adjacent tiles. Valid words remove tiles from the board.`, style)
      note2.anchor.set(0.5,0)
      note2.x = this.panelW/2
      note2.y = 70
      this.addChild(note2)

      let note3 = new PIXI.Text(`The game is over when the board is completely full.`, style)
      note3.anchor.set(0.5,0)
      note3.x = this.panelW/2
      note3.y = 160
      this.addChild(note3)

      this.msg = new PIXI.Text(`Initializing...`, style)
      this.msg .anchor.set(0.5, 0)
      this.msg .x = this.panelW/2
      this.msg .y = 150
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