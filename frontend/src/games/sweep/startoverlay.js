import * as PIXI from "pixi.js"
import Button from "@/games/common/button"
import axios from 'axios'

export default class StartOverlay extends PIXI.Container {
   constructor(apiURL, startHandler) {
      super()

      this.x = 25 
      this.y = 70
      this.startCallback = startHandler
      this.panelW = 320
      this.panelH = 200
      this.apiService = apiURL

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(6, 0xADE8F4, 1)
      this.graphics.beginFill(0x23E8A)
      this.graphics.drawRect(0,0, this.panelW, this.panelH)
      this.graphics.endFill()
      this.graphics.lineStyle(1, 0x03045E, 1)
      this.graphics.drawRect(0,0, this.panelW, this.panelH)

      let style = new PIXI.TextStyle({
         fill: "#CAF0F8",
         fontFamily: "Arial",
         fontSize: 20,
         wordWrap: true,
         fontWeight: 'bold',
         wordWrapWidth: this.panelW - 20,
         dropShadow: true,
         dropShadowColor: '#000000',
         dropShadowBlur: 2,
         dropShadowDistance: 1,
         align: "center"
      })

      let txt = new PIXI.Text(`Clear the board by creating words with 4 to 10 letters`, style)
      txt.anchor.set(0.5,0.5)
      txt.x = this.panelW/2
      txt.y = 40

      this.addChild(this.graphics)
      this.graphics.addChild(txt)

      this.msg = new PIXI.Text(`Initializing...`, style)
      this.msg .anchor.set(0.5,0.5)
      this.msg .x = this.panelW/2
      this.msg .y = 90
      this.graphics.addChild(this.msg )

      this.startGameInit()
   }

   addStartButton() {
      let advButton = new Button( 130, 130, "OK", () => {
         this.startCallback()
      }, 0xCAF0F8,0x0077B6,0x48CAE4)
      this.addChild(advButton)
      this.msg.text = "System Initialized"
   }

   async startGameInit( callback ) {
      this.clickCallback = callback
      let url = `${this.apiService}/start?game=sweep`
      await axios.post(url, null, {timeout: 20*1000}).then( response => {
         this.jwt = response.data
         this.addStartButton()
      }).catch( (e) => {
         console.error("unable to init game: "+e)
      })
   }
}