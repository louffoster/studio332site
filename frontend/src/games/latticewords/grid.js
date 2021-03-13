const ANIMATE_SPEED = 150
const LETTER_COLOR = '#0e267f'
const SELECT_COLOR = '#2f95ff'

import axios from 'axios'

export default class Grid  {
   constructor(scene, rows, cols, tileSize, pool) {
      this.scene = scene
      this.rows = rows
      this.cols = cols
      this.tileSize = tileSize
      this.red = false
      this.animating = false
      this.pool = pool
      this.lastR = -1
      this.lastC = -1

      this.bkg = this.scene.add.rectangle(0, 0, tileSize*cols, tileSize*rows, 0xffffff)
      this.bkg.setOrigin(0,0)
      this.width =  this.bkg.width
      this.height = this.bkg.height
      this.tilesGroup = this.scene.add.container(0,40)
      var grid = this.scene.add.sprite(0,0, 'grid')
      grid.setOrigin(0,0)

      this.lastTileMark = this.scene.add.circle(200, 200, 4, 0xff7700)
      this.lastTileMark.setOrigin(0,0)
      this.lastTileMark.setVisible(false)

      this.tilesGroup.add(this.bkg)
      this.tilesGroup.add(grid)
      this.grid = [ ]
   }

   setVisible( vis) {
      this.tilesGroup.setVisible(vis)
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
      this.lastC = -1
      this.lastR = -1
      this.lastTileMark.setVisible(false)

      // first find words in rows. 1 word per row
      for (r=0; r<this.rows; r++ ) {
         let rowCoords = []
         for ( c=0;c<this.cols; c++) {
            if ( this.grid[r][c].selected === true ) {
               word +=  this.grid[r][c].letter.text
               rowCoords.push( r+","+c )
            } else if (word.length > 0 ) {
               break
            }
         }
         if (word.length > 1 ) {
            words.push(word)
            coords = coords.concat(rowCoords)
         }
         word = ""
      }

      // Now in columns...
      word = ""
      for ( c=0; c<this.cols; c++ ) {
         let colCoords = []
         for ( r=0;r<this.rows; r++) {
            if ( this.grid[r][c].selected === true ) {
               word +=  this.grid[r][c].letter.text
               var coord = r+","+c
               colCoords.push(coord)
            } else if (word.length > 0 ) {
               break
            }
         }
         if (word.length > 1 ) {
            words.push(word)
            coords = coords.concat(colCoords)
         }
         word = ""
      }

      // If no words, bail
      if (words.length === 0 ) {
         return
      }

      coords = [...new Set(coords)]
      axios.post('/api/latticewords/check', {words: words.join(",")})
      .then( (response) => {
         this.handleResults(response.data, coords, scoreHandler )
      })
      .catch(function () {
         // console.log(error)
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
         this.bkg.setFillStyle(0xffffff)
      } else {
         this.bkg.setFillStyle(0xddffff)
      }
   }

   addTile(letter, row, col, selected, clone) {
      var tileX = 42+this.tileSize*col
      var tileY = 43+this.tileSize*row

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
      }

      this.tilesGroup.add(text)
      return {letter: text, selected: selected}
   }

   getClickedCol(screenX) {
      var gridX = screenX - 0    
      return Math.floor(gridX / this.tileSize)
   }
   getClickedRow(screenY) {
      var gridY = screenY - 40
      return Math.floor(gridY / this.tileSize)
   }

   handlePointerUp(screenX, screenY, isDoubleClick) {
      var gridX = screenX - 0
      var gridY = screenY - 40
      if ( gridX <=-10 || gridY <=-10 || gridX >= this.width-10 || gridY >= this.height-10) {
         return
      }

      var col = Math.floor( gridX / this.tileSize)
      var row = Math.floor( gridY / this.tileSize)
      var tile = this.grid[row][col]
      if (tile.selected === true ) {
         // deselect selected tile
         tile = this.grid[row][col]
         tile.selected = false
         tile.letter.setFill(LETTER_COLOR)
         this.lastC = -1
         this.lastR = -1 
         this.lastTileMark.setVisible(false)

         // Expand out left and right clearing all until a non-selected tile is hit
         let dL = -1
         let dR = 1
         while (dL != 0 || dR != 0) {
            if (dR != 0) {
               if (col + dR >= this.cols) {
                  dR = 0
               } else {
                  tile = this.grid[row][col + dR]
                  if (tile.selected) {
                     tile.selected = false
                     tile.letter.setFill(LETTER_COLOR)
                     dR++
                  } else {
                     dR = 0
                  }
               }
            }
            if (dL != 0) {
               if (col + dL < 0) {
                  dL = 0
               } else {
                  tile = this.grid[row][col + dL]
                  if (tile.selected) {
                     tile.selected = false
                     tile.letter.setFill(LETTER_COLOR)
                     dL--
                  } else {
                     dL = 0
                  }
               }
            }
         }

         let dU = -1
         let dD = 1
         while (dU != 0 || dD != 0) {
            if (dD != 0) {
               if (row + dD >= this.rows) {
                  dD = 0
               } else {
                  tile = this.grid[row + dD][col]
                  if (tile.selected) {
                     tile.selected = false
                     tile.letter.setFill(LETTER_COLOR)
                     dD++
                  } else {
                     dD = 0
                  }
               }
            }
            if (dU != 0) {
               if (row + dU < 0) {
                  dU = 0
               } else {
                  tile = this.grid[row + dU][col]
                  if (tile.selected) {
                     tile.selected = false
                     tile.letter.setFill(LETTER_COLOR)
                     dU--
                  } else {
                     dU = 0
                  }
               }
            }
         }  
      } else {
         if ( isDoubleClick === false) {
            tile.selected = true
            tile.letter.setFill(SELECT_COLOR)
            this.lastC = col
            this.lastR = row
            this.lastTileMark.setVisible(true)
            this.lastTileMark.x = this.tileSize * col + 10
            this.lastTileMark.y = this.tileSize * row + 50
            return
         }
         if (row == this.lastR) {
            // auto select everythign between the last selected tile
            let c0 = Math.min(col, this.lastC)
            let c1 = Math.max(col, this.lastC)
            for (let c = c0; c <= c1; c++) {
               tile = this.grid[row][c]
               tile.selected = true
               tile.letter.setFill(SELECT_COLOR)
            }
         } else if (col == this.lastC) {
            let r0 = Math.min(row, this.lastR)
            let r1 = Math.max(row, this.lastR)
            for (let r = r0; r <= r1; r++) {
               tile = this.grid[r][col]
               tile.selected = true
               tile.letter.setFill(SELECT_COLOR)
            }
         } else {
            tile.selected = true
            tile.letter.setFill(SELECT_COLOR)
         }
         this.lastC = col
         this.lastR = row
         this.lastTileMark.setVisible(true)
         this.lastTileMark.x = this.tileSize * col + 10
         this.lastTileMark.y = this.tileSize * row + 50
      }
   }

   shiftTiles(dir, activeRowCol) {
      let clear = false
      switch (dir) {
         case "R":
            this.shiftRight(activeRowCol )
            if (activeRowCol == this.lastR) {
               clear = true
            }
            break
         case "L":
            this.shiftLeft(activeRowCol)
            if (activeRowCol == this.lastR) {
               clear = true
            }
            break
         case "U":
            this.shiftUp(activeRowCol)
            if (activeRowCol == this.lastC) {
               clear = true
            }
            break
         case "D":
            this.shiftDown(activeRowCol)
            if (activeRowCol == this.lastC) {
               clear = true
            }
            break
      }
      if (clear) {
         this.lastC = -1
         this.lastR = -1
         this.lastTileMark.setVisible(false)
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
