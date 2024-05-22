import { Container, Graphics, Text, Circle } from "pixi.js"

export default class Letter extends Container {
   static wordFull = false 

   // 100% is full so take 100 / rate to get time for total infection
   static infectRatePerSec = 5.0 // 20 sec to fill

   constructor(x,y, r,c ) {
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
      this.letter = null
      this.letterDisplay = new Text({text: "", style: {
         fill: "#ccccff",
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 36,
         stroke: {color: 0x000000, width: 3},
      }})
      this.letterDisplay.anchor.set(0.5)
      this.letterDisplay.x = 0
      this.letterDisplay.y = 0

      this.draw()

      this.addChild(this.graphics)
      this.addChild(this.virusGfx)
      this.addChild(this.letterDisplay)
   }

   static increseInfectionRate() {
      Letter.infectRatePerSec +=  0.75
      Letter.infectRatePerSec = Math.min(10.0, Letter.infectRatePerSec)
   }

   setClickCallback( callback ) {
      this.clickCallback = callback
   }

   get text() {
      if ( this.letter == null ) return ""
      return this.letter.text
   }
   get value() {
      if ( this.letter == null ) return 0
      return this.letter.value
   }
   get isSelected() {
      return this.selected
   }

   clickHandler() {
      if ( Letter.wordFull || this.selected  || this.isLost ) { 
         return
      }
      this.selected = true
      this.letterDisplay.style.fill = 0x48cae4  
      this.draw()
      this.clickCallback(this)
   }

   get isInfected() {
      return this.infected && this.virusPercent < 100.0
   }
   get isLost() {
      return this.infected && this.virusPercent == 100.0
   }

   deselect() {
      if (this.selected) {
         this.selected = false
         this.letterDisplay.style.fill = 0xcccccc  
         this.draw()
      }
   }

   replace( newLetter ) {
      if ( this.isLost == false ) {
         this.letter = newLetter
         this.letterDisplay.text = newLetter.text 
         this.letterDisplay.style.fill = 0xcccccc  
      }
   }

   reset( newLetter ) {
      this.letter = newLetter
      this.selected = false
      this.infected = false 
      this.virusPercent = 0
      this.virusGfx.clear()
      this.letterDisplay.text = newLetter.text
      this.letterDisplay.style.fill = 0xcccccc
      this.draw()  
   }

   infect() {
      if ( this.infected == false) {
         this.infected = true
         this.letterDisplay.style.fill = 0x44dd22
         this.draw()
      }
   }
   fullyInfect() {
      this.infected = true
      this.virusPercent = 100.0
      this.selected = false
      this.letterDisplay.text = ""
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
         this.graphics.stroke({width: 2, color: 0x48cae4})
      } else {
         this.graphics.stroke({width: 1, color: 0xcccccc})
      }
   }

   drawVirus() {
      this.virusGfx.clear()
      let radius = 25.0 * (this.virusPercent/100.0)
      let color = 0xc45ab3// 0x995599
      if ( this.virusPercent == 100) {
         color = 0xc683c3 //0x550044
      }
      this.virusGfx.circle(0,0,radius).fill(color).stroke({width:3, color: 0x631a86})
      if ( this.virusPercent == 100) {
         this.virusGfx.circle(0,0,3).fill(0x631a86)
      }
   }

   update(deltaMS, infectedCallback) {
      if ( this.isInfected ) {
         // only unselected letters grow
         if ( this.selected == false ) {
            this.virusPercent += Letter.infectRatePerSec * (deltaMS/1000.0)
         }
         if (this.virusPercent >= 100.0) {
            this.virusPercent = 100.0
            this.selected = false
            this.letterDisplay.text = ""
            this.cursor = 'default'
            this.draw()
            infectedCallback(this.row, this.col)
         }

         this.drawVirus()
      }
   }
}