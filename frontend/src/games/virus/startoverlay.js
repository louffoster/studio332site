import * as PIXI from "pixi.js"
import axios from 'axios'
import Button from "@/games/common/button"

export default class StartOverlay extends PIXI.Container {
   constructor(apiURL) {
      super()

      this.x = 10 
      this.y = 100
      this.panelW = 330

      this.apiService = apiURL

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(2, 0x55dd55, 1)
      this.graphics.beginFill(0x333333)
      this.graphics.drawRect(0,0, this.panelW,150)

      let style = new PIXI.TextStyle({
         fill: "#55dd55",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 20,
         lineHeight: 20
      })
      this.msg = new PIXI.Text("Initializing...", style)
      this.msg.anchor.set(0.5)
      this.msg.x = this.panelW / 2.0
      this.msg.y = 40

      this.addChild(this.graphics)
      this.addChild(this.msg)
   }

   async startGameInit( callback ) {
      let url = `${this.apiService}/start?game=virus`
      let retries = 3 
      let done = false

      let startBtn = new Button( this.panelW/2, 100, "Start", 
         ()=> {callback(this.jwt)},
         0x55dd55,0x114a11,0x55dd55)

      while (retries > 0 && done == false) {
         await axios.post(url, null, {timeout: 20*1000}).then( response => {
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data}` 
            this.addChild(startBtn)
            done = true
            this.msg.text = "System Initialized"
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