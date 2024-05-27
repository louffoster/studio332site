import {Text, Graphics, Container, Rectangle} from "pixi.js"
// import * as TWEEDLE from "tweedle.js"

export default class Tile extends Container {
   static WIDTH = 60 
   static HEIGHT = 60 

   constructor(scoredLetter, x,y, clickHandler ) {
      super()

      this.x = x
      this.y = y
      this.selected = false
      this.cleared = false
      this.disabled = false
      this.toggle = false
      this.tileValue = scoredLetter.value

      this.graphics = new Graphics()
      this.letter = new Text({
         text: scoredLetter.text, 
         style: {
            fill: "#CAF0F8",
            fontFamily: "Arial",
            fontSize: 36,
            stroke: {color:'#03045E', width: 1}
         }
      })
      this.letter.anchor.set(0.5)
      this.letter.x = Tile.WIDTH / 2.0 
      this.letter.y = Tile.HEIGHT / 2.0
      if ( scoredLetter.text == "Q") {
         this.extra = new Text({
            text:"U", 
            style: {
               fill: "#CAF0F8",
               fontFamily: "Arial",
               fontSize: 18,
               stroke: {color: '#03045E', width: 1},
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
            fill: "#CAF0F8",
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
         if ( this.disabled || this.cleared ) {
            return
         }
         if ( this.selected && this.toggle ) {
            this.selected = false 
            clickHandler( this )
            this.draw()
            return
         }
         if ( this.selected == false ) {
            this.selected = true 
            clickHandler( this )
            this.draw()
         }
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
      new TWEEDLE.Tween(this.graphics).
         to({ alpha: 0}, 200).
         easing(TWEEDLE.Easing.Quadratic.Out).
         onComplete( () => {
            this.cleared = true
            this.selected = false
            this.letter.text = ""
            if ( this.extra ) {
               this.extra.text = ""
            }
            this.value.text = ""
            this.eventMode = 'none'
            this.cursor ="default"
            this.draw()
         }
      ).start()
   }

   set( letterTile ) {
      this.letter.text = letterTile.text 
      this.tileValue = letterTile.score
      this.value.text = `${letterTile.score}`
   }

   draw() {
      this.graphics.clear()
      if ( this.cleared) {
         this.graphics.rect(0,0, Tile.WIDTH, Tile.HEIGHT).
            stroke({width: 1, color: 0x03045E}).fill(0x004080)
         return
      }

      this.graphics.rect(0,0, Tile.WIDTH, Tile.HEIGHT).stroke({width: 1, color: 0x03045E})
      if (this.selected) {
         this.graphics.fill(0x00B4D8)
      } else {
         if ( this.isVowel() ) {
            this.graphics.fill(0x0067a6)
         } else {
            this.graphics.fill(0x0077B6)
         }
      }
   }

   isVowel() {
      let vowel = ["A","E","I","O","U","Y"]
      return ( vowel.includes( this.text ) )
   }
}
