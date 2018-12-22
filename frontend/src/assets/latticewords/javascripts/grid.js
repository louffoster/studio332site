const ANIMATE_SPEED = 250
const LETTER_COLOR = '#0e267f'
const SELECT_COLOR = '#2f95ff'
const BONUS_COLOR = '#dd5'
const BONUS_STROKE = '#139'

import axios from 'axios'

export default class Grid  {
   constructor(scene, rows, cols, tileSize, pool) {
      this.scene = scene
      this.rows = rows
      this.cols = cols
      this.tileSize = tileSize
      this.red = false
      this.animating = false
      this.priorTile = null
      this.pool = pool

      this.bkg = this.scene.add.image(0,0,  'grid-bkg')
      this.bkg.setOrigin(0,0)
      this.width =  this.bkg.width
      this.height = this.bkg.height
      this.tilesGroup = this.scene.add.container(70,40+70, [this.bkg])

      var grid = this.scene.add.sprite(0,40, 'grid')
      grid.setOrigin(0,0)
      this.grid = [ ]
   }

   empty(  ) {
      for (var r=0; r<this.rows; r++) {
         for (var c=0; c<this.cols; c++) {
            this.grid[r][c].letter.destroy()
         }
      }
      this.red = false
      this.animating = false
      this.grid = [ ]
   }

   fill( ) {
      this.red = false
      this.animating = false
      this.grid = [ ]
      for (var r=0; r<this.rows; r++) {
         this.grid.push( [] )
         for (var c=0; c<this.cols; c++) {
            var letter = this.pool.pop()
            this.grid[r].push( this.addTile(letter, r, c, false, false) )
         }
      }
   }

   destroySelectedTiles(pool) {
      var coords = []
      var letters = []
      for ( var r=0; r<this.rows; r++ ) {
         for ( var c=0; c<this.cols; c++ ) {
            var tile = this.grid[r][c]
            if ( tile.selected == true ) {
               coords.push( r+","+c )
               letters.push(tile.letter)
            }
         }
      }
      this.scene.tweens.add({targets: letters, alpha:0,
         duration: 250, ease: 'Linear',
         onCompleteParams: [ this ],
         onComplete: function (tween, targets, self) {
            for (var j=0; j<coords.length;j++) {
               var loc = coords[j].split(",")
               var letterObj = letters[j]
               letterObj.destroy()
               var letter = pool.pop()
               if ( pool.length == 0) {
                  pool.refill()
               }
               self.grid[loc[0]][loc[1]] = self.addTile(letter, loc[0], loc[1] )
            }
         }}
      )
   }

   checkWords( scoreHandler ) {
      var words = []
      var word = ""
      var coords = []
      var r,c

      // first find words in rows
      for (r=0; r<this.rows; r++ ) {
         for ( c=0;c<this.cols; c++) {
            if ( this.grid[r][c].selected === true ) {
               word +=  this.grid[r][c].letter.text
               coords.push( r+","+c )
            } else {
               if (word.length > 1 ) {
                  words.push(word)
               }
               word = ""
            }
         }
         if (word.length > 1 ) {
            words.push(word)
            word = ""
         }
      }

      // Now in columns...
      word = ""
      for ( c=0; c<this.cols; c++ ) {
         for ( r=0;r<this.rows; r++) {
            if ( this.grid[r][c].selected === true ) {
               word +=  this.grid[r][c].letter.text
               var coord = r+","+c
               if (coords.includes(coord) == false )  {
                  coords.push(coord)
               }
            } else {
               if (word.length > 1 ) {
                  words.push(word)
               }
               word = ""
            }
         }
         if (word.length > 1 ) {
            words.push(word)
            word = ""
         }
      }

      // If no words, bail
      if (words.length === 0 ) {
         return
      }

      var self = this
      axios.post('/api/latticewords/check', {words: words.join(",")})
      .then(function (response) {
         self.handleResults(response.data, coords, scoreHandler )
      })
      .catch(function (error) {
         console.log(error)
      })
   }

   handleResults(total, coords, scoreHandler) {

      // If total > 0, all letters score and are replaced
      // otherwise, the whole submission fails
      if (total === 0) {
         this.showFailure(coords)
         return
      }

      var addTime = 0
      var tiles = []
      for (var j=0; j<coords.length;j++) {
         var loc = coords[j].split(",")
         var tile = this.grid[loc[0]][loc[1]]
         if (tile.bonus == true) {
            addTime = 20
         }
         tiles.push(tile.letter)
      }

      scoreHandler(total, addTime)

      // fade out then replace onComplete
      var self = this
      this.scene.tweens.add({targets: tiles ,alpha:0,
         duration: 250, ease: 'Linear',
         onComplete: function() {
            self.replaceUsedTiles(coords)
         }
      })

   }

   replaceUsedTiles(coords) {
      for (var j=0; j<coords.length;j++) {
         var loc = coords[j].split(",")
         var tile = this.grid[loc[0]][loc[1]]
         tile.letter.destroy()
         var letter = this.pool.pop()
         if ( this.pool.length == 0) {
            this.refillLetters()
         }
         this.grid[loc[0]][loc[1]] = this.addTile(letter, loc[0], loc[1] )
      }
   }

   showFailure(coords) {
      var tiles = []
      for (var j=0; j<coords.length;j++) {
         var loc = coords[j].split(",")
         var tile = this.grid[loc[0]][loc[1]]
         tile.selected = false
         tile.letter.setFill("#ff0000")
         tiles.push(tile)
      }
      var d=0
      var tint = false
      this.scene.tweens.addCounter({
         from: 0,
         to: 50,
         duration: 1000,
         onUpdate: function () {
            d+=1
            if (d==10) {
               d = 0
               tint = !tint
               for ( var i=0; i<tiles.length; i++) {
                  if (tint==false) {
                     tiles[i].letter.setFill("#ff0000")
                  } else {
                     tiles[i].letter.setFill(LETTER_COLOR)
                  }
               }
            }
         },
         onComplete: function() {
            for ( var i=0; i<tiles.length; i++) {
               tiles[i].letter.setFill(LETTER_COLOR)
            }
         }
      })
   }

   flash() {
      this.red = !this.red
      if ( this.red == false) {
         this.bkg.clearTint()
      } else {
         this.bkg.setTint('0xccffff')
      }
   }

   addTile(letter, row, col, selected, clone) {
      var tileX = 42+this.tileSize*col
      var tileY = 43+this.tileSize*row
      var bonus = false

      var cfg = {
         fontSize: '52px',
         fontWeight: 'bold',
         fill: LETTER_COLOR,
         align: 'center'
      }

      var text = this.scene.add.text( tileX, tileY, letter, cfg)
      text.setOrigin(0.5)
      if ( selected === true ) {
         text.setFill(SELECT_COLOR)
      }
      if (clone === false ) {
         text.alpha = 0
         this.scene.tweens.add({targets: text,alpha:1,
            duration: 250, ease: 'Linear'})
         if ( this.hasBonus() == false ) {
            var chance = Math.floor(Math.random() * 100)
            if ( chance > 96 ) {
               text.setFill(BONUS_COLOR)
               text.setStroke(BONUS_STROKE,4)
               bonus = true
            }
         }
      }

      this.tilesGroup.add(text)
      return {letter: text, selected: selected, bonus: bonus}
   }

   hasBonus() {
      var cnt = 0
      for (var r=0; r<this.rows; r++) {
         for (var c=0; c<this.cols; c++) {
            var letter = this.grid[r][c]
            if (typeof letter === "undefined") return false
            if (letter.bonus == true ) {
               cnt++
               if ( cnt === 3) return true
            }
         }
      }
      return false
   }

   handlePointerUp() {
      this.priorTile = null
   }

   handlePointerDown(screenX, screenY) {
      var gridX = screenX - 70
      var gridY = screenY - 110
      console.log("W: "+this.width)
      if ( gridX <10 || gridY <10 || gridX >= this.width-20 || gridY >= this.height-20) {
         this.priorTile = null
         return
      }

      var col = Math.floor( gridX / this.tileSize)
      var row = Math.floor( gridY / this.tileSize)
      console.log("X: "+gridX+", Y: "+gridY+" : R="+row+" C="+col)
      var tile = this.grid[row][col]
      if ( this.priorTile != tile ) {
         this.priorTile = tile
         if (tile.selected == false ) {
            tile.selected = true
            tile.letter.setFill(SELECT_COLOR)
         } else {
            tile.selected = false
            if ( tile.bonus ) {
               tile.letter.setFill(BONUS_COLOR)
            } else {
               tile.letter.setFill(LETTER_COLOR)
            }
         }
      }
   }

   shiftTiles(activeButton) {
      switch (activeButton[0]) {
         case "R":
            this.shiftRight( parseInt(activeButton[1],10) )
            break
         case "L":
            this.shiftLeft( parseInt(activeButton[1],10) )
            break
         case "U":
            this.shiftUp( parseInt(activeButton[1],10) )
            break
         case "D":
            this.shiftDown( parseInt(activeButton[1],10) )
            break
      }
   }

   shiftRight(row) {
      if (this.animating) return

      this.animating = true
      var tiles = this.grid[row]
      var lastTile = tiles[tiles.length-1]
      var standIn = this.addTile( lastTile.letter.text,row,-1, lastTile.selected, true)
      var targets = [standIn.letter]
      for (var i=0; i<this.cols; i++) {
         targets.push(tiles[i].letter)
      }
      this.scene.tweens.add({
         targets: targets,
         x: '+='+this.tileSize,
         duration: ANIMATE_SPEED,
         ease: 'Linear',
         onCompleteParams: [ this ],
         onComplete: function (tween, targets, self) {
            for (var j=tiles.length-1; j>0; j-- ) {
               var tile = tiles[j-1]
               tiles[j] = tile
            }
            tiles[0] = standIn
            lastTile.letter.destroy()
            self.animating = false
         }
      })
   }

   shiftLeft(row) {
      if (this.animating) return

      this.animating = true
      var tiles = this.grid[row]
      var firstTile = tiles[0]
      var standIn = this.addTile( firstTile.letter.text,row, this.rows, firstTile.selected, true)
      var targets = [standIn.letter]
      for (var i=0; i<this.cols; i++) {
         targets.push(tiles[i].letter)
      }
      this.scene.tweens.add({
         targets: targets,
         x: '-='+this.tileSize,
         duration: ANIMATE_SPEED,
         ease: 'Linear',
         onCompleteParams: [ this ],
         onComplete: function (tween, targets, self) {

            for (var j=0; j<tiles.length-1; j++ ) {
               var tile = tiles[j+1]
               tiles[j] = tile
            }
            tiles[tiles.length-1] = standIn
            firstTile.letter.destroy()
            self.animating = false
         }
      })
   }

   shiftUp(col) {
      if (this.animating) return

      this.animating = true
      var tiles = []
      var targets = []
      for (var r=0; r<this.rows; r++) {
         var tileInfo = this.grid[r][col]
         tiles.push( tileInfo )
         targets.push( tileInfo.letter)
      }
      var firstTile = tiles[0]
      var standIn = this.addTile( firstTile.letter.text, this.rows, col, firstTile.selected, true)
      targets.push( standIn.letter)

      this.scene.tweens.add({
         targets: targets,
         y: '-='+this.tileSize,
         duration: ANIMATE_SPEED,
         ease: 'Linear',
         onCompleteParams: [ this ],
         onComplete: function (tween, targets, self) {
            for (var j=0; j<tiles.length-1; j++ ) {
               var tile = tiles[j+1]
               self.grid[j][col] = tile
            }
            self.grid[tiles.length-1][col] = standIn
            firstTile.letter.destroy()
            self.animating = false
         }
      })
   }

   shiftDown(col) {
      if (this.animating) return

      this.animating = true
      var tiles = []
      var targets = []
      for (var r=0; r<this.rows; r++) {
         var tileInfo = this.grid[r][col]
         tiles.push( tileInfo )
         targets.push( tileInfo.letter)
      }
      var lastTile = tiles[tiles.length-1]
      var standIn = this.addTile( lastTile.letter.text, -1, col, lastTile.selected, true)
      targets.push( standIn.letter)

      this.scene.tweens.add({
         targets: targets,
         y: '+='+this.tileSize,
         duration: ANIMATE_SPEED,
         ease: 'Linear',
         onCompleteParams: [ this ],
         onComplete: function (tween, targets, self) {
            for (var j=tiles.length-1; j>0; j-- ) {
               var tile = tiles[j-1]
               self.grid[j][col] = tile
            }
            self.grid[0][col] = standIn
            lastTile.letter.destroy()
            self.animating = false
         }
      })
   }
}
