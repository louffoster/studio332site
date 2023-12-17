import * as PIXI from "pixi.js"

export default class Letter extends PIXI.Container {
   static WIDTH = 60 
   static HEIGHT = 60 

   constructor(letter, x,y ) {
      super()

      this.x = x
      this.y = y
      this.selected = false

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
      this.letter.x = Letter.WIDTH / 2.0 
      this.letter.y = Letter.HEIGHT / 2.0

      if ( letter == "Q") {
         this.extra = new PIXI.Text("U", this.smallStyle)
         this.extra.anchor.set(0.5)
         this.extra.x = Letter.WIDTH / 2.0 + 14
         this.extra.y = Letter.HEIGHT / 2.0 + 12    
         this.letter.x-=8
      }

      this.draw()

      this.eventMode = 'static'
      this.hitArea =  new PIXI.Rectangle(0,0,Letter.WIDTH,Letter.HEIGHT)
      this.cursor ="pointer"
      this.pointerDown = false
      this.on('pointerdown', () => {
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

   deselect() {
      if (this.selected ) {
         this.selected = false 
         this.draw(0)
      }
   }

   draw() {
      this.graphics.clear()
 
      this.graphics.beginFill(0xFAFAFF)
      this.graphics.lineStyle(1, 0x03045E, 1)

      if (this.selected) {
         this.graphics.beginFill(0x6bbce8)
      } 
      this.graphics.drawRect(0,0, Letter.WIDTH, Letter.HEIGHT)
      this.graphics.endFill()
   }
}
