import * as PIXI from "pixi.js"
import * as TWEEDLE from "tweedle.js"

export default class Tile extends PIXI.Container {
   static WIDTH = 55 
   static HEIGHT = 55 

   selected = false
   error = false
   graphics  = null 
   letter = null
   extra = null 

   constructor(letter, x,y, clickHandler ) {
      super()
      
      this.x = x
      this.y = y
      this.letter = letter

      let style = new PIXI.TextStyle({
         fill: "#4E6367",
         fontFamily: "Arial",
         fontSize: 36,
      })
      let smallStyle = new PIXI.TextStyle({
         fill: "#4E6367",
         fontFamily: "Arial",
         fontSize: 18,
      })
      let scoreStyle = new PIXI.TextStyle({
         fill: "#4E6367",
         fontFamily: "Arial",
         fontSize: 14,
      })

      this.graphics = new PIXI.Graphics()
      let txt  = new PIXI.Text(letter.text, style)
      txt.anchor.set(0.5)
      txt.x = Tile.WIDTH / 2.0 
      txt.y = Tile.HEIGHT / 2.0

      let uTxt = null
      if ( letter.text == "Q") {
         uTxt = new PIXI.Text("U", smallStyle)
         uTxt.anchor.set(0.5)
         uTxt.x = Tile.WIDTH / 2.0 + 14
         uTxt.y = Tile.HEIGHT / 2.0 + 12    
         txt.x-=8
      }

      let valTxt = new PIXI.Text(`${letter.value}`, scoreStyle)
      valTxt.anchor.set(0,1)
      valTxt.x = 4
      valTxt.y = Tile.HEIGHT - 3  

      this.draw()

      this.eventMode = 'static'
      this.hitArea =  new PIXI.Rectangle(0,0,Tile.WIDTH,Tile.HEIGHT)
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

      this.addChild(this.graphics)
      this.addChild(txt)
      this.addChild(valTxt)
      if (uTxt ) {
         this.addChild(uTxt)
      }
   }

   fade() {
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

   setError( flag ) {
      this.error = flag 
      this.selected = false
      this.draw()
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
 
      this.graphics.beginFill(0xF3E9DC, 1.0)
      this.graphics.lineStyle(1, 0x5E3023, 1)

      if ( this.error ) {
         this.graphics.beginFill(0xd36582) 
      } else {
         if (this.selected) {
            this.graphics.beginFill(0x8ecae6)
         } 
      }
      this.graphics.drawRect(0,0, Tile.WIDTH, Tile.HEIGHT)
      this.graphics.endFill()
   }
}
