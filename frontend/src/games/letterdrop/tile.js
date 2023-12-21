import * as PIXI from "pixi.js"

export default class Tile extends PIXI.Container {
   static WIDTH = 60 
   static HEIGHT = 60 

   constructor(letter, x,y ) {
      super()

      this.x = x
      this.y = y
      this.selected = false
      this.enabled = true
      this.toggle = true
      this.error = false

      this.style = new PIXI.TextStyle({
         fill: "#4E6367",
         fontFamily: "Arial",
         fontSize: 36,
      })
      this.smallStyle = new PIXI.TextStyle({
         fill: "#4E6367",
         fontFamily: "Arial",
         fontSize: 18,
      })

      this.graphics = new PIXI.Graphics()
      this.letter = new PIXI.Text(letter, this.style)
      this.letter.anchor.set(0.5)
      this.letter.x = Tile.WIDTH / 2.0 
      this.letter.y = Tile.HEIGHT / 2.0

      if ( letter == "Q") {
         this.extra = new PIXI.Text("U", this.smallStyle)
         this.extra.anchor.set(0.5)
         this.extra.x = Tile.WIDTH / 2.0 + 14
         this.extra.y = Tile.HEIGHT / 2.0 + 12    
         this.letter.x-=8
      }

      this.draw()

      this.eventMode = 'static'
      this.hitArea =  new PIXI.Rectangle(0,0,Tile.WIDTH,Tile.HEIGHT)
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
      if (this.extra ) {
         this.addChild(this.extra)
      }
   }

   setError( delay ) {
      this.error = true 
      this.selected = false
      this.draw()
      setTimeout( () => {
         this.error = false 
         this.draw()
      }, delay)
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

   setPosition(x,y) {
      this.x = x 
      this.y = y
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
 
      this.graphics.beginFill(0xFAFAFF)
      this.graphics.lineStyle(1, 0x03045E, 1)

      if ( this.error ) {
         this.graphics.beginFill(0xd36582) 
      } else {
         if ( this.enabled == false ) {
            this.graphics.beginFill(0xdAdAdF)    
         }
         if (this.selected) {
            this.graphics.beginFill(0x6bbce8)
         } 
      }
      this.graphics.drawRect(0,0, Tile.WIDTH, Tile.HEIGHT)
      this.graphics.endFill()
   }
}
