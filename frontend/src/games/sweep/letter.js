import * as PIXI from "pixi.js"

export default class Letter extends PIXI.Container {
   static WIDTH = 60 
   static HEIGHT = 60 

   constructor(letter, x,y, clickHandler ) {
      super()

      this.x = x
      this.y = y
      this.selected = false
      this.cleared = false
      this.disabled = false
      this.toggle = false

      this.style = new PIXI.TextStyle({
         fill: "#CAF0F8",
         fontFamily: "Arial",
         fontSize: 36,
         stroke: '#03045E',
         strokeThickness: 4,
      })

      this.graphics = new PIXI.Graphics()
      this.letter = new PIXI.Text(letter, this.style)
      this.letter.anchor.set(0.5)
      this.letter.x = Letter.WIDTH / 2.0 
      this.letter.y = Letter.HEIGHT / 2.0

      this.draw()

      this.eventMode = 'static'
      this.hitArea =  new PIXI.Rectangle(0,0,Letter.WIDTH,Letter.HEIGHT)
      this.cursor ="pointer"
      this.pointerDown = false
      this.on('pointerdown', () => {
         if ( this.disabled || this.cleared ) {
            return
         }
         if ( this.selected && this.toggle ) {
            this.selected = false 
            clickHandler( this.letter )
            this.draw()
            return
         }
         if ( this.selected == false ) {
            this.selected = true 
            clickHandler( this.letter )
            this.draw()
         }
      })

      this.addChild(this.graphics)
      this.addChild(this.letter)
   }

   text() {
      return this.letter.text
   }

   set( letter ) {
      this.letter.text = letter
   }

   setToggle() {
      this.toggle = true
   }

   disable() {
      this.disabled = true
      this.eventMode = 'none'
      this.cursor ="default"
   }
   enable() {
      this.disabled = false
      this.eventMode = 'static'
      this.cursor ="pointer"
   }

   deselect() {
      if (this.selected && !this.cleared) {
         this.selected = false 
         this.draw(0)
      }
   }

   clear() {
      this.cleared = true
      this.selected = false
      this.letter.text = ""
      this.eventMode = 'none'
      this.cursor ="default"
      this.draw()
   }

   reset( letter ) {
      this.letter.text = letter 
      this.cleared = false  
      this.eventMode = 'static'
      this.cursor ="pointer"
      this.draw()
   }

   draw() {
      if ( this.cleared) {
         this.graphics.clear()
         this.graphics.beginFill(0x004080)
         this.graphics.lineStyle(1, 0x03045E, 1)
         this.graphics.drawRect(0,0, Letter.WIDTH, Letter.HEIGHT)
         this.graphics.endFill()
         return
      }
      this.graphics.clear()
      if ( this.isVowel() ) {
         this.graphics.beginFill(0x0067a6)
      } else {
         this.graphics.beginFill(0x0077B6)
      }
      this.graphics.lineStyle(1, 0x03045E, 1)

      if (this.selected) {
         this.graphics.beginFill(0x00B4D8)
      } 
      this.graphics.drawRect(0,0, Letter.WIDTH, Letter.HEIGHT)
      this.graphics.endFill()
   }

   isVowel() {
      let vowel = ["A","E","I","O","U","Y"]
      return ( vowel.includes(this.text()) )
   }
}
