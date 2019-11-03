import axios from 'axios'
import Phaser from 'phaser'

class Word {
   startRow = 0
   startCol = 0
   wordLength = 0
   direction = ""
   constructor( data ) {
      this.startRow = data.row 
      this.startCol = data.col 
      this.wordLength = data.wordLength 
      this.direction = data.direction
   }
}

class Card {
   name = ""
   layout = []
   words = []
   constructor(data) {
      this.name = data.name 
      this.layout = [] 
      this.words = []
      let row = [] 
      data.layout.forEach( cl=> {
         row.push(cl)
         if (row.length == 5) {
            this.layout.push( row.slice(0))
            row = []
         }
      })

      data.words.forEach( w => {
         let cw = new Word(w)
         this.words.push(cw)  
      })
   }
}

class MiniCard {
   cardInfo = null
   size = 22
   
   constructor(scene, x, y) {
      this.scene = scene
      this.x = x 
      this.y = y
      this.mouseOver = false
      this.selected = false 
      this.disabled = false
      this.fullRect = new Phaser.Geom.Rectangle(x, y, this.size*5, this.size*5)
   }

   setCardInfo( info ) {
      this.cardInfo = info
      this.mouseOver = false
      this.seleced = false 
      this.disabled = false
   }

   mouseMove(x,y) {
      let old = this.mouseOver
      this.mouseOver = this.fullRect.contains(x, y)
      if ( this.mouseOver != old) {
         this.draw()
      }
   }

   mouseDown(x, y) {
      if (this.fullRect.contains(x, y)) {
         this.selected = true 
      }
      return this.selected
   }

   disable() {
      this.disabled = true
   }

   draw() {
      if (this.cardInfo == null) {
         this.drawLoading()
      } else {
         this.drawLayout()
      }
   }

   drawLoading() {
      this.scene.graphics.lineStyle(1, 0xffffff)
      this.scene.graphics.strokeRectShape(this.fullRect)
   }

   drawLayout() {
      this.scene.graphics.fillStyle(0x9a9a9a)
      if (this.selected || this.mouseOver) {
         this.scene.graphics.fillStyle(0x0277bd)
      } 
      this.scene.graphics.lineStyle(1, 0x444444)
      if ( this.disabled) {
         this.scene.graphics.lineStyle(1, 0x222222)
         this.scene.graphics.fillStyle(0x222222)
      }
      for (let r=0; r<5; r++) {
         for (let c = 0; c < 5; c++) { 
            let tx = this.x + (this.size * c)
            let ty = this.y + (this.size * r)
            let rect = new Phaser.Geom.Rectangle(tx, ty, this.size, this.size)
            if (this.cardInfo.layout[r][c] == 1) {
               this.scene.graphics.fillRectShape(rect)
            }
            this.scene.graphics.strokeRectShape(rect)
         }
      }
      this.scene.graphics.lineStyle(1, 0xdadada)
      if ( this.mouseOver) {
         this.scene.graphics.lineStyle(1, 0x0277bd)
      }
      if (this.disabled) {
         this.scene.graphics.lineStyle(1, 0x222222)
      }
      this.scene.graphics.strokeRectShape(this.fullRect)
   }
}

export class Pool {
   constructor(scene) {
      this.loaded =  false
      this.error = null
      this.stock = []
      this.cards = []
      this.choices = []
      this.scene = scene
      this.active = false
      axios.get("/api/wordomino/shapes").then( response => {
         this.createCards(response.data.cards)
         this.refill()
         this.pickTwo()
         this.draw()
      }).catch( err => {
         this.error = err     
      })
   }

   createCards( cardsJson) {
      this.stock = []
      cardsJson.forEach(cardJson => {
         let c = new Card(cardJson)
         this.stock.push( c )   
      });
      this.loaded = true
   }

   pickTwo() {
      this.choices.forEach( choice => {
         let card = this.cards.pop()
         choice.setCardInfo( card )
      })
      this.active = true
   }

   setChoiceCoordinates( x1,y1, x2,y2 ) {
      this.choices.push(new MiniCard(this.scene, x1, y1))    
      this.choices.push(new MiniCard(this.scene, x2, y2))   
   }

   refill() {
      this.cards = this.stock.slice(0)
      this.cards.push(...this.stock.slice(0))
      for (let i = this.cards.length; i; i -= 1) {
         let j = Math.floor(Math.random() * i)
         var c1 = this.cards[i - 1]
         this.cards[i - 1] = this.cards[j]
         this.cards[j] = c1
      }
   }

   isLoaded() {
      return this.loaded
   }
   isActive() {
      return this.active
   }

   failed() {
      return this.error != null
   }

   mouseMove(x,y) {
      if ( this.active) {
         this.choices.forEach(c => {
            c.mouseMove(x,y)
         })
      }
   }
   mouseDown(x, y) {
      let hit = false
      if (this.active) {
         this.choices.forEach(c => {
            if (c.mouseDown(x, y) ) {
               hit = true
               this.active = false
            }
         })
         if (hit) {
            this.choices.forEach(c => {
               if (c.selected == false) {
                  c.disable()
               }
            })
            this.draw()
         }
      }
      return hit
   }

   cardPicked() {
      let pick = null
      this.choices.forEach(c => {
         if (c.selected == true) {
            pick = c.cardInfo
         }
      })
      return pick
   }

   draw() {
      this.choices.forEach( c=> {
         c.draw()
      })
   }
}