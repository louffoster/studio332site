import { Text, Container, ColorMatrixFilter } from "pixi.js"
// import * as TWEEDLE from "tweedle.js"
import BaseGame from "@/games/common/basegame"
import Tile from "@/games/mosaic/tile"
import Spinner from "@/games/mosaic/spinner"
import StartOverlay from "@/games/mosaic/startoverlay"
import EndOverlay from "@/games/mosaic/endoverlay"
import Button from "@/games/common/button"
import Clock from "@/games/common/clock"

export default class Mosaic extends BaseGame {
   static ROWS = 5
   static COLS = 5

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

   async initialize(replayHandler, backHandler) {   
      await super.initialize()
      this.app.ticker.add(() => TWEEDLE.Group.shared.update())
   
      this.gfx.rect(0,0, this.gameWidth, this.gameHeight).
         fill(0x44444a).stroke({width: 1, color: 0x44444a, alpha: 1})
   
      this.clock = new Clock(270, 390, "Time Remaining\n", 0xffffff)
      this.clock.setCountdownMode( this.gameDurationMS,  
         this.timeExpired.bind(this), this.timerWarning.bind(this))
      this.addChild( this.clock)

      let style = {
         fill: "white",
         fontFamily: "Arial",
         fontSize: 18,
      }
   
      let patternLabel = new Text({text: "Patterns Matched", style: style})
      patternLabel.x = 270
      patternLabel.y = 435
      patternLabel.anchor.set(0.5, 0.5)
      this.addChild(patternLabel)
      
      this.matchDisplay = new Text({text: "0", style:style})
      this.matchDisplay.x = 270
      this.matchDisplay.y = 460
      this.matchDisplay.anchor.set(0.5, 0.5)
      this.addChild(this.matchDisplay)
   
      this.resetButton = new Button(203, 480, "Reset Tiles",  this.initTiles.bind(this) )
      this.resetButton.alignTopLeft()
      this.addChild(this.resetButton)
   
      this.tileContainer = new Container()
      this.tileContainer.x = 5 
      this.tileContainer.y = 5 
      this.addChild(this.tileContainer)
      this.tileFilter = new ColorMatrixFilter()
      this.tileContainer.filters = [this.tileFilter]
      this.initTiles()
   
      this.gfx.rect(185,360, this.gameWidth-190, this.gameHeight-360).fill(0x34565c)
   
      this.targetContainer = new Container() 
      this.targetContainer.x =  6
      this.targetContainer.y = 360
      this.addChild(this.targetContainer)
      this.targetFilter = new ColorMatrixFilter()
      this.targetContainer.filters = [this.targetFilter]
      this.generateTargetPuzzle()
      
      this.startOverlay = new StartOverlay( this.gameDurationMS, this.startHandler.bind(this)) 
      this.addChild( this.startOverlay)
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

      this.removeChild(this.startOverlay)
   }

   initTiles() {
      this.tiles = Array(Mosaic.ROWS).fill().map(() => Array(Mosaic.COLS))
      let x = 0
      let y = 0
      let color = 1
      for (let r = 0; r < Mosaic.ROWS; r++) {
         for (let c = 0; c < Mosaic.COLS; c++) {
            if ( this.advanced ) {
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
            
            x+= Tile.WIDTH
         }
         x = 0
         y += Tile.HEIGHT
      }

      this.spinners = Array(Mosaic.ROWS-1).fill().map(() => Array(Mosaic.COLS-1))
      x = Tile.WIDTH
      y = Tile.HEIGHT
      for (let r = 0; r < Mosaic.ROWS-1; r++) {
         for (let c = 0; c < Mosaic.COLS-1; c++) {
            let s = new Spinner(x,y, r,c, this.spinnerCallback.bind(this))
            this.tileContainer.addChild(s)
            this.spinners[r][c] = s
            x+= Tile.WIDTH
         }
         y+= Tile.HEIGHT
         x = Tile.WIDTH
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
            0,0,0,0,0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1,1,1,1,1,1
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
         x += t.width
         c++
         if (c == (Mosaic.COLS)) {
            c = 0
            x = 0
            r++
            y+= t.height
         }
      }) 
   }

   spinnerCallback( tgtTiles ) {
      let tl = this.tiles[ tgtTiles[0].row ][ tgtTiles[0].col ]
      new TWEEDLE.Tween(tl).to({ x: tl.x+Tile.WIDTH}, 100).start()

      let tr = this.tiles[ tgtTiles[1].row ][ tgtTiles[1].col ]
      new TWEEDLE.Tween(tr).to({ y: tr.y+Tile.HEIGHT}, 100).start()

      let br = this.tiles[ tgtTiles[2].row ][ tgtTiles[2].col ]
      new TWEEDLE.Tween(br).to({ x: br.x-Tile.WIDTH}, 100).start()

      let bl = this.tiles[ tgtTiles[3].row ][ tgtTiles[3].col ]
      new TWEEDLE.Tween(bl).to({ y: bl.y-Tile.HEIGHT}, 100).start()

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
      this.removeChild(this.resetButton)
      this.addChild(this.endOverlay)
      this.gameState = "gameOver"
   }
   
   timerWarning(flash) {
      this.gfx.rect(1,1,356,356) 
      if ( flash ) {
         this.gfx.stroke({width: 5, color: 0xcc2222, alpha: 1})
      } else {
         this.gfx.stroke({width: 5, color: 0x44444a, alpha: 1})
      }
   }

   update() {
      super.update()

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
}