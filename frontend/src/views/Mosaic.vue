<template>
   <div id="game">
   </div>
</template>

<script setup>
import * as PIXI from "pixi.js"
import * as TWEEDLE from "tweedle.js"
import { onMounted, onBeforeUnmount } from "vue"
import Tile from "@/games/mosaic/tile"
import Spinner from "@/games/mosaic/spinner"
import StartOverlay from "@/games/mosaic/startoverlay"
import EndOverlay from "@/games/mosaic/endoverlay"
import ResetButton from "@/games/mosaic/resetbutton"

const GAME_WIDTH = 360
const GAME_HEIGHT = 545
const ROWS = 5
const COLS = 5

var app = null
var scene = null
var gfx = null
var tileContainer = null
var tileFilter = null
var tiles = null
var targetContainer = null
var targetFilter = null
var targetTiles = null
var spinners = null
var gameTimeMS = 300.0 * 1000.0
var timerDisplay = null
var matchCount = 0
var matchDisplay = null
var gameState = "start"
var startOverlay = null
var endOverlay = null
var resetButton = null
var matching = false 
var matchingTimer = 0.0
var hue = 0.0
var hueDir = 1

const resize = (() => {
    // Determine which screen dimension is most constrained
    let ratioW = window.innerWidth / GAME_WIDTH
    let ratioH = window.innerHeight / GAME_HEIGHT
    if (ratioH < ratioW) {
      scene.position.x = ((window.innerWidth - GAME_WIDTH) / 2.0) / ratioH
      scene.scale.x = scene.scale.y = ratioH 
      
    } else {
      scene.scale.x = scene.scale.y = ratioW
    }

   app.renderer.resize( window.innerWidth, window.innerHeight)
})

onMounted(async () => {
   PIXI.settings.RESOLUTION = window.devicePixelRatio || 1
   app = new PIXI.Application({
      autoDensity: true, // Handles high DPI screens
      antialias: true,
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

   resize()

   gfx = new PIXI.Graphics() 
   scene.addChild(gfx)

   // Update the shared group
   app.ticker.add(() => TWEEDLE.Group.shared.update())
   app.ticker.add( gameTick )

   initGame()

   startOverlay = new StartOverlay(gameTimeMS, startHandler) 
   scene.addChild(startOverlay)
   endOverlay = new EndOverlay(replayHandler, backHandler) 
})

onBeforeUnmount(() => {
   app.ticker.stop()
   
   scene.destroy({
      children: true,
      texture: true,
      baseTexture: true
   })
   
   app.stage.removeChildren()
   let gameEle = document.getElementById("game")
   gameEle.removeChild(app.view)
})

const initGame = ( () => {
   let style = {
      fill: "0x80D3E1",
      fontFamily: "Arial",
      fontSize: 18,
   }
   let timeLabel = new PIXI.Text("Time Remaining", style)
   timeLabel.x = 275
   timeLabel.y = 380
   timeLabel.anchor.set(0.5, 0.5)
   scene.addChild(timeLabel)
   timerDisplay = new PIXI.Text("05:00", style)
   timerDisplay.x = 275
   timerDisplay.y = 410
   timerDisplay.anchor.set(0.5, 0.5)
   scene.addChild(timerDisplay)

   let patternLabel = new PIXI.Text("Patterns Matched", style)
   patternLabel.x = 275
   patternLabel.y = 450
   patternLabel.anchor.set(0.5, 0.5)
   scene.addChild(patternLabel)
   matchDisplay = new PIXI.Text("0", style)
   matchDisplay.x = 275
   matchDisplay.y = 480
   matchDisplay.anchor.set(0.5, 0.5)
   scene.addChild(matchDisplay)

   resetButton = new ResetButton(190, 500, resetClicked)
   scene.addChild(resetButton)

   tileContainer = new PIXI.Container()
   tileContainer.x = 5 
   tileContainer.y = 5 
   scene.addChild(tileContainer)
   tileFilter = new PIXI.ColorMatrixFilter()
   tileContainer.filters = [tileFilter]
   initTiles()

   gfx.beginFill(0x34565c)
   gfx.drawRect(0,360,GAME_WIDTH, GAME_HEIGHT-360)
   gfx.endFill()
   gfx.lineStyle(2, 0x80D3E1,1 )
   gfx.moveTo(0,360)
   gfx.lineTo(GAME_WIDTH, 360)

   gfx.moveTo(185, 360)
   gfx.lineTo(185, GAME_HEIGHT)

   targetContainer = new PIXI.Container() 
   targetContainer.x =  5
   targetContainer.y = 365
   scene.addChild(targetContainer)
   targetFilter = new PIXI.ColorMatrixFilter()
   targetContainer.filters = [targetFilter]
   generateTargetPuzzle()
})

const initTiles = (()=> {
   tiles = Array(ROWS).fill().map(() => Array(COLS))
   let x = 0
   let y = 0
   let color = 0
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         let t = new Tile(color, x,y, r,c)
         tileContainer.addChild(t)
         tiles[r][c] = t
         x+= Tile.width
         if (color == 0) {
            color = 1
         } else {
            color = 0
         }
      }
      x = 0
      y += Tile.height
   }

   spinners = Array(ROWS-1).fill().map(() => Array(COLS-1))
   x = Tile.width
   y = Tile.height
   for (let r = 0; r < ROWS-1; r++) {
      for (let c = 0; c < COLS-1; c++) {
         let s = new Spinner(x,y, r,c, spinnerCallback)
         tileContainer.addChild(s)
         spinners[r][c] = s
         x+= Tile.width
      }
      y+= Tile.height
      x = Tile.width
   }
})

const resetClicked = (() => {
   initTiles()
})

const backHandler = (() =>{
   const message = {
      studio332: {
         from: 'mosaic',
         command: 'home'
      }
   }
   window.top.postMessage(message, "*")
})

const replayHandler = (() => {
   window.location.reload()
})

const startHandler = (() => {
   gameState = "play"
   scene.removeChild(startOverlay)
})

const generateTargetPuzzle = (() => {
   let colors = [
      0,0,0,0,0,0,0,0,0,0,0,0,0,
      1,1,1,1,1,1,1,1,1,1,1,1
   ]
   colors = shuffle(colors)
   let x = 0
   let y = 0
   let r = 0
   let c = 0
   targetTiles = Array(ROWS).fill().map(() => Array(COLS))
   colors.forEach( colorIndex => {
      let t = new Tile(colorIndex,x,y,r,x,true) // true makes the tile small 
      targetContainer.addChild(t)
      targetTiles[r][c] = t
      x += t.tileW 
      c++
      if (c == (COLS)) {
         c = 0
         x = 0
         r++
         y+= t.tileH
      }
   }) 
})


const shuffle = ((array) => {
  let currentIndex = array.length,  randomIndex

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]]
  }

  return array;
})

const checkMatch = (() => {
   let match = true
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         if (targetTiles[r][c].colorIndex != tiles[r][c].colorIndex) {
            match = false 
            break
         }
      }
      if ( match == false ) {
         break
      }
   }

   if ( match == true ) {
      console.log("MATCHED!!")
      matchCount++
      matchDisplay.text = `${matchCount}`
      matching = true 
      matchingTimer = 1000.0
      tileFilter.polaroid(true)
      // setTimeout( (()=> {generateTargetPuzzle()}), 3000 )
   }
})

const spinnerCallback = ( ( tgtTiles ) => {
   let tl = tiles[ tgtTiles[0].row ][ tgtTiles[0].col ]
   new TWEEDLE.Tween(tl).to({ x: tl.x+Tile.width}, 100).start()

   let tr = tiles[ tgtTiles[1].row ][ tgtTiles[1].col ]
   new TWEEDLE.Tween(tr).to({ y: tr.y+Tile.height}, 100).start()

   let br = tiles[ tgtTiles[2].row ][ tgtTiles[2].col ]
   new TWEEDLE.Tween(br).to({ x: br.x-Tile.width}, 100).start()

   let bl = tiles[ tgtTiles[3].row ][ tgtTiles[3].col ]
   new TWEEDLE.Tween(bl).to({ y: bl.y-Tile.height}, 100).start()

   setTimeout( () => {
      tiles[ tgtTiles[0].row ][ tgtTiles[0].col ] = bl
      tiles[ tgtTiles[1].row ][ tgtTiles[1].col ] = tl
      tiles[ tgtTiles[2].row ][ tgtTiles[2].col ] = tr
      tiles[ tgtTiles[3].row ][ tgtTiles[3].col ] = br
      checkMatch()
   }, 110)
})

const gameOver = (()=>{
   for (let r = 0; r < ROWS-1; r++) {
      for (let c = 0; c < COLS-1; c++) {
         tileContainer.removeChild(spinners[r][c] )
      }
   }
   scene.removeChild(resetButton)
   scene.addChild(endOverlay)
   gameState = "gameOver"
})

const gameTick = (() => {
   if (gameState != "play") return

   // get prior time and new time. necessary to check if a new second has gone by
   let origTimeSec = Math.round(gameTimeMS / 1000.0)
   gameTimeMS -= app.ticker.deltaMS
   let timeSec = Math.round(gameTimeMS / 1000.0)
   timeSec = Math.max(timeSec, 0)

   if (matching) {
      matchingTimer -= app.ticker.deltaMS
      hue += 5*hueDir
      if ( hue > 60 ) {
         hueDir = -1
      } else if (hue < 0) {
         hueDir = 1
      }
      targetFilter.hue(hue,false)
      if (matchingTimer <= 0 ) {
         matching = false
         targetFilter.reset()
         tileFilter.reset()
         generateTargetPuzzle()
      }
   }

   // Update the timer and display it
   if ( timeSec != origTimeSec) {
      let secs = timeSec
      let mins = Math.floor(timeSec / 60)
      if ( mins > 0) {
         secs = timeSec - mins*60
      }
      let timeStr = `${mins}`.padStart(2,"0")+":"+`${secs}`.padStart(2,"0")
      timerDisplay.text = timeStr
   }

   if (timeSec == 0) {
      gameOver() 
   }
})

</script>

<style scoped>
#game {
   margin: 0;
}
</style> 