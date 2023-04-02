import * as PIXI from "pixi.js"

export default class Letter extends PIXI.Container {
   constructor(letter, x, y, r,c ) {
      super()
      this.eventMode = 'static'
      this.on('pointerdown', this.clickHandler)

      this.selected = false
      this.infected = false
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
         fontSize: 36,
         stroke: '#111111',
         strokeThickness: 4,
      })

      this.graphics = new PIXI.Graphics()
      this.graphics.eventMode = 'static'
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

   static increseInfectionRate() {
      Letter.infectRatePerSec +=  0.75
      Letter.infectRatePerSec = Math.min(10.0, Letter.infectRatePerSec)
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
      this.draw()
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
         this.draw()
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
      this.draw()  
   }

   infect() {
      if ( this.infected == false) {
         this.infected = true
      }
   }

   destroy() {
      this.removeChildren()
   }

   draw() {
      this.graphics.clear()
      if (this.selected) {
         this.graphics.lineStyle(2, 0xaaddff, 1)
         this.letter.style.fill = 0xaaddff
      } else {
         this.graphics.lineStyle(1, 0xcccccc, 1)
         if ( this.isInfected() ) {
            this.letter.style.fill = 0x33aa33
         } else {
            this.letter.style.fill = 0xcccccc
         }
      }
      this.graphics.drawCircle(0,0, 25)
   }

   update(deltaMS, infectedCallback) {
      this.draw()
      if ( this.isInfected() ) {
         this.virusGfx.clear()

         if ( this.selected ) {
            // selecting a letter slows growth
            this.virusPercent += (Letter.infectRatePerSec/2.0) * (deltaMS/1000.0)
         } else {
            this.virusPercent += Letter.infectRatePerSec * (deltaMS/1000.0)
         }
         if (this.virusPercent >= 100.0) {
            this.virusPercent = 100.0
            this.selected = false
            this.letter.text = ""
            this.graphics.clear()
            this.graphics.lineStyle(3, 0x008800, 1)
            this.graphics.drawCircle(0,0, 25)
            this.graphics.cursor = 'default'
            this.eventMode = 'none'
            infectedCallback(this.row, this.col)
         }
         let radius = 25.0 * (this.virusPercent/100.0)
      
         this.virusGfx.lineStyle(1, 0x660055, 1)
         let color = 0xaa0099
         if ( this.virusPercent == 100) {
            color = 0x660055
         }
         this.virusGfx.beginFill(color)
         this.virusGfx.drawCircle(0, 0, radius)
         this.virusGfx.endFill()
      }
   }
}

// Static data -------
Letter.wordFull = false 

// 100% is full so take 100 / rate to get time for total infection
Letter.infectRatePerSec = 5.0 // 20 sec to fill