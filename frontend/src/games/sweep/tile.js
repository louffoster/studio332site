import * as PIXI from "pixi.js"

export default class Tile extends PIXI.Container {
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

      let style = new PIXI.TextStyle({
         fill: "#CAF0F8",
         fontFamily: "Arial",
         fontSize: 36,
         stroke: '#03045E',
         strokeThickness: 1,
      })
      let smallStyle = new PIXI.TextStyle({
         fill: "#CAF0F8",
         fontFamily: "Arial",
         fontSize: 18,
         stroke: '#03045E',
         strokeThickness: 1,
      })
      let scoreStyle = new PIXI.TextStyle({
         fill: "#CAF0F8",
         fontFamily: "Arial",
         fontSize: 12,
      })

      this.graphics = new PIXI.Graphics()
      this.letter = new PIXI.Text(scoredLetter.text, style)
      this.letter.anchor.set(0.5)
      this.letter.x = Tile.WIDTH / 2.0 
      this.letter.y = Tile.HEIGHT / 2.0
      if ( scoredLetter.text == "Q") {
         this.extra = new PIXI.Text("U", smallStyle)
         this.extra.anchor.set(0.5)
         this.extra.x = Tile.WIDTH / 2.0 + 14
         this.extra.y = Tile.HEIGHT / 2.0 + 12    
         this.letter.x-=8
      }

      let scoreTxt = `${this.tileValue}`
      this.value = new PIXI.Text(scoreTxt, scoreStyle)
      this.value.anchor.set(0,1)
      this.value.x = 4
      this.value.y = Tile.HEIGHT - 3  

      this.draw()

      this.eventMode = 'static'
      this.hitArea =  new PIXI.Rectangle(0,0,Tile.WIDTH,Tile.HEIGHT)
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

   set( letterTile ) {
      this.letter.text = letterTile.text 
      this.tileValue = letterTile.score
      this.value.text = `${letterTile.score}`
   }

   draw() {
      if ( this.cleared) {
         this.graphics.clear()
         this.graphics.beginFill(0x004080)
         this.graphics.lineStyle(1, 0x03045E, 1)
         this.graphics.drawRect(0,0, Tile.WIDTH, Tile.HEIGHT)
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
      this.graphics.drawRect(0,0, Tile.WIDTH, Tile.HEIGHT)
      this.graphics.endFill()
   }

   isVowel() {
      let vowel = ["A","E","I","O","U","Y"]
      return ( vowel.includes( this.text ) )
   }
}
