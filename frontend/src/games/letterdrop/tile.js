import { Container, Text, Graphics, Rectangle } from "pixi.js"

export default class Tile extends Container {
   static WIDTH = 60 
   static HEIGHT = 60 

   selected = false
   enabled = true
   toggle = true
   error = false
   graphics  = null 
   letter = null
   extra = null 
   value = null

   constructor(scoredLetter, x,y ) {
      super()
      
      this.tileValue = scoredLetter.value
      this.x = x
      this.y = y

      this.graphics = new Graphics()
      this.letter = new Text({text: scoredLetter.text, style: {
         fill: "#4E6367",
         fontFamily: "Arial",
         fontSize: 36,
      }})
      this.letter.anchor.set(0.5)
      this.letter.x = Tile.WIDTH / 2.0 
      this.letter.y = Tile.HEIGHT / 2.0

      if ( scoredLetter.text == "Q") {
         this.extra = new Text({text: "U", style: {
            fill: "#4E6367",
            fontFamily: "Arial",
            fontSize: 18,
         }})
         this.extra.anchor.set(0.5)
         this.extra.x = Tile.WIDTH / 2.0 + 14
         this.extra.y = Tile.HEIGHT / 2.0 + 12    
         this.letter.x-=8
      }

      this.value = new Text({text: `${this.tileValue}`, style: {
         fill: "#4E6367",
         fontFamily: "Arial",
         fontSize: 14,
      }})
      this.value.anchor.set(0,1)
      this.value.x = 4
      this.value.y = Tile.HEIGHT - 3  

      this.draw()

      this.eventMode = 'static'
      this.hitArea =  new Rectangle(0,0,Tile.WIDTH,Tile.HEIGHT)
      this.cursor ="pointer"
      this.pointerDown = false
      this.on('pointerdown', () => {
         if ( this.toggle == false && this.selected ) {
            return
         }
         this.selected = !this.selected
         if ( this.clickHandler ) {
            this.clickHandler( this )
         }
         this.draw()
      })

      this.addChild(this.graphics)
      this.addChild(this.letter)
      this.addChild(this.value)
      if (this.extra ) {
         this.addChild(this.extra)
      }
   }

   get center() {
      return {
         x: this.x + Tile.WIDTH/2 ,
         y: this.y + Tile.HEIGHT/2
      }
   }

   get score() {
      return this.tileValue
   }

   setError( flag ) {
      this.error = flag 
      this.selected = false
      this.draw()
   }

   setToggle( flag ) {
      this.toggle = flag
   }

   setActive( flag ) { 
      if (flag) {
         this.letter.style.fill = 0xfadf63
         if ( this.extra ) {
            this.extra.style.fill = 0xfadf63
         }
      } else {
         this.letter.style.fill = 0x4E6367
         if ( this.extra ) {
            this.extra.style.fill = 0x4E6367
         }
      }
   }

   setClickHandler( clickHandler ) {
      this.clickHandler = clickHandler  
   }

   text() {
      let txt = this.letter.text
      if ( this.extra) {
         txt += this.extra.text 
      }
      return txt
   }

   select() {
      if ( this.selected == false ) {
         this.selected = true 
         this.draw()
      }
   }

   deselect() {
      if (this.selected ) {
         this.selected = false 
         this.draw(0)
      }
   }

   setEnabled( enabled ) {
      console.log("ENABLE "+enabled+" "+this.letter.text)
      this.enabled = enabled 
      if (this.enabled == false) {
         this.eventMode = 'none'
         this.cursor ="default"
      } else {
         this.eventMode = 'static'
         this.cursor ="pointer"
      }
      this.draw()
   }

   draw() {
      this.graphics.clear()

      if ( this.error ) {
         this.graphics.rect(0,0, Tile.WIDTH, Tile.HEIGHT).fill(0xd36582)
      } else {
         if (this.selected) {
            this.graphics.rect(0,0, Tile.WIDTH, Tile.HEIGHT). 
               stroke({width: 1, color: 0x03045E, alpha: 1}).fill(0x6bbce8)
         } else  {
            let alpha = 1
            if ( this.enabled == false ) {
               alpha = 0.3
            }
            this.graphics.rect(0,0, Tile.WIDTH, Tile.HEIGHT). 
               stroke({width: 1, color: 0x03045E, alpha: alpha}).
               fill({color:0xFAFAFF, alpha: alpha})
         }
      }
   }
}