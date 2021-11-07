import * as PIXI from "pixi.js"

export default class Letter extends PIXI.Container{
   constructor( stage, letter, x, y ) {
      super()
      // console.log("Create letter "+letter)
      stage.addChild( this )

      this.x = x 
      this.y = y
      this.an

      this.style = new PIXI.TextStyle({
         fill: "#0b0",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 56,
      })

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(2, 0x00bb00, 1)
      this.graphics.drawCircle(x,y, 40,40)
      stage.addChild(this.graphics)

      this.letter = new PIXI.Text(letter, this.style)
      this.letter.anchor.set(0.5)
      this.letter.x = x 
      this.letter.y = y
      this.letter.resolution = window.devicePixelRatio
      stage.addChild(this.letter)
   }

   destroy() {
      this.graphics.destroy()
      this.destroy()
   }

   update() {
   }
}