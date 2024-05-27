import { Container, Graphics, Text, Rectangle } from "pixi.js"
// // import * as TWEEDLE from "tweedle.js"

export default class Tile extends Container {
   static WIDTH = 55 
   static HEIGHT = 55 

   selected = false
   error = false
   success = false
   graphics  = null 
   letter = null
   extra = null 

   constructor(letter, x,y, clickHandler ) {
      super()
      
      this.x = x
      this.y = y
      this.letter = letter

      this.graphics = new Graphics()
      this.addChild(this.graphics)
      
      let txt  = new Text({text: letter.text, style: {
         fill: "#4E6367",
         fontFamily: "Arial",
         fontSize: 36,
      }})
      txt.anchor.set(0.5)
      txt.x = Tile.WIDTH / 2.0 
      txt.y = Tile.HEIGHT / 2.0

      let uTxt = null
      if ( letter.text == "Q") {
         uTxt = new Text({text: "U", style: {
            fill: "#4E6367",
            fontFamily: "Arial",
            fontSize: 18,
         }})
         uTxt.anchor.set(0.5)
         uTxt.x = Tile.WIDTH / 2.0 + 14
         uTxt.y = Tile.HEIGHT / 2.0 + 12    
         txt.x-=8
      }

      let valTxt = new Text({text: `${letter.value}`, style: {
         fill: "#4E6367",
         fontFamily: "Arial",
         fontSize: 14,
      }})
      valTxt.anchor.set(0,1)
      valTxt.x = 4
      valTxt.y = Tile.HEIGHT - 3  

      this.draw()

      this.eventMode = 'static'
      this.hitArea =  new Rectangle(0,0,Tile.WIDTH,Tile.HEIGHT)
      this.cursor ="pointer"
      this.pointerDown = false
      this.on('pointerdown', () => {
         if ( this.selected == false ) {
            this.selected = !this.selected
            if ( clickHandler ) {
               clickHandler( this )
            }
            this.draw()
         }
      })

      
      this.addChild(txt)
      this.addChild(valTxt)
      if (uTxt ) {
         this.addChild(uTxt)
      }
   }

   setSuccess() {
      this.success = true 
      this.selected = false
      this.draw()
      new TWEEDLE.Tween(this.graphics).to({ alpha: 0}, 250).start().easing(TWEEDLE.Easing.Linear.None)//.onComplete(fadeDone)
   }

   get value() {
      return this.letter.value
   }
   get text() {
      let txt = this.letter.text
      if ( txt == "Q") {
         txt += "U"
      }
      return txt
   }

   setError( ) {
      this.error = true 
      this.selected = false
      this.draw()
      setTimeout( () => {
         this.error = false 
         this.draw()
      }, 250)
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

   draw() {
      this.graphics.clear()
 

      this.graphics.rect(0,0, Tile.WIDTH, Tile.HEIGHT).stroke({width:1, color: 0x5E3023})
      if ( this.error ) {
         this.graphics.fill(0xe0adc1) 
      } else if ( this.success) {
         this.graphics.fill(0x75c482) 
      } else {
         if (this.selected) {
            this.graphics.fill(0x8ecae6)
         } else {
            this.graphics.fill(0xF3E9DC)
         }
      }
   }
}
