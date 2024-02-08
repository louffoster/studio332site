import * as PIXI from "pixi.js"
import * as TWEEDLE from "tweedle.js"
import * as particles from '@pixi/particle-emitter'
import StartOverlay from "@/games/letterdrop/startoverlay"
import EndOverlay from "@/games/letterdrop/endoverlay"
import BaseGame from "@/games/common/basegame"
import Dictionary from "@/games/common/dictionary"
import LetterPool from "@/games/common/letterpool"
import Clock from "@/games/common/clock"
import Button from "@/games/common/button"
import Tile from "@/games/letterdrop/tile"
import TrashMeter from "@/games/letterdrop/trashmeter"
import DropButton from "@/games/letterdrop/dropbutton"
import Timer from "@/games/letterdrop/timer"

import trashJson from '@/assets/trash.json'

export default class LetterDrop extends BaseGame {
   pool = new LetterPool()
   clock = null
   gridTop = 130 
   gridLeft = 10
   columns = []
   columnButtons = []
   trashBtn = null
   trashMeter = null
   clearBtn = null 
   submitBtn = null
   choices = []
   timer = null
   trashAnim = null
   startOverlay = null 
   gameState = "init"
   word = null
   currWordTile = null
   score = 0
   scoreDisplay = null
   endOverlay = null
   dictionary = null

   static COLUMNS = 5 
   static MAX_HEIGHT = 5
   static TILE_W = 60 
   static TILE_H = 60

   initialize(replayHandler, backHandler) { 
      this.dictionary = new Dictionary()
      this.trashAnim = particles.upgradeConfig(trashJson, ['smoke.png'])

      // draw backgrounnd an column buttons
      this.drawBoard()
      let boardBottom = this.gridTop+LetterDrop.TILE_H*LetterDrop.MAX_HEIGHT

      // drop timer
      this.timer = new Timer(
         this.gridLeft+LetterDrop.TILE_W*LetterDrop.COLUMNS+LetterDrop.TILE_W/4+7, 
         15, 
         LetterDrop.TILE_W/3,
         LetterDrop.TILE_H-10)
      this.timer.setTimeoutHandler( this.timerExpired.bind(this))
      this.addChild( this.timer )

      // trash meter
      let meterTop = this.gridTop+LetterDrop.TILE_H/4
      this.trashMeter = new TrashMeter(
         this.gridLeft+LetterDrop.TILE_W*LetterDrop.COLUMNS+LetterDrop.TILE_W/4, 
         meterTop,
         LetterDrop.TILE_W/2, 
         LetterDrop.TILE_H*(LetterDrop.MAX_HEIGHT-1)+LetterDrop.TILE_H/2)
      this.addChild(this.trashMeter)

      // datastructure for tiles on board
      for (let c = 0; c < LetterDrop.COLUMNS; c++) {
         this.choices.push(null)
      }

      // entered word
      let wordStyle = new PIXI.TextStyle({
         fill: "#FCFAFA",
         fontFamily: "Arial",
         fontSize: 20,
         lineHeight: 20
      })
      this.word = new PIXI.Text("", wordStyle)
      this.word.x = 15 
      this.word.y = boardBottom+18
      this.addChild(this.word)

      // control buttons
      this.submitBtn = new Button( 308, boardBottom+18, "Submit", () => {
         this.submitWord()
      }, 0xFCFAFA,0x2f6690,0x5482bc)
      this.submitBtn.small()
      this.submitBtn.alignTopLeft()
      this.submitBtn.noShadow()
      this.submitBtn.setEnabled( false )
      this.addChild(this.submitBtn )

      this.clearBtn = new Button( 230, boardBottom+18, "Clear", () => {
         this.clearWord()
      }, 0xFCFAFA,0x9c5060,0x5482bc)
      this.clearBtn.small()
      this.clearBtn.alignTopLeft()
      this.clearBtn.noShadow()
      this.clearBtn.setEnabled( false )
      this.addChild(this.clearBtn )

      this.clock = new Clock(345, this.gameHeight-15, "", 0xFCFAFA)
      this.addChild(this.clock)

      this.scoreDisplay = new PIXI.Text("00000", {
         fill:0xFCFAFA,
         fontFamily: "Arial",
         fontSize: 20,
         lineHeight: 20,
      })
      this.scoreDisplay.anchor.set(0,1)
      this.scoreDisplay.x = 10 
      this.scoreDisplay.y = this.gameHeight-10
      this.scene.addChild( this.scoreDisplay)

      this.startOverlay = new StartOverlay(this.startHandler.bind(this)) 
      this.endOverlay = new EndOverlay( replayHandler, backHandler) 
      this.scene.addChild( this.startOverlay )
      
      // start the eicker last so everything is created / initialized
      this.app.ticker.add(() => TWEEDLE.Group.shared.update())
   }

   startHandler() {
      this.scene.removeChild( this.startOverlay)
      this.gameState = "playing"
      this.fillChoices()
   }

   fillChoices() {
      if ( this.gameState == "over") return

      let x = 10
      let y = 10
      for (let c = 0; c < LetterDrop.COLUMNS; c++) {
         if ( this.choices[c] == null ) {
            if (this.pool.hasTilesLeft() == false ) {
               this.pool.refill()
            }
            let scoredLetter = this.pool.popScoringLetter()
            let tile = new Tile( scoredLetter, x,y-80 )
            tile.setClickHandler( this.newTileClicked.bind(this) )
            this.addChild(tile)
            this.choices[c] = tile
            new TWEEDLE.Tween(tile).to({ y: y}, 250).start().easing(TWEEDLE.Easing.Linear.None)
         }
         x+= LetterDrop.TILE_W
      }
   }

   newTileClicked( tile ) {
      if ( tile.selected ) {
         this.choices.forEach( t => {
            if ( t != null ) {
               if ( t != tile ) {
                  t.deselect()
               }
            }
         })
         this.toggleTileButtons(true)
      } else {
         this.toggleTileButtons(false)
      }
   }

   drawBoard() {
      // draw column drop buttons
      let y = this.gridTop - 45
      let x = this.gridLeft
      for ( let b=0; b < LetterDrop.COLUMNS; b++) {
         let btn = new DropButton(x, y, () => {
            this.columnPicked(b) 
         })
         btn.setEnabled(false)
         this.addChild(btn)
         this.columnButtons.push(btn)
         this.columns.push( [] )
         x+=LetterDrop.TILE_W
      }

      // trash drop button
      this.trashBtn = new DropButton(x, y, this.trashSelectedTiles.bind(this) )
      this.trashBtn.useTrashIcon() 
      this.trashBtn.setEnabled( false )
      this.addChild( this.trashBtn )

      // main squares of the game grid
      y = this.gridTop
      x = this.gridLeft
      this.gfx.clear()
      this.gfx.beginFill(0xA4B8C4)
      this.gfx.lineStyle(1, 0x2E4347, 1)

      for ( let r = 0; r < LetterDrop.MAX_HEIGHT; r++) {
         for (let c = 0; c < LetterDrop.COLUMNS; c++) {
            this.gfx.drawRect(x,y, LetterDrop.TILE_W, LetterDrop.TILE_H)
            x+= LetterDrop.TILE_W
         }
         y+= LetterDrop.TILE_H 
         x = 10
      }
      this.gfx.endFill()

      // backhgrounnd for trash meter
      this.gfx.beginFill(0x90a3a3)
      this.gfx.drawRect(this.gridLeft+LetterDrop.TILE_W*LetterDrop.COLUMNS,
         this.gridTop, LetterDrop.TILE_W, LetterDrop.TILE_H*LetterDrop.MAX_HEIGHT)
      this.gfx.endFill()
   }

   trashSelectedTiles() {
      let choiceNum = this.choices.findIndex( t => t.selected)
      if ( choiceNum > -1) {
         let tgtTile = this.choices[choiceNum]
         this.choices[choiceNum] = null
         this.trashTile( tgtTile, () => {
            this.fillChoices()  
         })
         this.toggleTileButtons( false )
      }

      let gridTileTrashed = false
      this.columns.forEach( c => {
         c.forEach( t => {
            if ( t.selected ) {
               gridTileTrashed = true
               this.trashTile( t, () => {
                  let tgtIdx = c.findIndex( testT => testT == t)
                  if (tgtIdx > -1) {
                     t.destroy()
                     c.splice(tgtIdx,1)
                  }
               })
            }
         })
      })

      if ( gridTileTrashed ) {
         this.clearWord()
         this.dropGridTiles()
         this.trashBtn.setEnabled( false )
         this.setTilesEnabled(true, true)
      }
   }

   trashTile( tgtTile, trashedCallback ) {
      var emitter = new particles.Emitter(this.scene, this.trashAnim )
      emitter.updateOwnerPos(0,0)
      emitter.updateSpawnPos(tgtTile.x+LetterDrop.TILE_W/2, tgtTile.y+LetterDrop.TILE_H/2)
      emitter.playOnceAndDestroy() 
      this.trashMeter.increaseValue()
      setTimeout( () => {
         this.removeChild( tgtTile )
         tgtTile.destroy()
         trashedCallback()
      }, 450)
   }

   toggleTileButtons( enabled ) {
      this.columnButtons.forEach( (b,idx) => {
         if ( this.columns[idx].length == LetterDrop.MAX_HEIGHT) {
            b.setEnabled( false )   
         } else {
            b.setEnabled( enabled ) 
         }
      })  
      if ( this.trashMeter.isFull() ) {
         this.trashBtn.setEnabled( false )
      } else {
         this.updateTrashButtonState()
      }
   }

   columnPicked( colNum ) {
      // get the tile from the choices list, remove it and set it 
      // at the top of the selected column
      let choiceNum = this.choices.findIndex( t => t.selected)
      let tgtTile = this.choices[choiceNum]
      this.choices[choiceNum] = null
      tgtTile.deselect()
      this.dropNow(tgtTile, colNum)
      this.timer.reset()
   } 

   dropNow( tgtTile, colNum ) {
      if ( this.columns[colNum].length == LetterDrop.MAX_HEIGHT) {
         this.gameState = "over"
         this.setTilesEnabled( false, true )
         this.columns[colNum].forEach( t => t.setError(true) )
   
         var emitter = new particles.Emitter(this.scene, this.trashAnim )
         emitter.updateOwnerPos(0,0)
         emitter.updateSpawnPos(tgtTile.x+LetterDrop.TILE_W/2, tgtTile.y+LetterDrop.TILE_H/2)
         emitter.playOnceAndDestroy( () => { 
            this.removeChild( tgtTile )
            tgtTile.destroy
            this.gameOver()
         })
         return
      }


      // check the top tile in the tgt column and drop the target to 
      // just above that position
      let colX = this.gridLeft + colNum*LetterDrop.TILE_W
      let tgtY = this.gridTop+((LetterDrop.MAX_HEIGHT-1)*LetterDrop.TILE_H)
      let tgtCol = this.columns[ colNum ]
      tgtY -= ( LetterDrop.TILE_H * tgtCol.length)
      tgtCol.push(tgtTile)
      tgtTile.setToggle( false )
      this.fillChoices()
      new TWEEDLE.Tween(tgtTile).to({ x: colX, y: tgtY}, 300).start().easing(TWEEDLE.Easing.Linear.None)
      this.toggleTileButtons( false )
      tgtTile.setClickHandler( this.gridTileClicked.bind(this) )
      if ( this.word.text != "") {
         tgtTile.setEnabled( false )
         this.getAdjacentTiles( tgtTile ).forEach( t => {
            if ( t == this.currWordTile) {
               tgtTile.setEnabled( true )
            }
         })
      }
      this.updateTrashButtonState()
   }

   gameOver() {
      this.gameState = "over"
      this.setTilesEnabled(false, true)
      this.choices.forEach( t => {
         if ( t != null ) {
            this.removeChild(t)
            t.destroy()
         }
      })
      this.endOverlay.setStats(this.score, this.clock.gameTimeFormatted() )

      setTimeout( () => this.scene.addChild( this.endOverlay ), 1500)
   }

   updateTrashButtonState() {
      let selectCnt = 0 
      this.choices.forEach( c => {
         if (c.selected) {
            selectCnt++
         }
      })
      this.columns.forEach( c => {
         c.forEach( t => {
            if ( t.selected) {
               selectCnt++
            }
         })
      })
      let enabled = false
      if ( selectCnt > 0) {
         if ( this.trashMeter.canTrash(selectCnt) ) {
            enabled = true
         }
      }
      this.trashBtn.setEnabled( enabled )
   }

   gridTileClicked( tile ) {
      this.setTilesEnabled( false )
      tile.setEnabled(true)
      this.word.text += tile.text()
      if ( this.currWordTile != null) {
         this.currWordTile.setActive(false)   
      }
      this.currWordTile = tile
      this.currWordTile.setActive(true)

      this.getAdjacentTiles(tile).forEach( t => t.setEnabled(true) )
      this.updateTrashButtonState()

      this.clearBtn.setEnabled(true)
      if ( this.word.text.length > 3) {
         this.submitBtn.setEnabled(true)
      }
      if ( this.word.text.length == 10) {
         this.columns.forEach( c => {
            c.forEach( t => {
               if ( !t.selected ) {
                  t.setEnabled( false )
               }
            })
         })

      }
   }

   getAdjacentTiles( tile ) {
      let selectedCol = -1
      let selectedRow = -1
      this.columns.forEach( (c,colIdx) => {
         let rowIdx = c.findIndex( t => t == tile)
         if (rowIdx > -1 ) {
            selectedCol = colIdx 
            selectedRow = rowIdx
         }
      })  
      let adjacent = []
      if ( selectedRow > 0) {
         adjacent.push(this.columns[selectedCol][selectedRow-1])
      }
      if ( selectedRow < (this.columns[selectedCol].length - 1) ) {
         adjacent.push(this.columns[selectedCol][selectedRow+1])
      }
      if ( selectedCol > 0 && this.columns[selectedCol-1][selectedRow] != null) {
         adjacent.push(this.columns[selectedCol-1][selectedRow])   
      }
      if ( selectedCol < LetterDrop.COLUMNS-1 && this.columns[selectedCol+1][selectedRow] != null) {
         adjacent.push(this.columns[selectedCol+1][selectedRow])   
      }
      return adjacent
   }

   clearWord() {
      this.setTilesEnabled(true, true)
      this.word.text = ""
      this.currWordTile.setActive(false)
      this.currWordTile = null
      this.submitBtn.setEnabled(false)
      this.clearBtn.setEnabled(false)
   }

   submitWord() {
      this.timer.reset()
      if ( this.dictionary.isValid(this.word.text)) {
         this.submitSuccess()
      } else {
         this.submitFailed()
      }
   }

   submitSuccess() {
      let tileCnt = this.word.text.length
      let totalTileValue = 0
      this.columns.forEach( (c) => {
         c.forEach( (t) => {
            if ( t.selected ) {
               totalTileValue += t.score 

               var emitter = new particles.Emitter(this.scene, this.trashAnim )
               emitter.updateOwnerPos(0,0)
               emitter.updateSpawnPos(t.x+LetterDrop.TILE_W/2, t.y+LetterDrop.TILE_H/2)
               emitter.playOnceAndDestroy()

               // add a slight delay so explosion covers the tile when it is removed from the board
               setTimeout( () => {
                  this.removeChild(t)

                  //  lookup the index of the destroyed tile as a previous clear may have shifted the array position
                  let tgtIdx = c.findIndex( testT => testT == t)
                  if (tgtIdx > -1) {
                     t.destroy()
                     c.splice(tgtIdx,1)
                  }
                  tileCnt-- 

                  // only when all word tiles are gone, shift other tiles to fill in the gaps
                  if (tileCnt == 0 ){
                     this.dropGridTiles()      
                  }
               }, 300)
            }
         })
      })
      
      this.score += (totalTileValue * tileCnt) 
      this.scoreDisplay.text = `${this.score}`.padStart(5,"0")

      this.clearWord()
   }

   dropGridTiles() {
      setTimeout( () => {
         this.columns.forEach( (shifC) => {
            shifC.forEach( (shiftT,shiftRowIdx) => {
               // the first position in a column is at the BOTTOM of the board. need 
               // to reverse column array postion in to board position 
               let tilePos = (LetterDrop.MAX_HEIGHT - shiftRowIdx)-1
               let tgtY = this.gridTop + tilePos * LetterDrop.TILE_H
               if ( shiftT.y != tgtY) {
                  new TWEEDLE.Tween(shiftT).to({ y: tgtY}, 250).start().easing(TWEEDLE.Easing.Linear.None)
               }
            })
         })
      }, 500)
   }

   timerExpired() {
      this.choices.forEach(  (t,colIdx) => {
         t.deselect()
         this.choices[colIdx] = null
         this.dropNow( t, colIdx )
      })
      this.fillChoices()   
      this.timer.reset()
   }

   submitFailed() {
      this.setErrorTiles(true)
      setTimeout( () => {
         this.clearWord()
         this.setErrorTiles(false)
         this.choices.forEach(  (t,colIdx) => {
            this.choices[colIdx] = null
            this.dropNow( t, colIdx )
         })
         this.fillChoices()
      }, 500)  
   }

   setErrorTiles( flag ) {
      this.columns.forEach( col => {
         col.forEach( t => {
            if ( flag ) {
               if ( t.selected ) {
                  t.setError(true)
               }
            } else {
               if ( t.error ) {
                  t.setError(false)
               }
            }
         })
      }) 
   }

   setTilesEnabled( enabled, deselectAll = false ) {
      this.columns.forEach( col => {
         col.forEach( t => {
            t.setEnabled( enabled )
            if ( deselectAll) {
               t.deselect()
            }
         })
      })   
   }

   update()  {
      if ( this.gameState != "playing") return
      this.clock.tick(this.app.ticker.deltaMS)
      this.timer.tick(this.app.ticker.deltaMS)
   }
}