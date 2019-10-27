import Phaser from 'phaser'

export class Tile {
   static get SIZE() {
      return 45
   }
   constructor(scene, x, y, letter) {
      let sz = Tile.SIZE
      this.scene = scene
      this.rect = new Phaser.Geom.Rectangle(x, y, sz, sz)
      this.letter = letter
      this.selected = false
   }

   isEmpty() {
      return this.letter == ""
   }

   setLetter(l) {
      this.letter = l
      var cfg = {
         fontFamily: 'Josefin Slab',
         fontSize: '24px',
      }

      var text = this.scene.add.text(this.rect.left + 22, this.rect.top + 23, this.letter, cfg)
      text.setOrigin(0.5)
   }

   hit(x, y) {
      let clicked = this.rect.contains(x, y)
      if (clicked) {
         this.selected = !this.selected
      }
      return clicked
   }

   draw() {
      this.scene.graphics.lineStyle(1, 0xffffff)
      this.scene.graphics.strokeRectShape(this.rect)
   }
}


export class Pool {
   constructor (scene, x,y)   {
      this.pool = []
      this.tiles = []

      let SZ = Tile.SIZE
      for (let r = 0; r < 5; r++) {
         this.tiles.push([])
         for (let c = 0; c < 5; c++) {
            let tx = x + (SZ * c)
            let ty = y + (SZ * r)
            let tile = new Tile(scene, tx,ty,'')
            this.tiles[r].push(tile)
         }
      }
   }

   draw() {
      for (let r = 0; r < 5; r++) {
         for (let c = 0; c < 5; c++) {
            this.tiles[r][c].draw()
         }
      }
   }

   stockSize() {
      return this.pool.length
   }

   // Fill any empty tiles with letters from stock
   fillGrid() {
      if (this.stockSize() < 25) {
         this.fillLetterStock()
      }
      for (let r = 0; r < 5; r++) {
         for (let c = 0; c < 5; c++) {
            if (this.tiles[r][c].isEmpty() ) {
               this.tiles[r][c].setLetter( this.pool.pop() )      
            }
         }
      }
   }

   fillLetterStock() {
      // fill pool with letters based on distribution rules...
      this.pool = []
      var i,j
      var dist = {
         2: "J,K,Q,X,Z", 3: "B,C,F,H,M,P,V,W,Y",
         4: "G", 5: "L", 6: "D,S,U", 8: "N",
         9: "T,R", 11: "O,I", 13: "A", 18: "E"}
      for ( var key in dist) {
         var letters = dist[key].split(",")
         var cnt = parseInt(key, 10)
         for (i=0; i<letters.length; i++ ) {
            for (j=0; j<cnt; j++) {
               this.pool.push( letters[i])
            }
         }
      }

      // now shuffle the pool...
      for (i = this.pool.length; i; i -= 1) {
         j = Math.floor(Math.random() * i)
         var x = this.pool[i - 1]
         this.pool[i - 1] = this.pool[j]
         this.pool[j] = x
      }
   }
}
