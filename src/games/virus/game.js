import { Text, Assets } from "pixi.js"
import BaseGame from "@/games/common/basegame"

import GameState from "@/games/virus/gamestate"
import Letter from "@/games/virus/letter"
import StartOverlay from "@/games/virus/startoverlay"
import EndOverlay from "@/games/virus/endoverlay"
import Gauge from "@/games/virus/gauge"
import LetterPool from "@/games/common/letterpool"
import Clock from "@/games/common/clock"
import Button from "@/games/common/button"
import IconButton from "@/games/common/iconbutton"
import Dictionary from "@/games/common/dictionary"
import Boom from "@/games/virus/boom"
import * as TWEEDLE from "tweedle.js"

export default class Virus extends BaseGame {
   static ROWS = 6
   static COLS = 6
   static MAX_INFECTIONS = 10

   particle = null
   grid = null
   dictionary = new Dictionary()
   pool = new LetterPool()
   initGameOverlay = null
   gameEndOverlay = null
   state = new GameState()
   checkCountdown = 0
   addCountdown = 1000
   lastIncreasedTimeSec = 0
   infectionLevel = 3     // minmum number of infected tiles
   pendingInfections = 0  // numner of infections to add to bring up to current level
   letterIndex = 0
   word = []
   wordCounts = []
   gauge = null
   enterKey = null 
   shuffleKey = null
   deleteKey = null
   gameplayToken = ""
   clock = null

   async initialize(restartHandler, backHandler) {
      await super.initialize() 

      this.app.ticker.add(() => TWEEDLE.Group.shared.update())
      this.particle = await Assets.load('/particle.png')
      const checkImg = await Assets.load('/images/virus/check.png')
      const cancelImg = await Assets.load('/images/virus/cancel.png')
      const zapImg = await Assets.load('/images/virus/antivirus.png')

      let y = 40
      let x = 40   
      this.grid = Array(Virus.ROWS).fill().map(() => Array(Virus.COLS))
      for (let r = 0; r < Virus.ROWS; r++) {
         for (let c = 0; c < Virus.COLS; c++) {
            let l = new Letter(x,y, r,c)
            l.setClickCallback( this.letterClicked.bind(this) )
            this.addChild(l)
            this.grid[r][c] = l
            x += 55
         }
         y += 55
         x = 40
      }

      this.gfx.moveTo(0, 352).lineTo(this.gameWidth, 352).stroke({width: 1, color: 0x888899})
      this.gfx.moveTo(0, 413).lineTo(this.gameWidth, 413).stroke({width: 1, color: 0x888899})
   
      // setup blank word... to be filled with clicked letters from grid
      x = 8
      for ( let i=0; i<10; i++) {
         // draw the underline for the lettercl
         this.gfx.moveTo(x, 395).lineTo(x+20, 395).stroke({width: 1, color: 0x888899})  
   
         let wordLetter = new Text({text: "", style: {
            fill: "#cccccc",
            fontFamily: "\"Courier New\", Courier, monospace",
            fontSize: 24,
         }})
         wordLetter.anchor.set(0.5, 0)
         wordLetter.x = x+10
         wordLetter.y = 365
         this.addChild(wordLetter)
         this.word.push( wordLetter )
   
         x+=23
      }
   
      this.enterKey = new IconButton(320,382,checkImg)
      this.enterKey.setListener( this.enterWord.bind(this) )
      this.enterKey.setEnabled(false)
      this.addChild(this.enterKey)

      this.deleteKey = new IconButton(266,382,cancelImg)
      this.deleteKey.setListener( this.clearWord.bind(this) )
      this.deleteKey.setEnabled(false)
      this.addChild(this.deleteKey)

      this.shuffleKey = new Button( 10, 475, "RANDOMIZE", 
         this.shuffleGrid.bind(this), 0xccccff,0x445577,0x77aaff)
      this.shuffleKey.alignTopLeft()
      this.addChild(this.shuffleKey)

      this.zapButton = new IconButton(318,495,zapImg,0x4de699)
      this.zapButton.setListener( this.zapPushed.bind(this) )
      this.zapButton.setEnabled(false)
      this.addChild(this.zapButton)
   
      this.gauge = new Gauge(10, 430, this.gameWidth-20)
      this.addChild( this.gauge )
   
      // have a clock to track time, but no need to display
      this.clock = new Clock(310, 545, "", 0xCAF0F8, "\"Courier New\", Courier, monospace")
      this.addChild(this.clock)
      this.score = 0 
      this.scoreDisplay = new Text({text: "00000", style: {
         fill: 0xCAF0F8,
         fontFamily: "\"Courier New\", Courier, monospace",
         fontSize: 18,
         }
      })
      this.scoreDisplay.position.set(10,545)
      this.scoreDisplay.anchor.set(0, 0.5)
      this.addChild(this.scoreDisplay)

      this.initGameOverlay = new StartOverlay(this.startGame.bind(this)) 
      this.gameEndOverlay = new EndOverlay(restartHandler, backHandler) 
      this.addChild(this.initGameOverlay)
   }

   startGame( ) {
      this.removeChild(this.initGameOverlay)
   
      this.pool.refill()
      this.wordCounts = [0,0,0,0,0,0,0,0,0,0] // one for each letter count; 0-10. only 4-10 will be set

      for (let r = 0; r < Virus.ROWS; r++) {
         for (let c = 0; c < Virus.COLS; c++) {
            this.grid[r][c].reset( this.pool.popScoringLetter() )
         }
      } 
   
      this.state.initialized()
      this.app.ticker.add( this.gameLoop.bind(this) )
   }

   checkInfectedCount() {
      this.checkCountdown = 1000.0
      let cnt = 0
      for (let r = 0; r < Virus.ROWS; r++) {
         for (let c = 0; c < Virus.COLS; c++) {
            // selected tiles don't expand the virus, so they don't count 
            if ( this.grid[r][c].isInfected &&  this.grid[r][c].selected == false) {
               cnt++
            }
         }
      }
   
      // If there is nothing, always start fill in the 4 corners
      if ( cnt < 4){
         let tgtR = [0, 0, Virus.ROWS-1, Virus.ROWS-1]
         let tgtC = [0, Virus.COLS-1, 0, Virus.COLS-1]
         for ( let i = 0; i<4; i++) {
            if ( this.grid[ tgtR[i] ][ tgtC[i] ].isInfected == false ) {
               this.grid[ tgtR[i] ][ tgtC[i] ].infect()
               cnt++
               if (cnt == 4) {
                  break
               }
            }  
         }
      }
   
      // keep the number of infected tiles at a minum of the current level
      if ( cnt < this.infectionLevel) {
         this.pendingInfections = this.infectionLevel - cnt
         this.addCountdown = 1000
      } else {
         this.pendingInfections = 0
         this.addCountdown = 0
      }
   }

   addInfectedTile() {
      let added = false
      for (let r = 0; r < Virus.ROWS; r++) {
         for (let c = 0; c < Virus.COLS; c++) {
            if (this.grid[r][c].infected == false) {
               this.grid[r][c].infect()
               added  = true
               break 
            }
         }
         if (added ) break
      }
   }

   zapPushed() {
      if ( this.gauge.isFull) {
         this.state.clearVirus()
         this.clearAllInfections()
      } else {
         this.gauge.zapUsed()
         this.zapButton.setEnabled( this.gauge.enableZap)
         let disinfectCnt = 6 
         for (let r = 0; r < Virus.ROWS; r++) {
            for (let c = 0; c < Virus.COLS; c++) {
               if ( disinfectCnt > 0) {
                  const tgtCell = this.grid[r][c]
                  if ( tgtCell.isInfected || tgtCell.isLost ) {
                     new Boom( this.app.stage, this.particle, tgtCell.x, tgtCell.y, true)
                     tgtCell.reset( this.pickNewLetter() )  
                     disinfectCnt--  
                  }
               }
            }
         }
      }
   }

   shuffleGrid() {
      if (this.state.isPlaying() == false) return 
      
      this.clearWord()
      let newLetters = this.pickNewLetters(Virus.ROWS*Virus.COLS) 
      for (let r = 0; r < Virus.ROWS; r++) {
         for (let c = 0; c < Virus.COLS; c++) {
            this.grid[r][c].replace( newLetters.pop() )  
         }
      }
   }

   enterWord() {      
      this.enterKey.setEnabled(false)
      this.deleteKey.setEnabled(false)
      this.state.requestSubmit()
      this.setWordColor(0xaaddff)  
   }

   doSubmission() {
      let testWord = ""
      this.word.forEach( l => testWord += l.text)
      if (this.dictionary.isValid(testWord)) {
         this.submitSuccess()
      } else {
         this.setWordColor(0xff5555)
         this.state.submitFailed()
      }
   }

   submitSuccess() {
      let letterValue = 0
      let wordSize = 0
      for (let r = 0; r < Virus.ROWS; r++) {
         for (let c = 0; c < Virus.COLS; c++) {
            const letterCell = this.grid[r][c]
            if (letterCell.isSelected ) {
               letterValue += letterCell.value
               wordSize++
               new Boom( this.app.stage, this.particle, letterCell.x, letterCell.y, letterCell.isInfected)
               letterCell.reset( this.pickNewLetter() )
            }
         }
      }

      this.score += letterValue * this.word.length * 5
      this.wordCounts[(wordSize-1)]++
      let val = `${this.score}`.padStart(5,"0")
      this.scoreDisplay.text = `$${val}`

      // FIXME adjust values to make it not easy
      if ( wordSize == 4 ) {
         this.gauge.increaseValue( 7 ) 
      } else if (wordSize == 5) {
         this.gauge.increaseValue( 10 ) 
      } else if (wordSize == 6 || wordSize == 7 ) {
         this.gauge.increaseValue( 15 ) 
      }  else if (wordSize > 7 ) {
         this.gauge.increaseValue( 20 ) 
      }

      this.state.submitSuccess()
   }

   setWordColor( c ) {
      this.word.forEach( wl => {
         wl.style.fill = c
      }) 
   }

   clearWord() {
      this.word.forEach( wl  => wl.text = "")
      for (let r = (Virus.ROWS-1); r >= 0; r--) {
         for (let c = (Virus.COLS-1); c  >= 0; c--) {
            this.grid[r][c].deselect()
         }
      }
      this.letterIndex = 0
      Letter.wordFull = false
      this.enterKey.setEnabled(false)
      this.deleteKey.setEnabled(false)
   }

   pickNewLetter() {
      let l = this.pickNewLetters(1)
      return l[0]
   }
   
   pickNewLetters( cnt ) {
      let out = [] 
      for (let i=0; i<cnt; i++ ) {
         if ( this.pool.hasTilesLeft() == false) {
            this.pool.refill()
         }
         out.push( this.pool.popScoringLetter() )
      }
      return out
   }
   
   letterClicked( letter ) {
      if (this.state.isGameOver()) return 

      Letter.wordFull = false
      this.word[this.letterIndex].text = letter.text
      this.letterIndex++
      if ( this.letterIndex > 3) {
         this.enterKey.setEnabled(true)
      } else {
         this.enterKey.setEnabled(false)
      }
      if (this.letterIndex == 10) {
         Letter.wordFull = true
      }
      this.deleteKey.setEnabled( true )
   }

   beginGameOver() {
      this.state.gameLost()

      this.enterKey.setEnabled(false)
      this.deleteKey.setEnabled(false)
      this.shuffleKey.disable()

      // wipe out any started word and take over all remaining letters
      this.clearWord()
      for (let r = (Virus.ROWS-1); r >= 0; r--) {
         for (let c = (Virus.COLS-1); c  >= 0; c--) {
            this.grid[r][c].fullyInfect()
         }
      }

      let x = 20
      for (let i=0; i<5; i++) {
         new Boom( this.app.stage, this.particle, x, 430)
         x += this.gameWidth / 5
      }
      this.gauge.reset()
   }

   clearAllInfections() {   
      for (let r = (Virus.ROWS-1); r >= 0; r--) {
         for (let c = (Virus.COLS-1); c  >= 0; c--) {
            let letter = this.grid[r][c]
            if ( letter.isLost || letter.infected ) {
               letter.reset( this.pickNewLetter() )
               new Boom( this.app.stage, this.particle, letter.x, letter.y)
            } 
         }
      }
   }

   letterLost( row, col ) {
      if ( this.state.isGameOver()) return
   
      let remainingLetters = 0
      for (let r = 0; r < Virus.ROWS; r++) {
         for (let c = 0; c < Virus.COLS; c++) {
            if ( this.grid[r][c].isLost == false) {
               remainingLetters++
            }
         }
      }
      
      if ( remainingLetters < 4 ) {
         this.beginGameOver()
         return
      }
   
      let isInWord = false 
      this.word.forEach( wl => {
         if (wl.fromRow == row && wl.fromCol == col) {
            isInWord = true
         }
      })
      if ( isInWord ) {
         this.clearWord()
      }
   
      if ( row > 0) {
         this.grid[row-1][col].infect()
      }
      if ( row < (Virus.ROWS-1) ) {
         this.grid[row+1][col].infect()
      }
      if ( col > 0) {
         this.grid[row][col-1].infect()
      }
      if ( col < (Virus.COLS-1)) {
         this.grid[row][col+1].infect()
      }
   }

   wordSubmitFinished() {
      this.letterIndex = 0
      Letter.wordFull = false
   
      // is the game over?
      if ( this.gauge.enableZap) {
         this.zapButton.setEnabled(true)
      }
   }

   gameStateChanged( oldState, newState, ) {
      console.log("NEW STATE FROM "+oldState+" TO "+newState)
      if (newState == GameState.SUBMIT) {
         this.doSubmission()
      } else if (newState == GameState.PLAY) {
         this.setWordColor(0xcccccc)
         if ( oldState == GameState.FAIL) {
            this.clearWord()
         } if ( oldState == GameState.SUCCESS) {
            this.clearWord()
            this.wordSubmitFinished()
         }
      } else if ( newState == GameState.GAME_OVER )  {
         if ( oldState == GameState.CLEAR_ALL ) {
            this.gameEndOverlay.setWin(true)
            this.gameEndOverlay.updateStats( this.clock.timeSec, this.score,this.wordCounts)
            this.addChild(this.gameEndOverlay)
         } else if (oldState == GameState.PLAYER_LOST ) {
            this.gameEndOverlay.setWin( false )
            this.gameEndOverlay.updateStats( this.clock.timeSec, this.score, this.wordCounts)
            this.addChild(this.gameEndOverlay)
         }
      }
   }

   // MAIN GAME LOOP =========================================================
   gameLoop() {
      if (this.state.isGameOver()) {
         return
      }

      this.state.update( this.app.ticker.deltaMS, this.gameStateChanged.bind(this))

      if ( this.state.isSubmitting() || this.state.isWinning() || this.state.isLosing() ) {
         // dont advance time or infections while a word is being submitted
         return
      }

      this.clock.tick(this.app.ticker.deltaMS)

      // Every 30 seconds, increase rate by 10%, and raise infection level
      let timeSec = this.clock.timeSec
      if ( timeSec>0 && timeSec != this.lastIncreasedTimeSec && timeSec % 30 == 0) { 
         this.lastIncreasedTimeSec = timeSec
         Letter.increseInfectionRate()
         if (this.infectionLevel < Virus.MAX_INFECTIONS) {
            this.infectionLevel++
         }
      }

      // is it time to check for infectedd tile counts (very second)?
      this.checkCountdown -= this.app.ticker.deltaMS 
      if (this.checkCountdown <= 0 ) {
         this.checkInfectedCount()
      }

      // if more infections are pending add them once per second
      if ( this.pendingInfections > 0 ) {
         this.addCountdown -= this.app.ticker.deltaMS 
         if (this.addCountdown <=0)  {
            this.addCountdown = 1000
            this.addInfectedTile()
            this.pendingInfections--
         }
      }

      // Tick all letters to gro infection. Pass along a callback for lost letter
      for (let r = 0; r < Virus.ROWS; r++) {
         for (let c = 0; c < Virus.COLS; c++) {
            this.grid[r][c].update( this.app.ticker.deltaMS, this.letterLost.bind(this))
}
      }
   }

   destroy() {
      super.destroy()
      if (this.initGameOverlay) {
         this.initGameOverlay.destroy()
      }
      if (this.gameEndOverlay) {
         this.gameEndOverlay.destroy()
      }
   }
}