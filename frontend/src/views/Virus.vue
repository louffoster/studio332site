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
import WinOverlay from "@/games/virus/winoverlay"
import Gauge from "@/games/virus/gauge"
import Pool from "@/games/virus/pool"
import * as PIXI from "pixi.js"
import { onMounted, onBeforeUnmount } from "vue"
import axios from 'axios'
const API_SERVICE = import.meta.env.VITE_S332_SERVICE

const ROWS = 6
const COLS = 5
const GAME_WIDTH = 300
const GAME_HEIGHT = 600
const MAX_INFECTIONS = 5

var app = null
var scene = null
var grid = null
var pool = new Pool()
var initGameOverlay = null
var gameOverOverlay = null
var winOverlay = null
var gameOver = true
var letterIndex = 0
var checkCountdown = 0
var addCountdown = 1000
var lastIncreasedTimeSec = 0
var infectionLevel = 3     // minmum number of infected tiles
var pendingInfections = 0  // numner of infections to add to bring up to current level
var gameTime = 0.0
var timerDisplay = null
var word = []
var gfx = null
var wordCounts = []
var gauges = []
var gameplayToken = ""

onBeforeUnmount(() => {
   app.ticker.stop()
   if (initGameOverlay) {
      initGameOverlay.destroy()
   }
   if (gameOverOverlay) {
      initGameOverlay.destroy()
   }
   if (winOverlay) {
      winOverlay.destroy()
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

   layoutGameScreen()

   initGameOverlay = new StartOverlay(API_SERVICE) 
   gameOverOverlay = new EndOverlay(restartHandler) 
   winOverlay = new WinOverlay(restartHandler) 
   scene.addChild(initGameOverlay)
   initGameOverlay.startGameInit( startGame )

   app.start()
   app.ticker.add( gameLoop )
})

function layoutGameScreen() {
   gfx = new PIXI.Graphics() 
   scene.addChild(gfx)

   gfx.beginFill(0x664444)
   gfx.drawRect(0, 287, GAME_WIDTH, 68)
   gfx.endFill()

   let y = 40
   let x = 40   
   grid = Array(ROWS).fill().map(() => Array(COLS))
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         let l = new Letter("", x,y, r,c)
         l.setClickCallback(letterClicked)
         scene.addChild(l)
         grid[r][c] = l
         x += 55
      }
      y += 55
      x = 40
   } 

   let style = new PIXI.TextStyle({
      fill: "#cccccc",
      fontFamily: "\"Courier New\", Courier, monospace",
      fontSize: 24,
   })

   gfx.lineStyle(1, 0x888899, 1)
   gfx.moveTo(0, 353)
   gfx.lineTo(GAME_WIDTH, 353)
   gfx.moveTo(0, 425)
   gfx.lineTo(GAME_WIDTH, 425)

   // setup blank word... to be filled with clicked letters from grid
   x = 10
   for ( let i=0; i<6; i++) {
      // draw the underline for the lettercl
      gfx.moveTo(x, 405)
      gfx.lineTo(x+20, 405)  

      let wordLetter = new PIXI.Text("", style)
      wordLetter.x = x+2
      wordLetter.y = 375
      scene.addChild(wordLetter)
      word.push( {letter: wordLetter, fromRow: -1, fromCol: -1})

      x+=25
   }

   let enterKey = new EnterKey(170,375, enterWord)
   scene.addChild(enterKey)
   let shuffleKey = new ShuffleKey(170+70 ,375, shuffleGrid)
   scene.addChild(shuffleKey)

   // word count gauges
   gauges = []
   let maxValues = [10,6,4,3] 
   let gaugeY = 440
   for (let i=0; i<4; i++) {
      let g = new Gauge(10,gaugeY,`${i+3}`, maxValues[i])
      gauges.push( g )
      scene.addChild( g )
      gaugeY+=28
   }

   // timer 
   gfx.moveTo(0, 560)
   gfx.lineTo(GAME_WIDTH, 560)
   timerDisplay = new PIXI.Text("Uptime: 00:00", {
      fill: "#44cc44",
      fontFamily: "\"Courier New\", Courier, monospace",
      fontSize: 18,
   })
   timerDisplay.anchor.set(0.5,0)
   timerDisplay.x = GAME_WIDTH/2
   timerDisplay.y = 570
   scene.addChild(timerDisplay)
}

function startGame( jwt ) {
   gameplayToken = jwt
   scene.removeChild(initGameOverlay)

   pool.refill()
   wordCounts = [0,0,0,0] // one for each letter count; 3,4,5,6
   gameOver = false

   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         grid[r][c].reset( pool.pop() )
      }
   } 
}

function gameLoop() {
   if (gameOver) {
      return
   }

   // get prior time and new time. necessary to check if a new second has gone by
   let origTimeSec = Math.round(gameTime / 1000)
   gameTime += app.ticker.deltaMS
   let timeSec = Math.round(gameTime / 1000)

   // Every 30 seconds, increase rate by 10%, and raise infection level
   if ( timeSec>0 && timeSec != lastIncreasedTimeSec && timeSec % 30 == 0) { 
      lastIncreasedTimeSec = timeSec
      Letter.increseInfectionRate()
      if (infectionLevel < MAX_INFECTIONS) {
         infectionLevel++
      }
      console.log("NEW RATE: "+Letter.infectRatePerSec+"  LEVEL "+infectionLevel)
   }

   // is it time to check for infectedd tile counts (very second)?
   checkCountdown -= app.ticker.deltaMS 
   if (checkCountdown <= 0 ) {
      checkInfectedCount()
      if (pendingInfections > 0) {
         console.log("Checked infections. NEW pending: "+pendingInfections)
      }
   }

   // if more infections are pending add them once per second
   if ( pendingInfections > 0 ) {
      addCountdown -= app.ticker.deltaMS 
      if (addCountdown <=0)  {
         addCountdown = 1000
         addInfectedTile()
         pendingInfections--
         console.log("ADDED pending infection. Pending: "+pendingInfections)
      }
   }

   // Update the timer and display it
   if ( timeSec > origTimeSec) {
      let secs = timeSec
      let mins = Math.floor(timeSec / 60)
      if ( mins > 0) {
         secs = timeSec - mins*60
      }
      let timeStr = "Uptime: "+`${mins}`.padStart(2,"0")+":"+`${secs}`.padStart(2,"0")
      timerDisplay.text = timeStr
   }

   // Tick all letters to gro infection. Pass along a callback for lost letter
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         grid[r][c].update(app.ticker.deltaMS, letterLost)
      }
   }
}

function checkInfectedCount() {
   checkCountdown = 1000.0
   let cnt = 0
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         if ( grid[r][c].isInfected() ) {
            cnt++
         }
      }
   }

   // If there is nothing, always start with 3 in alternating columns in first row
   if (cnt == 0) {
      console.log("NO infections, add 3 starters immediately")
      grid[0][0].infect()
      grid[0][2].infect()
      grid[0][4].infect()
      cnt = 3
   }

   // keep the number of infected tiles at a minum of the current level
   if ( cnt < infectionLevel) {
      pendingInfections = infectionLevel - cnt
      addCountdown = 1000
   } else {
      pendingInfections = 0
      addCountdown = 0
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
   
   clearWord()
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
   // TODO flash error
   if ( letterIndex < 3) {
      addInfectedTile()
      return
   }

   let testWord = ""
   word.forEach( l => testWord += l.letter.text)
   let url = `${API_SERVICE}/virus/check?w=${testWord}`
   await axios.post(url).then( () => {
      wordAccepted( )
   }).catch( e => {
      // FAILED WORD TODO
      clearWord()
      addInfectedTile()
   })
}

function wordAccepted() {
   let newLetters = drawNewLetters(letterIndex) 
   let clearCounts = [0,0,2,3,4,5]
   let clearCnt = clearCounts[newLetters.length-1]
   console.log(`GOOD ${newLetters.length} WORD. DISINFECT ${clearCnt}`)

   // Increase the letter count gauges
   let cntIdx = newLetters.length - 3 
   gauges[cntIdx].increaseValue()
   wordCounts[cntIdx]++
   if ( areGaugesFull()) {
      gameOver = true
      winOverlay.updateStats(Math.round(gameTime / 1000), wordCounts)
      scene.addChild(winOverlay)
      return
   }

   // go from bottom to top and clear infected tiles 
   // based on the length of the correct word
   for (let r = (ROWS-1); r >= 0; r--) {
      for (let c = 0; c < COLS; c++) {

         // restore lost letters first
         if ( grid[r][c].isLost() && clearCnt > 0 ) {
            let letters = drawNewLetters(1)
            grid[r][c].reset(letters[0])
            clearCnt--
         }

         // the selected letter is infected. clear it and deduct from clear counts
         // TODO maybe don't count this as a clear?
         if (grid[r][c].selected) {
            if (grid[r][c].infected && clearCnt > 0) {
               clearCnt--
            }
            // alwys reset seleccted infected tiles regardless of counts
            let replacement = newLetters.pop()
            grid[r][c].reset( replacement )  
         }

         // disinfect infected tiles
         if ( grid[r][c].infected && clearCnt > 0 ) {
            grid[r][c].disinfect()   
            clearCnt--
         }
      }
   }
   clearWord()
}

function areGaugesFull() {
   let allFull = true
   gauges.forEach( g =>{
      if (g.isFull() == false) {
         allFull = false
      }
   })
   return allFull
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
   if (row == ROWS-1 && gameOver == false) {
      for (let r = 0; r < ROWS; r++) {
         for (let c = 0; c < COLS; c++) {
            grid[r][c].replace( "" )
         }
      } 
      gameOver = true
      gameOverOverlay.updateStats(Math.round(gameTime / 1000), wordCounts)
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
   letterIndex = 0
   checkCountdown = 1000
   addCountdown = 1000
   lastIncreasedTimeSec = 0
   gameTime = 0.0
   for ( let i=0; i<6; i++) {
     word[i].letter.text = ""
     word[i].fromRow = -1
     word[i].fromCol = -1
   }
   wordCounts = []
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         grid[r][c].reset( "" )
         grid[r][c].update(0, letterLost)
      }
   } 

   gauges.forEach( g => g.reset() )
   
   scene.removeChild(winOverlay)
   scene.removeChild(gameOverOverlay)
   scene.addChild(initGameOverlay)
   initGameOverlay.startGameInit( startGame )
}
</script>

<style scoped>
#game {
   margin-top: 15px;
}
</style>

