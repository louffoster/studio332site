import * as PIXI from "pixi.js"
import * as TWEEDLE from "tweedle.js"
import BaseGame from "@/games/common/basegame"
import Tile from "@/games/mosaic/tile"
import Spinner from "@/games/mosaic/spinner"
import StartOverlay from "@/games/mosaic/startoverlay"
import EndOverlay from "@/games/mosaic/endoverlay"
import Button from "@/games/common/button"
import Clock from "@/games/common/clock"

export default class Mosaic extends BaseGame {
   tileContainer = null
   tileFilter = null
   tiles = null
   targetContainer = null
   targetFilter = null
   targetTiles = null
   spinners = null
   clock = null
   gameDurationMS = 300.0 * 1000.0
   matchCount = 0
   matchDisplay = null
   gameState = "start"
   startOverlay = null
   endOverlay = null
   resetButton = null
   matching = false 
   matchingTimer = 0.0
   hue = 0.0
   hueDir = 1
   advanced = false

   initialize(replayHandler, backHandler) {   
      this.app.ticker.add(() => TWEEDLE.Group.shared.update())
      this.app.ticker.add( this.gameTick.bind(this) )

      let style = {
         fill: "0x80D3E1",
         fontFamily: "Arial",
         fontSize: 18,
      }
   
      this.gfx.beginFill(0x44444a)
      this.gfx.lineStyle(1, 0x44444a, 1)
      this.gfx.drawRect(0,0, this.gameWidth, this.gameHeight)
      this.gfx.endFill()
   
      this.clock = new Clock(270, 390, "Time Remaining\n")
      this.clock.setCountdownMode( this.gameDurationMS,  
         this.timeExpired.bind(this), this.timerWarning.bind(this))
      this.scene.addChild( this.clock)
   
      let patternLabel = new PIXI.Text("Patterns Matched", style)
      patternLabel.x = 270
      patternLabel.y = 435
      patternLabel.anchor.set(0.5, 0.5)
      this.scene.addChild(patternLabel)
      
      this.matchDisplay = new PIXI.Text("0", style)
      this.matchDisplay.x = 270
      this.matchDisplay.y = 460
      this.matchDisplay.anchor.set(0.5, 0.5)
      this.scene.addChild(this.matchDisplay)
   
      this.resetButton = new Button(203, 480, "Reset Tiles",  this.initTiles.bind(this) )
      this.resetButton.alignTopLeft()
      this.scene.addChild(this.resetButton)
   
      this.tileContainer = new PIXI.Container()
      this.tileContainer.x = 5 
      this.tileContainer.y = 5 
      this.scene.addChild(this.tileContainer)
      this.tileFilter = new PIXI.ColorMatrixFilter()
      this.tileContainer.filters = [this.tileFilter]
      this.initTiles()
   
      this.gfx.beginFill(0x34565c)
      this.gfx.drawRect(185,360, this.gameWidth-190, this.gameHeight-360)
      this.gfx.endFill()
   
      this.targetContainer = new PIXI.Container() 
      this.targetContainer.x =  6
      this.targetContainer.y = 360
      this.scene.addChild(this.targetContainer)
      this.targetFilter = new PIXI.ColorMatrixFilter()
      this.targetContainer.filters = [this.targetFilter]
      this.generateTargetPuzzle()
      
      this.startOverlay = new StartOverlay( this.gameDurationMS, this.startHandler.bind(this)) 
      this.scene.addChild( this.startOverlay)
      this.endOverlay = new EndOverlay(replayHandler, backHandler) 
   }

   startHandler(startMode) {
      this.gameState = "play"
      this.advanced = false
      if (startMode == "advanced" ) {
         this.advanced = true
      }
      
      this.initTiles()
      this.generateTargetPuzzle()

      this.scene.removeChild(this.startOverlay)
   }

   initTiles() {
      this.tiles = Array(Mosaic.ROWS).fill().map(() => Array(Mosaic.COLS))
      let x = 0
      let y = 0
      let color = 1
      for (let r = 0; r < Mosaic.ROWS; r++) {
         for (let c = 0; c < Mosaic.COLS; c++) {
            if ( this.advanced == 1) {
               if ( r == 2 && c == 2) {
                  color = 2
               } else {
                  if ( r == 1 || r == 3) {
                     color = 1
                     if ( c == 1 || c == 3 ) {
                        color = 2
                     }
                  } else {
                     if (color == 0 || color == 2) {
                        color = 1
                     } else {
                        color = 0
                     }
                  }
               }
               let t = new Tile(color, x,y, r,c)
               this.tileContainer.addChild(t)
               this.tiles[r][c] = t
            } else {
               let t = new Tile(color, x,y, r,c)
               this.tileContainer.addChild(t)
               this.tiles[r][c] = t
               if (color == 0) {
                  color = 1
               } else {
                  color = 0
               }
            }
            
            x+= Tile.width
         }
         x = 0
         y += Tile.height
      }

      this.spinners = Array(Mosaic.ROWS-1).fill().map(() => Array(Mosaic.COLS-1))
      x = Tile.width
      y = Tile.height
      for (let r = 0; r < Mosaic.ROWS-1; r++) {
         for (let c = 0; c < Mosaic.COLS-1; c++) {
            let s = new Spinner(x,y, r,c, this.spinnerCallback.bind(this))
            this.tileContainer.addChild(s)
            this.spinners[r][c] = s
            x+= Tile.width
         }
         y+= Tile.height
         x = Tile.width
      }
   }

   generateTargetPuzzle() {
      let colors = null 
      if ( this.advanced == 1 ) {
         colors = [
            0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1,1,1,1,1,
            2,2,2,2,2
         ]
      } else { 
         colors = [
            0,0,0,0,0,0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1,1,1,1,1
         ]   
      }
      colors = this.shuffleArray(colors)
      let x = 0
      let y = 0
      let r = 0
      let c = 0
      this.targetTiles = Array(Mosaic.ROWS).fill().map(() => Array(Mosaic.COLS))
      colors.forEach( colorIndex => {
         let t = new Tile(colorIndex,x,y,r,x,true) // true makes the tile small 
         this.targetContainer.addChild(t)
         this.targetTiles[r][c] = t
         x += t.tileW 
         c++
         if (c == (Mosaic.COLS)) {
            c = 0
            x = 0
            r++
            y+= t.tileH
         }
      }) 
   }

   spinnerCallback( tgtTiles ) {
      let tl = this.tiles[ tgtTiles[0].row ][ tgtTiles[0].col ]
      new TWEEDLE.Tween(tl).to({ x: tl.x+Tile.width}, 100).start()

      let tr = this.tiles[ tgtTiles[1].row ][ tgtTiles[1].col ]
      new TWEEDLE.Tween(tr).to({ y: tr.y+Tile.height}, 100).start()

      let br = this.tiles[ tgtTiles[2].row ][ tgtTiles[2].col ]
      new TWEEDLE.Tween(br).to({ x: br.x-Tile.width}, 100).start()

      let bl = this.tiles[ tgtTiles[3].row ][ tgtTiles[3].col ]
      new TWEEDLE.Tween(bl).to({ y: bl.y-Tile.height}, 100).start()

      setTimeout( () => {
         this.tiles[ tgtTiles[0].row ][ tgtTiles[0].col ] = bl
         this.tiles[ tgtTiles[1].row ][ tgtTiles[1].col ] = tl
         this.tiles[ tgtTiles[2].row ][ tgtTiles[2].col ] = tr
         this.tiles[ tgtTiles[3].row ][ tgtTiles[3].col ] = br
         this.checkMatch()
      }, 110)
   }

   checkMatch() {
      let match = true
      for (let r = 0; r < Mosaic.ROWS; r++) {
         for (let c = 0; c < Mosaic.COLS; c++) {
            if ( this.targetTiles[r][c].colorIndex != this.tiles[r][c].colorIndex ) {
               match = false 
               break
            }
         }
         if ( match == false ) {
            break
         }
      }

      if ( match == true ) {
         this.matchCount++
         this.matchDisplay.text = `${this.matchCount}`
         this.matching = true 
         this.matchingTimer = 1000.0
         this.tileFilter.polaroid(true)
      } 
   }

   timeExpired() {
      for (let r = 0; r < Mosaic.ROWS-1; r++) {
         for (let c = 0; c < Mosaic.COLS-1; c++) {
            this.tileContainer.removeChild( this.spinners[r][c] )
         }
      }
      this.scene.removeChild(this.resetButton)
      this.scene.addChild(this.endOverlay)
      this.gameState = "gameOver"
   }
   
   timerWarning(flash) {
      if ( flash ) {
         this.gfx.lineStyle(5, 0xcc2222, 1)
      } else {
         this.gfx.lineStyle(5, 0x44444a, 1)
      }
      this.gfx.drawRect(1,1,356,356) 
   }

   gameTick() {
      if ( this.gameState != "play") return
   
      this.clock.tick( this.app.ticker.deltaMS )
   
      if ( this.matching ) {
         this.matchingTimer -= this.app.ticker.deltaMS
         this.hue += 5*this.hueDir
         if ( this.hue > 60 ) {
            this.hueDir = -1
         } else if ( this.hue < 0) {
            this.hueDir = 1
         }
         this.targetFilter.hue( this.hue,false )
         if ( this.matchingTimer <= 0 ) {
            this.matching = false
            this.targetFilter.reset()
            this.tileFilter.reset()
            this.generateTargetPuzzle()
         }
      }
   }

   static ROWS = 5
   static COLS = 5
}