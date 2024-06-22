import {Text, Graphics, Container, Rectangle} from "pixi.js"
import * as TWEEDLE from "tweedle.js"

export default class Tile extends Container {
   static WIDTH = 50 
   static HEIGHT = 50 

   constructor(scoredLetter, x,y, clickHandler ) {
      super()

      this.x = x
      this.y = y
      this.selected = false
      this.disabled = false
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
         if ( this.disabled ) {
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

   draw() {
      this.graphics.clear()

      this.graphics.rect(0,0, Tile.WIDTH, Tile.HEIGHT).stroke({width: 1, color: 0x03045E})
      if (this.selected) {
         this.graphics.fill(0x00B4D8)
      } else {
         this.graphics.fill(0x83C5BE)
      }
   }
}
