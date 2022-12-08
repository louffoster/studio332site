import * as PIXI from "pixi.js"

export default class Letter extends PIXI.Container {
   static wordFull = false 

   constructor(letter, x, y, r,c ) {
      super()
      this.interactive = true
      this.on('pointerdown', this.clickHandler)

      this.selected = false
      this.infected = false
      this.redraw = false
      this.virusGfx = new PIXI.Graphics() 
      this.virusPercent = 0.0 
      this.addChild(this.virusGfx)

      // set the container position. all other drawing is in reference 
      // of the container, so x and y for drawing and letters is based in 0,0
      this.x = x 
      this.y = y
      this.row = r 
      this.col = c

      this.style = new PIXI.TextStyle({
         fill: "#cccccc",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 38,
      })

      this.graphics = new PIXI.Graphics()
      this.graphics.interactive = true 
      this.graphics.hitArea = new PIXI.Circle(0,0,25)
      this.graphics.cursor ="pointer"
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

   setClickCallback( callback ) {
      this.clickCallback = callback
   }

   clickHandler() {
      if ( this.isLost() ) {
         return
      }
      if ( Letter.wordFull && this.selected == false ) { 
         return
      }
      this.selected = !this.selected
      this.redraw = true
      this.clickCallback(this.selected, this.row, this.col, this.letter.text)
   }

   isInfected() {
      return this.infected && this.virusPercent < 100
   }
   isLost() {
      return this.infected && this.virusPercent == 100
   }

   deselect() {
      if ( this.selected) {
         this.selected = false
         this.redraw = true   
      }
   }

   replace( newLetter ) {
      if ( this.isLost() == false ) {
         this.letter.text = newLetter    
      }
   }

   reset( newLetter ) {
      this.selected = false
      if ( this.infected ) {
         this.infected = false 
         this.virusPercent = 0
         this.virusGfx.clear()
      }
      this.letter.text = newLetter 
      this.redraw = true    
   }

   infect() {
      if ( this.infected == false) {
         this.infected = true
         this.letter.style.fill = 0x33aa33
      }
   }

   disinfect() {
      if ( this.infected == true ) {
         this.infected = false
         this.letter.style.fill = 0xcccccc
         this.virusPercent = 0
         this.virusGfx.clear()
      }
   }

   destroy() {
      this.removeChildren()
   }

   update(delta, infectedCallback) {
      if (this.redraw) {
         this.graphics.clear()
         if (this.selected) {
            this.graphics.lineStyle(2, 0xaaddff, 1)
            this.letter.style.fill = 0xaaddff
         } else {
            this.graphics.lineStyle(1, 0xcccccc, 1)
            this.letter.style.fill = 0xcccccc
         }
         this.graphics.drawCircle(0,0, 25)
         this.redraw = false
      }
      if ( this.isInfected() ) {
         this.virusGfx.clear()
         this.virusPercent += 0.1*delta
         if (this.virusPercent >= 100.0) {
            this.virusPercent = 100.0
            this.selected = false
            this.letter.text = ""
            this.graphics.clear()
            this.graphics.lineStyle(1, 0x33cc33, 1)
            this.graphics.drawCircle(0,0, 25)
            this.graphics.cursor = 'default'
            this.interactive = false
            infectedCallback(this.row, this.col)
         }
         let radius = 25.0 * (this.virusPercent/100.0)
      
         this.virusGfx.lineStyle(1, 0x660055, 1)
         this.virusGfx.beginFill(0x770066)
         this.virusGfx.drawCircle(0, 0, radius)
         this.virusGfx.endFill()
      }
   }
}