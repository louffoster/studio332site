import {Text, TextStyle, Assets, Sprite } from "pixi.js"
import * as TWEEDLE from "tweedle.js"
import Dictionary from "@/games/common/dictionary"
import BaseGame from "@/games/common/basegame"
import LetterPool from "@/games/common/letterpool"
import Letter from "@/games/common/letter"
import Tile from "@/games/sweep/tile"
import Boom from "@/games/sweep/boom"
import Confetti from "@/games/sweep/confetti"
import StartOverlay from "@/games/sweep/startoverlay"
import PickOverlay from "@/games/sweep/pickoverlay"
import EndOverlay from "@/games/sweep/endoverlay"
import Clock from "@/games/common/clock"
import Button from "@/games/common/button"

export default class Sweep extends BaseGame {
   dictionary = new Dictionary()
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
   wordsCreated = [0,0,0,0,0,0,0,0,0,0,0]
   score = 0 
   scoreDisplay = null
   spark = null
   square = null

   static ROWS = 6
   static COLS = 6
   
   async initialize(replayHandler, backHandler) {
      await super.initialize()
      // this.spark = await Assets.load('/spark.png')
      // this.square = await Assets.load('/square.png')

      // this.app.ticker.add(() => TWEEDLE.Group.shared.update())
      
      // this.pool.refill()
      // this.grid = Array(Sweep.ROWS).fill().map(() => Array(Sweep.COLS))
      // let x = 5 
      // let y = 5
      // for (let r = 0; r < Sweep.ROWS; r++) {
      //    for (let c = 0; c < Sweep.COLS; c++) {
      //       let scoredLetter = this.pool.popScoringLetter()
      //       let t = new Tile( scoredLetter, x,y, this.tileClicked.bind(this))
      //       this.addChild(t)
      //       this.grid[r][c] = t
      //       x += Tile.WIDTH
      //    }
      //    y += Tile.HEIGHT
      //    x = 5
      // } 
   
      // let wordStyle = new TextStyle({
      //    fill: "#CAF0F8",
      //    fontFamily: "Arial",
      //    fontSize: 28,
      //    lineHeight: 28,
      // })
      // this.word = new Text({text: "", style: wordStyle})
      // this.word.anchor.set(0.5, 1)
      // this.word.x = 185 
      // this.word.y = 410
      // this.addChild(this.word)
   
      // this.giveUpButton = new Button( 20, 425, "Give Up", 
      //    this.giveUpClicked.bind(this), 0xEAE0E8,0x892b64,0xa94b84)
      // this.giveUpButton.alignTopLeft()
      // this.addChild(this.giveUpButton)
   
      // this.clearButton = new Button( 145, 425, "Clear", 
      //    this.clearSelections.bind(this), 0xEAE0E8,0xc5472b,0xe5674b)
      // this.clearButton.alignTopLeft()
      // this.addChild(this.clearButton)
      // this.clearButton.disable()
      
      // this.submitButton = new Button( 247, 425, "Submit", 
      //    this.submitWord.bind(this), 0xCAF0F8,0x298058,0x48CAE4)
      // this.submitButton.disable()
      // this.submitButton.alignTopLeft()
      // this.addChild(this.submitButton)
   
      // this.gfx.rect(4, 488, Tile.WIDTH*3+8, Tile.HEIGHT+8). 
      //    stroke({width: 1, color: 0xCAF0F8}).fill(0x48CAE4)
   
      // let helpX = 8
      // for ( let i=0; i<3; i++ ) {
      //    let h = new Tile(new Letter("?", 0), helpX,492, this.tileClicked.bind(this))
      //    this.helpers.push( h )
      //    helpX += Tile.WIDTH
      //    this.addChild(h)
      // }
   
      this.clock = new Clock(280, 505, "", 0xCAF0F8)
      this.addChild(this.clock)
      // this.scoreDisplay = new Text({text: "00000", style: {
      //    fill: "#CAF0F8",
      //    fontFamily: "Arial",
      //    fontSize: 24,
      //    fontWeight: "bold",
      // }})
      // this.scoreDisplay.anchor.set(0.5, 1)
      // this.scoreDisplay.x = 280 
      // this.scoreDisplay.y = 545
      // this.addChild(this.scoreDisplay)

      // this.enableGrid( false )

      // this.startOverlay = new StartOverlay(this.startHandler.bind(this)) 
      // this.addChild(this.startOverlay)
      // this.pickOverlay = new PickOverlay( this.helperHandler.bind(this) )
      // this.endOverlay = new EndOverlay(replayHandler, backHandler)
   }

   helperHandler( pickedLetters ) {
      pickedLetters.forEach( (l,idx) => {
         this.helpers[idx].set( l )
      })
      this.gameState = "play"
      this.removeChild(this.pickOverlay)
      this.enableGrid( true )
   }

   startHandler() {
      this.gameState = "pick"
      this.removeChild( this.startOverlay )
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
      if ( this.dictionary.isValid(this.word.text) ) {
         this.wordsCreated[ this.word.text.length]++
         this.scoreTiles()
         this.checkForWin()
         this.word.text = ""
         this.submitButton.disable()
         this.clearButton.disable()
         this.enableGrid(true)
      } else {
         this.submitFailed()
      }
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
         setTimeout( () => {
            this.gameState = "over"
            let c = new Confetti(this.app.stage, this.square, this.gameWidth, () => {
               this.endOverlay.setWin( this.score, this.clock.gameTimeFormatted(), this.wordsCreated )
               this.addChild( this.endOverlay )
            })
         }, 250)
      } 
   }
   
   submitFailed() {
      let origColor = this.word.style.fill
      this.word.style.fill = 0xFF4500
         setTimeout( () => {
         this.clearSelections()
         this.word.style.fill = origColor
      }, 800)     
   }
   
   scoreTiles() {
      let wordValue = 0
      let wordLen = this.word.text.length
      for (let r = 0; r < Sweep.ROWS; r++) {
         for (let c = 0; c < Sweep.COLS; c++) {
            if ( this.grid[r][c].selected) {
               const tile = this.grid[r][c]
               wordValue += tile.score
               const boom = new Boom(this.app.stage, this.spark, tile.center.x, tile.center.y)
               boom.start(() => {
                  tile.clear()
               }) 
            }
         }
      }
      this.helpers.forEach( tile => {
         if (tile.selected ) {
            wordValue += tile.score
            const boom = new Boom(this.app.stage, this.spark, tile.center.x, tile.center.y)
            boom.start(() => {
               tile.clear()
            }) 
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
}