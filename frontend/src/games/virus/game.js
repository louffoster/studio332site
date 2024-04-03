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
import Dictionary from "@/games/common/dictionary"

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
   lastWordSize = 0
   wordCounts = []
   gauges = []
   enterKey = null 
   shuffleKey = null
   deleteKey = null
   gameplayToken = ""
   clock = null

   async initialize(restartHandler, backHandler) {
      await super.initialize() 
      this.particle = await Assets.load('/particle.png')

      let y = 40
      let x = 40   
      this.grid = Array(Virus.ROWS).fill().map(() => Array(Virus.COLS))
      for (let r = 0; r < Virus.ROWS; r++) {
         for (let c = 0; c < Virus.COLS; c++) {
            let l = new Letter("", x,y, r,c)
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
      for ( let i=0; i<8; i++) {
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
         this.word.push( {letter: wordLetter, fromRow: -1, fromCol: -1})
   
         x+=23
      }
   
      this.enterKey = new Button( 200, 365, "ENTER", 
         this.enterWord.bind(this), 0xccccff,0x445577,0x77aaff)
      this.enterKey.alignTopLeft()
      this.enterKey.small()
      this.enterKey.disable()
      this.addChild(this.enterKey)

      this.deleteKey = new Button( 285, 365, "DEL", 
         this.clearWord.bind(this), 0xccccff,0x445577,0x77aaff)
      this.deleteKey.alignTopLeft()
      this.deleteKey.small()
      this.deleteKey.disable()
      this.addChild(this.deleteKey)

      this.shuffleKey = new Button( 8, 560, "RANDOMIZE", 
         this.shuffleGrid.bind(this), 0xccccff,0x445577,0x77aaff)
      this.shuffleKey.alignTopLeft()
      this.addChild(this.shuffleKey)
   
      this.gauges = []
      let maxValues = [7,6,5,4] 
      let gaugeY = 430
      for (let i=0; i<4; i++) {
         let label = `${i+3}`
         if (i == 3) {
            label += "+"
         }
         let g = new Gauge(10,gaugeY,label, maxValues[i])
         this.gauges.push( g )
         this.addChild( g )
         gaugeY+=28
      }
   
      this.gfx.moveTo(0, 550).lineTo(this.gameWidth, 550).stroke({width: 1, color: 0x888899})

      this.clock = new Clock(250, 580, "", 0xCAF0F8, "\"Courier New\", Courier, monospace")
      this.addChild(this.clock)

      this.initGameOverlay = new StartOverlay(this.startGame.bind(this)) 
      this.gameEndOverlay = new EndOverlay(restartHandler, backHandler) 
      this.addChild(this.initGameOverlay)
   }

   startGame( ) {
      this.removeChild(this.initGameOverlay)
   
      this.pool.refill()
      this.wordCounts = [0,0,0,0] // one for each letter count; 3,4,5,6

      for (let r = 0; r < Virus.ROWS; r++) {
         for (let c = 0; c < Virus.COLS; c++) {
            this.grid[r][c].reset( this.pool.pop() )
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
            if ( this.grid[r][c].isInfected() &&  this.grid[r][c].selected == false) {
               cnt++
            }
         }
      }
   
      // If there is nothing, always start fill in the 4 corners
      if ( cnt < 4){
         let tgtR = [0, 0, Virus.ROWS-1, Virus.ROWS-1]
         let tgtC = [0, Virus.COLS-1, 0, Virus.COLS-1]
         for ( let i = 0; i<4; i++) {
            if ( this.grid[ tgtR[i] ][ tgtC[i] ].isInfected() == false ) {
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
      this.enterKey.disable()
      this.deleteKey.disable()
      this.state.requestSubmit()
      this.setWordColor(0xaaddff)  
   }

   async doSubmission() {
      let testWord = ""
      this.word.forEach( l => testWord += l.letter.text)
      if (this.dictionary.isValid(testWord)) {
         // letter index is the index of the next letter to add, so it is the word length
         this.lastWordSize = this.letterIndex 
         this.state.submitSuccess( this.lastWordSize )
      } else {
         this.setWordColor(0xff5555)
         this.state.submitFailed()
      }
   }

   setWordColor( c ) {
      this.word.forEach( wl => {
         wl.letter.style.fill = c
      }) 
   }

   disinfectLetter() {
      // clear the letter from the word and deselect it from the this.grid
      this.letterIndex--
      let selR = this.word[this.letterIndex].fromRow
      let selC = this.word[this.letterIndex].fromCol 
      let isSelectedInfected = this.grid[selR][selC].infected
   
      // reset this.grid letter and clear word letter
      this.grid[selR][selC].reset( this.pickNewLetter() )   
      this.word[this.letterIndex].letter.text = ""
      this.word[this.letterIndex].fromCol = -1
      this.word[this.letterIndex].fromRow = -1   
      
      let clearCnt = 1 
      if (this.letterIndex > 4) {
         // for words longer that 5 letters, fix two tiles
         clearCnt = 2
      }
         
      if ( isSelectedInfected ) {
         this.startVirusExplode( selR, selC)
         clearCnt-- 
         if (clearCnt == 0) {
            return
         }
      } 
   
      // start with restoring lost tiles. when there are none, reset infected
      let pass = 0
      while ( pass < 2 && clearCnt > 0) {
         for (let r = (Virus.ROWS-1); r >= 0; r--) {
            for (let c = (Virus.COLS-1); c  >= 0; c--) {
               if ( (pass == 0 && this.grid[r][c].isLost()) || 
                    (pass == 1 && this.grid[r][c].infected) )  {       
                  this.grid[r][c].reset( this.pickNewLetter() )
                  this.startVirusExplode( r, c )
                  clearCnt-- 
                  if (clearCnt == 0) {
                     break
                  }
               }
            }
            if (clearCnt == 0) {
               break
            }
         }
      
         pass++
      }
   }

   clearWord() {
      this.word.forEach( wl  => {
         if (wl.letter.text != "") {
            this.grid[wl.fromRow][wl.fromCol].deselect()
            wl.letter.text = ""
            wl.fromCol = -1
            wl.fromRow = -1   
         }
      })
      this.letterIndex = 0
      this.lastWordSize = 0
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
         out.push( this.pool.pop() )
      }
      return out
   }
   
   letterClicked( letter ) {
      if (this.state.isGameOver()) return 

      Letter.wordFull = false
      this.word[this.letterIndex].letter.text = letter.text
      this.word[this.letterIndex].fromCol = letter.col
      this.word[this.letterIndex].fromRow = letter.row 
      this.letterIndex++
      if ( this.letterIndex > 2) {
         this.enterKey.setEnabled(true)
      } else {
         this.enterKey.setEnabled(false)
      }
      if (this.letterIndex == 8) {
         Letter.wordFull = true
      }
      this.deleteKey.setEnabled( true )
   }

   startVirusExplode(row, col) {
      // var emitter = new particles.Emitter(this.scene, this.virusExplode )
      // let x = 40 + (col*55)
      // let y = 40 + (row*55)
      // emitter.updateOwnerPos(0,0)
      // emitter.updateSpawnPos(x,y)
      // emitter.playOnceAndDestroy()
   }


   beginGameOver() {
      this.state.gameLost()

      // wipe out any started word and take over all remaining letters
      this.clearWord()
      for (let r = (Virus.ROWS-1); r >= 0; r--) {
         for (let c = (Virus.COLS-1); c  >= 0; c--) {
            this.grid[r][c].fullyInfect()
         }
      }

      // blow up submit and shuffle
      this.startLossExplode( 200,385 )
      this.startLossExplode( 260,385 )

      // blow up all gauges
      let y = 430
      let x = 60
      for (let i=0; i<=4; i++) {
         for (let j=0; j<=4; j++) {
            this.startLossExplode( x,y )
            x+= 55
         }
         x= 60
         y+=26
      }

      setTimeout( () => {
         this.gauges.forEach( g => {
            g.reset() 
         })
         this.removeChild(this.enterKey)
         this.removeChild(this.shuffleKey)
         this.removeChild(this.deleteKey)
      }, 500)
   }

   startLossExplode(x,y) {
      // var emitter = new particles.Emitter(this.scene, this.loseExplode )
      // emitter.updateOwnerPos(0,0)
      // emitter.updateSpawnPos(x,y)
      // emitter.playOnceAndDestroy()
   }

   clearAllInfections() {   
      for (let r = (Virus.ROWS-1); r >= 0; r--) {
         for (let c = (Virus.COLS-1); c  >= 0; c--) {
            if ( this.grid[r][c].isLost()  || this.grid[r][c].infected ) {
               this.grid[r][c].reset( this.pickNewLetter() )
               this.startVirusExplode( r, c )
            } 
         }
      }
   }

   letterLost( row, col ) {
      if ( this.state.isGameOver()) return
   
      let biggestWordLeft = 0 
      let sizes = [3,4,5,6]
      this.gauges.forEach( (g, idx) =>{
         if (g.isFull() == false) {
            biggestWordLeft = sizes[idx]   
         }
      })
   
      let remainingLetters = 0
      for (let r = 0; r < Virus.ROWS; r++) {
         for (let c = 0; c < Virus.COLS; c++) {
            if ( this.grid[r][c].isLost() == false) {
               remainingLetters++
            }
         }
      }
      
      // console.log("Letters left: "+remainingLetters+", biggestWordLeft: "+biggestWordLeft)
      if ( remainingLetters < biggestWordLeft ) {
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

   areGaugesFull() {
      let allFull = true
      this.gauges.forEach( g =>{
         if (g.isFull() == false) {
            allFull = false
         }
      })
      return allFull
   }

   wordDisinfectFinished() {
      //  Increase the letter count this.gauges and word scoreboard
      let cntIdx = this.lastWordSize - 3 
      cntIdx = Math.max(0, cntIdx )
      cntIdx = Math.min(3, cntIdx )
      if ( this.gauges[cntIdx].isFull() == false ) {
         this.gauges[cntIdx].increaseValue()
      }
      this.wordCounts[cntIdx]++
   
      // reset this.grid and word trackers
      this.pickNewLetters( this.lastWordSize )
      this.letterIndex = 0
      this.lastWordSize = 0
      Letter.wordFull = false
   
      // is the game over?
      if ( this.areGaugesFull()) {
         this.state.clearVirus()
         this.clearAllInfections()
      }
   }

   async gameStateChanged( oldState, newState, ) {
      console.log("NEW STATE FROM "+oldState+" TO "+newState)
      if (newState == GameState.SUBMIT) {
         await this.doSubmission()
      } else if (newState == GameState.PLAY) {
         this.setWordColor(0xcccccc)
         if ( oldState == GameState.FAIL) {
            this.clearWord()
         } if ( oldState == GameState.SUCCESS) {
            this.wordDisinfectFinished()
         }
      } else if ( newState == GameState.SUCCESS) {
         this.disinfectLetter( )
      } else if ( newState == GameState.GAME_OVER )  {
         if ( oldState == GameState.CLEAR_ALL ) {
            this.gameEndOverlay.setWin(true)
            this.gameEndOverlay.updateStats( this.clock.timeSec, this.wordCounts)
            this.addChild(this.gameEndOverlay)
         } else if (oldState == GameState.PLAYER_LOST ) {
            this.gameEndOverlay.setWin( false )
            this.gameEndOverlay.updateStats( this.clock.timeSec, this.wordCounts)
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