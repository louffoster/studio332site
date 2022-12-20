<template>
   <div id="game">
   </div>
</template>

<script setup>
import Letter from "@/games/virus/letter"
import EnterKey from "@/games/virus/enterkey"
import ShuffleKey from "@/games/virus/shufflekey"
import StartOverlay from "@/games/virus/startoverlay"
import EndOverlay from "@/games/virus/endoverlay"
import Pool from "@/games/virus/pool"
import * as PIXI from "pixi.js"
import { onMounted, onBeforeUnmount } from "vue"
import axios from 'axios'
const API_SERVICE = import.meta.env.VITE_S332_SERVICE


var app = null
var scene = null
var grid = null
var pool = new Pool()
var initGameOverlay = null
var gameOverOverlay = null
var gameOver = false
var letterIndex = 0
var checkCountdown = 500
var growInfection = false 
var addCountdown = 1000
var maxInfections = 3
var lastIncreasedTimeSec = 0
var gameTime = 0.0
var timerDisplay = null
var debugDisplay = null
var word = []
var gfx = null
var wordCounts = []
const ROWS = 6
const COLS = 5
const GAME_WIDTH = 300
const GAME_HEIGHT = 600

onBeforeUnmount(() => {
   app.ticker.stop()
   if (initGameOverlay) {
      initGameOverlay.destroy()
   }
   if (gameOverOverlay) {
      initGameOverlay.destroy()
   }
   scene.destroy({
      children: true,
      texture: true,
      baseTexture: true
   })
   app.stage.removeChildren()
   let gameEle = document.getElementById("game")
   gameEle.removeChild(app.view)
})

onMounted(async () => {
   pool.refill()

   PIXI.settings.RESOLUTION = window.devicePixelRatio || 1
   app = new PIXI.Application({
      autoDensity: true, // Handles high DPI screens
      backgroundColor: 0x44444a,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
   })

   // The application will create a canvas element for you that you
   // can then insert into the DOM, then add the base scene container 
   // in this setup, all content added to the scene is auto scaled
   let gameEle = document.getElementById("game")
   gameEle.appendChild(app.view)
   scene = new PIXI.Container()
   app.stage.addChild(scene)

   initGameOverlay = new StartOverlay(API_SERVICE) 
   gameOverOverlay = new EndOverlay(restartHandler, gameTime, wordCounts) 
   scene.addChild(initGameOverlay)
   initGameOverlay.startGameInit( startGame )
})

function startGame( jwt ) {
   console.log("START GAME "+jwt)
   scene.removeChild(initGameOverlay)

   gfx = new PIXI.Graphics() 
   scene.addChild(gfx)

   wordCounts = [0,0,0,0] // onve for each letter count; 3,4,5,6

   gfx.lineStyle(3, 0xff6666, 1)
   gfx.moveTo(0, 295)
   gfx.lineTo(GAME_WIDTH, 295)

   let y = 40
   let x = 40   
   grid = Array(ROWS).fill().map(() => Array(COLS))
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         let l = new Letter(pool.pop(), x,y, r,c)
         l.setClickCallback(letterClicked)
         scene.addChild(l)
         grid[r][c] = l
         x += 55
         if (r == 0 && c > 0 && c < 4) {
            l.infect()
         }
      }
      y += 55
      if (r == ROWS-2) {
         y+= 15
      }
      x = 40
   } 

   let style = new PIXI.TextStyle({
      fill: "#cccccc",
      fontFamily: "\"Courier New\", Courier, monospace",
      fontSize: 24,
   })

   gfx.lineStyle(1, 0xcccccc, 1)
   gfx.moveTo(0, 370)
   gfx.lineTo(300, 370)
   gfx.moveTo(0, 425)
   gfx.lineTo(300, 425)

   // setup blank word... to be filled with clicked letters from grid
   x = 10
   for ( let i=0; i<6; i++) {
      // draw the underline for the letter
      gfx.moveTo(x, 410)
      gfx.lineTo(x+20, 410)  

      let wordLetter = new PIXI.Text("", style)
      wordLetter.x = x+2
      wordLetter.y = 380
      scene.addChild(wordLetter)
      word.push( {letter: wordLetter, fromRow: -1, fromCol: -1})

      x+=25
   }

   let enterKey = new EnterKey(170,380, enterWord)
   scene.addChild(enterKey)
   let shuffleKey = new ShuffleKey(170+70 ,380, shuffleGrid)
   scene.addChild(shuffleKey)

   // timer and debug
   timerDisplay = new PIXI.Text("00:00", style)
   timerDisplay.x = 10
   timerDisplay.y = 435
   scene.addChild(timerDisplay)
   debugDisplay = new PIXI.Text(`${maxInfections}, R ${Letter.infectRatePerSec}`, style)
   debugDisplay.x = 120
   debugDisplay.y = 435
   scene.addChild(debugDisplay)

   app.start()
   app.ticker.add( gameLoop )
}

function gameLoop() {
   if (gameOver) {
      return
   }

   let origTimeSec = Math.round(gameTime / 1000)
   gameTime += app.ticker.deltaMS
   let timeSec = Math.round(gameTime / 1000)

   // get harder every 20 seconds
   if ( timeSec>0 && timeSec != lastIncreasedTimeSec && timeSec % 20 == 0) { 
      maxInfections++
      if (maxInfections > 10) {
         maxInfections = 10
      }
      Letter.infectRatePerSec += Letter.infectRatePerSec * 0.15
      if ( Letter.infectRatePerSec > 12.5) {
         Letter.infectRatePerSec = 12.5
      }
      debugDisplay.text = `${maxInfections}, R ${Letter.infectRatePerSec}`
      lastIncreasedTimeSec = timeSec
      addInfectedTile()
   }

   if ( timeSec > origTimeSec) {
      let secs = timeSec
      let mins = Math.floor(timeSec / 60)
      if ( mins > 0) {
         secs = timeSec - mins*60
      }
      let timeStr = `${mins}`.padStart(2,"0")+":"+`${secs}`.padStart(2,"0")
      timerDisplay.text = timeStr
   }
   
   checkCountdown -= app.ticker.deltaMS 
   if (checkCountdown <= 0 ) {
      checkInfectedCount()
   }

   if ( growInfection ) {
      addCountdown -= app.ticker.deltaMS 
      if (addCountdown <=0)  {
         addCountdown = 0 
         growInfection = false
         addInfectedTile()
      }
   }

   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         grid[r][c].update(app.ticker.deltaMS, letterLost)
      }
   }
}

function checkInfectedCount() {
   checkCountdown = 500.0
   let cnt = 0
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         if ( grid[r][c].isInfected() ) {
            cnt++
         }
      }
   }
   if ( cnt < maxInfections ) {
      addInfectedTile()
   }
}

function addInfectedTile() {
   let added = false
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         if (grid[r][c].infected == false) {
            grid[r][c].infect()
            added  = true
            break 
         }
      }
      if (added ) break
   }
}

function shuffleGrid() {
   if (gameOver) return 
   
   let newLetters = drawNewLetters(ROWS*COLS) 
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         grid[r][c].replace( newLetters.pop() )  
      }
   }
}

async function enterWord() {
   if (gameOver) return

   // 3 letters or more required!
   if ( letterIndex < 3) return

   let testWord = ""
   word.forEach( l => testWord += l.letter.text)
   let url = `${API_SERVICE}/virus/check?w=${testWord}`
   await axios.post(url).then( () => {
      replaceAll( )
   }).catch( e => {
      clearWord()
   })
}

function replaceAll() {
   let newLetters = drawNewLetters(letterIndex) 
   //let clearCnt = newLetters.length-2
   let clearCounts = [0,0,1,2,4,6]
   let clearCnt = clearCounts[newLetters.length-1]
   console.log(`GOOD ${newLetters.length} WORD. DISINFECT ${clearCnt}`)

   let cntIdx = newLetters.length - 3 
   wordCounts[cntIdx]++
   console.log(wordCounts)

   // go from bottom to top and clear infected tiles 
   // based on the length of the correct word
   for (let r = (ROWS-1); r >= 0; r--) {
      for (let c = 0; c < COLS; c++) {
         if (grid[r][c].selected) {
            if (grid[r][c].infected && clearCnt > 0) {
               clearCnt--
            }
            let replacement = newLetters.pop()
            grid[r][c].reset( replacement )  
         }
         if ( grid[r][c].isLost() && clearCnt > 0 ) {
            let letters = drawNewLetters(1)
            grid[r][c].reset(letters[0])
            clearCnt--
         }
         if ( grid[r][c].infected && clearCnt > 0 ) {
            grid[r][c].disinfect()   
            clearCnt--
         }
      }
   }
   clearWord()
}

function clearWord() {
   word.forEach( wl  => {
      if (wl.letter.text != "") {
         grid[wl.fromRow][wl.fromCol].deselect()
         wl.letter.text = ""
         wl.fromCol = -1
         wl.fromRow = -1   
      }
   })
   letterIndex = 0
   Letter.wordFull = false
}

function drawNewLetters( cnt ) {
   let out = [] 
   for (let i=0; i<cnt; i++ ) {
      if ( pool.hasTilesLeft() == false) {
         pool.refill()
      }
      out.push( pool.pop() )
   }
   return out
}

function letterClicked( selected, row, col, letter) {
   if (gameOver) {
      return
   }
   Letter.wordFull = false
   if (selected) {
      word[letterIndex].letter.text = letter
      word[letterIndex].fromCol = col
      word[letterIndex].fromRow = row 
      letterIndex++ 
      if (letterIndex == 6) {
         Letter.wordFull = true
      }
   } else {
      clearWord()
   }
}

function letterLost( row, col ) {
   // if any in the last row are lost, game over
   if (row == ROWS-1) {
      gameOver = true
      scene.addChild(gameOverOverlay)
      return
   }
   let isInWord = false 
   word.forEach( wl => {
      if (wl.fromRow == row && wl.fromCol == col) {
         isInWord = true
      }
   })
   if ( isInWord ) {
      clearWord()
   }

   if ( row > 0) {
      grid[row-1][col].infect()
   }
   if ( row < (ROWS-1) ) {
      grid[row+1][col].infect()
   }
   if ( col > 0) {
      grid[row][col-1].infect()
   }
   if ( col < (COLS-1)) {
      grid[row][col+1].infect()
   }
}

function restartHandler() {
   Letter.wordFull = false 
   Letter.infectRatePerSec = 5.0
   gameOver = false
   letterIndex = 0
   checkCountdown = 500
   growInfection = false 
   addCountdown = 1000
   maxInfections = 3
   lastIncreasedTimeSec = 0
   gameTime = 0.0
   word = []
   wordCounts = []
   pool.refill()
   scene.removeChildren()

   // TODO RESTART game wigout double creatiing stuff
}
</script>

<style scoped>
#game {
   margin-top: 15px;
}
</style>

