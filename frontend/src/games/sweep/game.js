import * as PIXI from "pixi.js"
import * as particles from '@pixi/particle-emitter'
import axios from 'axios'

import stars from '@/assets/stars.json'
import bad from '@/assets/bad_word.json'
import confettiJson from '@/assets/confetti.json'

import BaseGame from "@/games/common/basegame"
import LetterPool from "@/games/common/letterpool"
import Letter from "@/games/common/letter"
import Tile from "@/games/sweep/tile"
import StartOverlay from "@/games/sweep/startoverlay"
import PickOverlay from "@/games/sweep/pickoverlay"
import EndOverlay from "@/games/sweep/endoverlay"
import Clock from "@/games/common/clock"
import Button from "@/games/common/button"

const API_SERVICE = import.meta.env.VITE_S332_SERVICE

export default class Sweep extends BaseGame {
   pool = new LetterPool()
   gameState = "init"
   grid = null
   clock = null
   word = null
   helpers = []
   giveUpButton = null
   clearButton = null 
   submitButton = null
   startOverlay = null
   pickOverlay = null
   endOverlay = null
   explode = null
   badWord = null
   confetti = null
   wordsCreated = [0,0,0,0,0,0,0,0,0,0,0]
   score = 0 
   scoreDisplay = null
   
   initialize(replayHandler, backHandler) {
      this.explode = particles.upgradeConfig(stars, ['snow.png'])
      this.badWord = particles.upgradeConfig(bad, ['spark.png'])
      this.confetti = particles.upgradeConfig(confettiJson, ['pink.png','green.png','yellow.png'])

      this.pool.refill()
      this.grid = Array(Sweep.ROWS).fill().map(() => Array(Sweep.COLS))
      let x = 5 
      let y = 5
      for (let r = 0; r < Sweep.ROWS; r++) {
         for (let c = 0; c < Sweep.COLS; c++) {
            let scoredLetter = this.pool.popScoringLetter()
            let t = new Tile( scoredLetter, x,y, this.tileClicked.bind(this))
            this.addChild(t)
            this.grid[r][c] = t
            x += Tile.WIDTH
         }
         y += Tile.HEIGHT
         x = 5
      } 
   
      let wordStyle = new PIXI.TextStyle({
         fill: "#CAF0F8",
         fontFamily: "Arial",
         fontSize: 28,
         lineHeight: 28,
      })
      this.word = new PIXI.Text("", wordStyle)
      this.word.anchor.set(0.5, 1)
      this.word.x = 185 
      this.word.y = 410
      this.addChild(this.word)
   
      this.giveUpButton = new Button( 20, 425, "Give Up", 
         this.giveUpClicked.bind(this), 0xEAE0E8,0x892b64,0xa94b84)
      this.giveUpButton.alignTopLeft()
      this.addChild(this.giveUpButton)
   
      this.clearButton = new Button( 145, 425, "Clear", 
         this.clearSelections.bind(this), 0xEAE0E8,0xc5472b,0xe5674b)
      this.clearButton.alignTopLeft()
      this.addChild(this.clearButton)
      this.clearButton.disable()
      
      this.submitButton = new Button( 247, 425, "Submit", 
         this.submitWord.bind(this), 0xCAF0F8,0x298058,0x48CAE4)
      this.submitButton.disable()
      this.submitButton.alignTopLeft()
      this.addChild(this.submitButton)
   
      this.gfx.beginFill(0x48CAE4)
      this.gfx.lineStyle(1, 0xCAF0F8)
      this.gfx.drawRect(4, 488, Tile.WIDTH*3+8, Tile.HEIGHT+8)
      this.gfx.endFill()
   
      let helpX = 8
      for ( let i=0; i<3; i++ ) {
         let h = new Tile(new Letter("?", 0), helpX,492, this.tileClicked.bind(this))
         this.helpers.push( h )
         helpX += Tile.WIDTH
         this.addChild(h)
      }
   
      this.clock = new Clock(280, 505, "", 0xCAF0F8)
      this.addChild(this.clock)
      this.scoreDisplay = new PIXI.Text("00000", {
         fill: "#CAF0F8",
         fontFamily: "Arial",
         fontSize: 24,
         fontWeight: "bold",
         lineHeight: 24
      })
      this.scoreDisplay.anchor.set(0.5, 1)
      this.scoreDisplay.x = 280 
      this.scoreDisplay.y = 545
      this.addChild(this.scoreDisplay)


      this.enableGrid( false )

      this.startOverlay = new StartOverlay(API_SERVICE, this.startHandler.bind(this)) 
      this.addChild(this.startOverlay)
      this.pickOverlay = new PickOverlay( this.helperHandler.bind(this) )
      this.endOverlay = new EndOverlay(replayHandler, backHandler)
   }

   helperHandler( pickedLetters ) {
      pickedLetters.forEach( (l,idx) => {
         this.helpers[idx].set( l )
      })
      this.gameState = "play"
      this.scene.removeChild(this.pickOverlay)
      this.enableGrid( true )
   }

   startHandler() {
      this.gameState = "pick"
      this.scene.removeChild( this.startOverlay )
      this.addChild( this.pickOverlay )
   }

   clearSelections() {
      this.word.text = ""
      for (let r = 0; r < Sweep.ROWS; r++) {
         for (let c = 0; c < Sweep.COLS; c++) {
            this.grid[r][c].deselect()
         }
      }
      this.helpers.forEach( t => t.deselect())
      this.enableGrid( true )
      this.submitButton.disable()
      this.clearButton.disable()
   }
   
   giveUpClicked() {
      this.gameState = "over"
      this.endOverlay.setLoss( this.score, this.countRemainingLetters(), this.wordsCreated )
      this.addChild( this.endOverlay )
      this.enableGrid(false) 
      this.submitButton.disable()
      this.clearButton.disable()
      this.giveUpButton.disable()
   }
   
   submitWord() {
      let url = `${API_SERVICE}/sweep/check?w=${this.word.text}`
      axios.post(url).then( () => {
         this.wordsCreated[ this.word.text.length]++
         this.scoreTiles()
         this.checkForWin()
         this.word.text = ""
         this.submitButton.disable()
         this.clearButton.disable()
         this.enableGrid(true)
      }).catch( _e => {
         this.submitFailed()
      })
   }
   
   countRemainingLetters() {
      let cnt = 0
      for (let r = 0; r < Sweep.ROWS; r++) {
         for (let c = 0; c < Sweep.COLS; c++) {
            if (this.grid[r][c].cleared == false ) {
               cnt++
            }
         }
      }
      return cnt
   }
   
   checkForWin() {
      let cnt = this.countRemainingLetters()
      if ( cnt == 0) {
         this.gameState = "over"
         var emitter = new particles.Emitter(this.scene, this.confetti )
         emitter.updateOwnerPos(0,0)
         emitter.updateSpawnPos(this.gameWidth/2,300)
         emitter.playOnceAndDestroy(() => {
            this.endOverlay.setWin( this.score, this.clock.gameTimeFormatted(), this.wordsCreated )
            this.addChild( this.endOverlay )
         })
      } 
   }
   
   submitFailed() {
      let origColor = this.word.style.fill
      this.word.style.fill = 0xFF4500
      setTimeout( () => {
         let centerX = this.gameWidth / 2.0
         let wordW = this.word.width 
         let coords = [centerX-wordW/2.0, centerX, centerX+wordW/2.0]
         for (let i = 0; i<3; i++) {
            var emitter = new particles.Emitter(this.scene, this.badWord )
            emitter.updateOwnerPos(0,0)
            emitter.updateSpawnPos(coords[i], this.word.y - 10)
            emitter.playOnceAndDestroy()   
         }
         setTimeout( () => {
            this.clearSelections()
            this.word.style.fill = origColor
         }, 100)
      }, 500)
   }
   
   scoreTiles() {
      let wordValue = 0
      let wordLen = this.word.text.length
      for (let r = 0; r < Sweep.ROWS; r++) {
         for (let c = 0; c < Sweep.COLS; c++) {
            if ( this.grid[r][c].selected) {
               var tile = this.grid[r][c]
               wordValue += tile.score
               var emitter = new particles.Emitter(this.scene, this.explode )
               emitter.updateOwnerPos(0,0)
               emitter.updateSpawnPos(tile.x+Tile.WIDTH/2.0, tile.y+Tile.HEIGHT/2.0)
               emitter.playOnceAndDestroy()
               tile.clear()
            }
         }
      }
      this.helpers.forEach( tile => {
         if (tile.selected ) {
            wordValue += tile.score
            var emitter = new particles.Emitter( this.scene, this.explode )
            emitter.updateOwnerPos(0,0)
            emitter.updateSpawnPos(tile.x+Tile.WIDTH/2.0, tile.y+Tile.HEIGHT/2.0)
            emitter.playOnceAndDestroy()
            tile.clear()
         }
      })

      this.score += wordValue*wordLen
      this.scoreDisplay.text = `${this.score}`.padStart(5,"0")
   }
   
   enableGrid(enabled) {
      for (let r = 0; r < Sweep.ROWS; r++) {
         for (let c = 0; c < Sweep.COLS; c++) {
            if ( enabled ) {
               this.grid[r][c].enable() 
            } else {("d")
               this.grid[r][c].disable()   
            }
         }
      }
   }
   
   tileClicked( tile ) {
      if (this.word.text.length < 10) {
         this.word.text += tile.text
      }
      if (this.word.text.length == 10) {
         this.enableGrid(false)
      }
      if (this.word.text.length > 3 ) {
         this.submitButton.enable()
      }
      this.clearButton.enable()
   }
   
   update() {
      if ( this.gameState != "play" ) return
      this.clock.tick(this.app.ticker.deltaMS)
   }

   static ROWS = 6
   static COLS = 6
}