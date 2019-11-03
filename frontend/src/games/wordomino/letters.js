import Tile from './tile'

export class Pool {
   constructor (scene, x,y)   {
      this.pool = []
      this.tiles = []
      this.active = false
      this.selectedLetter = ""

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

   isActive() {
      return this.active
   }
   activate() {
      this.active = true
   }
   deactivate() {
      this.active = false
   }

   mouseMove(x, y) {
      if (this.active) {
         for(let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
               this.tiles[r][c].mouseMove(x,y)
            }
         }
      }
   }
   mouseDown(x, y) {
      let hit = false
      if (this.active) {
         for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
               if (this.tiles[r][c].mouseDown(x, y)) {
                  this.selectedLetter = this.tiles[r][c].letter.text
                  hit = true
               }
            }
         }
      }
      return hit
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
