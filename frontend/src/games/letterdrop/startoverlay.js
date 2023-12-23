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
         wordWrapWidth: this.panelW - 40,
      })

      let msg = `Drop tiles into columns of the board and use them to create words. `
      msg += "If you take too long to pick a tile, the whole row will be droppedd automatically."
      let note1 = new PIXI.Text(msg, style)
      note1.anchor.set(0.5,0)
      note1.x = this.panelW/2
      note1.y = 15
      this.addChild(note1)

      msg = "Words are created by selecting strings of adjacent tiles. "
      msg += "Valid words are 4-10 letters long and remove those tiles from the board."
      let note2 = new PIXI.Text(msg, style)
      note2.anchor.set(0.5,0)
      note2.x = this.panelW/2
      note2.y = 100
      this.addChild(note2)

      msg = `The game is over when a tile is dropped on a column that is full.`
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