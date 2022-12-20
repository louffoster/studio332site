import * as PIXI from "pixi.js"

export default class EndOverlay extends PIXI.Container {
   constructor( restartCallback, gameTime, stats ) {
      super()
      this.x = 5 
      this.y = 100

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(1, 0x55dd55, 1)
      this.graphics.beginFill(0x333333)
      this.graphics.drawRect(0,0, 290,250)
      this.addChild(this.graphics)

      let style = new PIXI.TextStyle({
         fill: "#55dd55",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 20,
      })
      this.msg = new PIXI.Text("System Failure", style)
      this.msg.anchor.set(0.5)
      this.msg.x = 145
      this.msg.y = 50
      this.addChild(this.msg)

      this.graphics.interactive = true 
      this.graphics.hitArea = new PIXI.Rectangle(95,90, 100,35)
      this.graphics.cursor ="pointer"
      this.graphics.lineStyle(1, 0x55dd55, 1)
      this.graphics.beginFill(0x114a11)
      this.graphics.drawRect(95,185, 100,35)
      let btnTxt = new PIXI.Text("Retry", style)
      btnTxt.anchor.set(0.5)
      btnTxt.x = 145
      btnTxt.y = 202
      btnTxt.interactive = true 
      btnTxt.cursor ="pointer"
      this.addChild(btnTxt)
      this.graphics.on('pointerup', restartCallback) 
      btnTxt.on('pointerup', restartCallback)

      console.log(gameTime)
      console.log(stats)
   }

}