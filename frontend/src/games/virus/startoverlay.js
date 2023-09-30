import * as PIXI from "pixi.js"
import axios from 'axios'

export default class StartOverlay extends PIXI.Container {
   constructor(apiURL) {
      super()

      this.x = 10 
      this.y = 100
      this.btnWidth = 100 
      this.btnHeight = 35
      this.apiService = apiURL

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(2, 0x55dd55, 1)
      this.graphics.beginFill(0x333333)
      this.graphics.drawRect(0,0, 280,150)

      let style = new PIXI.TextStyle({
         fill: "#55dd55",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 20,
      })
      this.msg = new PIXI.Text("Initializing...", style)
      this.msg.anchor.set(0.5)
      this.msg.x = 145
      this.msg.y = 50

      this.addChild(this.graphics)
      this.graphics.addChild(this.msg)
   }

   async startGameInit( callback ) {
      this.clickCallback = callback
      let url = `${this.apiService}/start?game=virus`
      await axios.post(url, null, {timeout: 10*1000}).then( response => {
         this.jwt = response.data
         this.addStartButton()
         this.msg.text = "System Initialized"
      }).catch( (e)=> {
         console.error("unable to start game: "+e)
      })
   }

   addStartButton() {
      this.btnX = 95 
      this.btnY = 90
      this.graphics.cursor = "pointer"
      this.graphics.eventMode = 'static' 
      this.graphics.hitArea = new PIXI.Rectangle(this.btnX, this.btnY, this.btnWidth, this.btnHeight)

      this.graphics.lineStyle(1, 0x55dd55, 1)
      this.graphics.beginFill(0x114a11)
      this.graphics.drawRect(this.btnX, this.btnY, this.btnWidth, this.btnHeight)
      let style = new PIXI.TextStyle({
         fill: "#55dd55",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 18,
      })
      let btnTxt = new PIXI.Text("Start", style)
      btnTxt.anchor.set(0.5)
      btnTxt.x = 145
      btnTxt.y = 108
      this.graphics.addChild(btnTxt)

      // add the this param as context for the click event. If not, any reference
      // to click in the clickHandler will bet to the txt or graphics, not the overlay class
      this.graphics.on('pointerup', this.clickHandler, this) 
      btnTxt.on('pointerup', this.clickHandler, this)
   }

   clickHandler() {
      this.clickCallback(this.jwt)
   }
}