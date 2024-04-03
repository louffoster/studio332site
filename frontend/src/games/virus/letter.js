import { Container, Graphics, Text, Circle } from "pixi.js"

export default class Letter extends Container {
   static wordFull = false 

   // 100% is full so take 100 / rate to get time for total infection
   static infectRatePerSec = 5.0 // 20 sec to fill

   constructor(letter, x,y, r,c ) {
      super()
      this.eventMode = 'static'
      this.hitArea =  new Circle(0,0,25)
      this.cursor = "pointer"
      this.on('pointerdown', this.clickHandler)

      this.selected = false
      this.infected = false
      this.virusGfx = new Graphics() 
      this.virusPercent = 0.0 

      // set the container position. all other drawing is in reference 
      // of the container, so x and y for drawing and letters is based in 0,0
      this.x = x 
      this.y = y
      this.row = r 
      this.col = c

      this.graphics = new Graphics()
      this.letter = new Text({text: letter, style: {
         fill: "#cccccc",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 36,
         stroke: {color: 0x111111, wifth: 4},
      }})
      this.letter.anchor.set(0.5)
      this.letter.x = 0
      this.letter.y = 0

      this.draw()

      this.addChild(this.graphics)
      this.addChild(this.virusGfx)
      this.addChild(this.letter)
   }

   static increseInfectionRate() {
      Letter.infectRatePerSec +=  0.75
      Letter.infectRatePerSec = Math.min(10.0, Letter.infectRatePerSec)
   }

   setClickCallback( callback ) {
      this.clickCallback = callback
   }

   get text() {
      return this.letter.text
   }

   clickHandler() {
      if ( Letter.wordFull || this.selected  || this.isLost() ) { 
         return
      }
      this.selected = true
      this.draw()
      this.clickCallback(this)
   }

   isInfected() {
      return this.infected && this.virusPercent < 100.0
   }
   isLost() {
      return this.infected && this.virusPercent == 100.0
   }

   deselect() {
      this.selected = false
      this.draw()
   }

   replace( newLetter ) {
      if ( this.isLost() == false ) {
         this.letter.text = newLetter    
      }
   }

   reset( newLetter ) {
      this.selected = false
      this.infected = false 
      this.virusPercent = 0
      this.virusGfx.clear()
      this.letter.text = newLetter 
      this.draw()  
   }

   infect() {
      if ( this.infected == false) {
         this.infected = true
         this.draw()
      }
   }
   fullyInfect() {
      this.infected = true
      this.virusPercent = 100.0
      this.selected = false
      this.letter.text = ""
      this.cursor = 'default'
      this.draw()
      this.drawVirus()
   }

   destroy() {
      this.removeChildren()
   }

   draw() {
      this.graphics.clear()
      this.graphics.circle(0,0, 25).fill(0x4f4f55)

      if (this.selected) {
         this.graphics.stroke({width: 2, color: 0xaaddff})
         this.letter.style.fill = 0xaaddff
      } else {
         this.graphics.stroke({width: 1, color: 0xcccccc})
         if ( this.isLost() ) {
            this.graphics.stroke({width: 1, color: 0x885588})
         } 
         if ( this.isInfected() ) {
            this.letter.style.fill = 0x33aa33
         } else {
            this.letter.style.fill = 0xcccccc
         }
      }
   }

   drawVirus() {
      this.virusGfx.clear()
      let radius = 25.0 * (this.virusPercent/100.0)
      let color = 0x995599
      if ( this.virusPercent == 100) {
         color = 0x550044
      }
      this.virusGfx.circle(0,0,radius).fill(color)
   }

   update(deltaMS, infectedCallback) {
      if ( this.isInfected() ) {
         // only unselected letters grow
         if ( this.selected == false ) {
            this.virusPercent += Letter.infectRatePerSec * (deltaMS/1000.0)
         }
         if (this.virusPercent >= 100.0) {
            this.virusPercent = 100.0
            this.selected = false
            this.letter.text = ""
            this.cursor = 'default'
            this.draw()
            infectedCallback(this.row, this.col)
         }

         this.drawVirus()
      }
   }
}