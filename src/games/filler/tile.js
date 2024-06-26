import {Text, Graphics, Container, Rectangle} from "pixi.js"
import * as TWEEDLE from "tweedle.js"

export default class Tile extends Container {
   static WIDTH = 50 
   static HEIGHT = 50 

   constructor(scoredLetter, x,y, clickHandler ) {
      super()

      this.row = -1 
      this.col = -1
      this.x = x
      this.y = y
      this.selected = false
      this.disabled = false
      this.target = false
      this.highlight = false
      this.used = false
      this.tileValue = scoredLetter.value

      this.graphics = new Graphics()
      this.letter = new Text({
         text: scoredLetter.text, 
         style: {
            fill: "#073B4C",
            fontFamily: "Arial",
            fontSize: 36,
         }
      })
      this.letter.anchor.set(0.5)
      this.letter.x = Tile.WIDTH / 2.0 
      this.letter.y = Tile.HEIGHT / 2.0
      if ( scoredLetter.text == "Q") {
         this.extra = new Text({
            text:"U", 
            style: {
               fill: "#073B4C",
               fontFamily: "Arial",
               fontSize: 18,
            }
         })
         this.extra.anchor.set(0.5)
         this.extra.x = Tile.WIDTH / 2.0 + 14
         this.extra.y = Tile.HEIGHT / 2.0 + 12    
         this.letter.x-=8
      }

      let scoreTxt = `${this.tileValue}`
      this.value = new Text({
         text:scoreTxt, 
         style: {
            fill: "#073B4C",
            fontFamily: "Arial",
            fontSize: 12,
         }
      })
      this.value.anchor.set(0,1)
      this.value.x = 4
      this.value.y = Tile.HEIGHT - 3  

      this.draw()

      this.eventMode = 'static'
      this.hitArea =  new Rectangle(0,0,Tile.WIDTH,Tile.HEIGHT)
      this.cursor ="pointer"
      this.pointerDown = false
      this.on('pointerdown', () => {
         if ( this.disabled || this.used ) {
            return
         }
         clickHandler( this )
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

   get text() {
      let txt = this.letter.text
      if ( this.extra) {
         txt += this.extra.text 
      }
      return txt
   }
   get score() {
      return this.tileValue
   }

   setGridLocation( r,c ) {
      this.row = r 
      this.col = c
   }

   setEnabled( isEnabled ) {
      if ( isEnabled == false) {
         this.disabled = true
         this.eventMode = 'none'
         this.cursor ="default"
      } else {
         this.disabled = false
         this.eventMode = 'static'
         this.cursor ="pointer"
      }
   }

   deselect() {
      if (this.selected) {
         this.selected = false 
         this.draw()
      }
   }
   select() {
      if (this.selected == false) {
         this.selected = true 
         this.draw()
      }
   }

   setTarget( flag) {
      this.target = flag
      this.letter.style.fill = 0x073B4C 
      if (this.extra ) {
         this.extra.style.fill = 0x073B4C 
      }
      if ( flag ) {
         this.letter.style.fill = 0xEDF6F9 
         if (this.extra ) {
            this.extra.style.fill = 0xEDF6F9
         }
      }
   }

   setHighlight( flag ) {
      this.highlight = flag
      this.draw()
   }

   setUsed( ) {
      this.highlight = false
      this.setTarget( false )
      this.error = false
      this.selected = false
      this.used = true
      this.removeChild(this.letter)
      this.removeChild(this.value)
      if (this.extra ) {
         this.removeChild(this.extra)
      }
      this.disabled = true
      this.eventMode = 'none'
      this.cursor ="default"
      this.draw()
   }

   setError( ) {
      this.highlight = false
      this.setTarget( false )
      this.error = true 
      this.selected = false
      this.draw()
      setTimeout( () => {
         this.error = false 
         this.draw()
      }, 750)
   }

   draw() {
      this.graphics.clear()

      this.graphics.rect(0,0, Tile.WIDTH, Tile.HEIGHT).stroke({width: 1, color: 0x03045E})
      if ( this.used ) {
         this.graphics.fill(0x804Cb5)
      } else {
         if ( this.error ) {
            this.graphics.fill(0xe0adc1) 
         } else if (this.selected) {
            this.graphics.fill(0xA06CD5)//0x00B4D8)
         } else {
            if ( this.highlight ) {
               this.graphics.fill(0xb3f5eE)//0x00B4D8)
            } else {
               this.graphics.fill(0x83C5BE)
            }
         }
      }
   }
}
