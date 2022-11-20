import * as PIXI from "pixi.js"

export default class Letter extends PIXI.Container {
   constructor( stage, letter, x, y ) {
      super()
      stage.addChild( this )

      this.infected = false
      this.virusGfx = new PIXI.Graphics() 
      this.virusPercent = 0.0 
      this.addChild(this.virusGfx)

      // set the container position. all other drawing is in reference 
      // of the container, so x and y for drawing and letters is based in 0,0
      this.x = x 
      this.y = y

      this.style = new PIXI.TextStyle({
         fill: "#cccccc",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 32,
      })

      this.graphics = new PIXI.Graphics()
      this.graphics.lineStyle(1, 0xcccccc, 1)
      this.graphics.drawCircle(0,0, 25)
      this.addChild(this.graphics)

      this.letter = new PIXI.Text(letter, this.style)
      this.letter.anchor.set(0.5)
      this.letter.x = 0
      this.letter.y = 0
      this.letter.resolution = window.devicePixelRatio
      this.addChild(this.letter)
   }

   destroy() {
      this.removeChildren()
   }

   update(delta, callback) {
      if (this.infected  && this.virusPercent < 100.0) {
         this.virusGfx.clear()
         this.virusPercent += 0.25*delta
         if (this.virusPercent >= 100.0) {
            this.virusPercent = 100.0
            this.letter.destroy()
            this.graphics.clear()
            this.graphics.lineStyle(1, 0x33cc33, 1)
            this.graphics.drawCircle(0,0, 25)
            callback(this)
         }
         let radius = 25.0 * (this.virusPercent/100.0)
      
         this.virusGfx.lineStyle(1, 0x33cc33, 1)
         this.virusGfx.beginFill(0x660055)
         this.virusGfx.drawCircle(0, 0, radius)
         this.virusGfx.endFill()
      }
   }
}