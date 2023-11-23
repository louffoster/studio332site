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
import Button from "@/games/common/button"
import Clock from "@/games/common/clock"

import { useRouter } from 'vue-router'

const GAME_WIDTH = 360
const GAME_HEIGHT = 540
const ROWS = 5
const COLS = 5

const router = useRouter()

var gameElement = null
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
var clock = null
var gameDurationMS = 300.0 * 1000.0
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
var advanced = false

const initPixiJS = (() => {
   PIXI.settings.RESOLUTION = window.devicePixelRatio || 1
   app = new PIXI.Application({
      autoDensity: true, // Handles high DPI screens
      antialias: true,
      backgroundColor: 0x44444a,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
   })

   if (window.innerWidth <= GAME_WIDTH || window.innerHeight <= GAME_HEIGHT   ) {
      gameElement = document.body
      gameElement.appendChild(app.view)
      scene = new PIXI.Container()
      app.stage.addChild(scene)
      resize()
   } else {
      gameElement = document.getElementById("game")
      gameElement.appendChild(app.view)
      scene = new PIXI.Container()
      app.stage.addChild(scene)
   }
})

const resize = (() => {
    // Determine which screen dimension is most constrained
    let ratioW = window.innerWidth / GAME_WIDTH
    let ratioH = window.innerHeight / GAME_HEIGHT
    if ( window.innerWidth <  GAME_WIDTH ) {
      scene.scale.x = scene.scale.y = ratioW 
    } else {
      if ( window.innerHeight <  GAME_HEIGHT ) {
         scene.scale.x = scene.scale.y = ratioH
      }
      scene.position.x = ((window.innerWidth - GAME_WIDTH) / 2.0) / ratioW
    }

   app.renderer.resize( window.innerWidth, window.innerHeight)
})

onMounted(async () => {
   initPixiJS()

   gfx = new PIXI.Graphics() 
   scene.addChild(gfx)

   // Update the shared group
   app.ticker.add(() => TWEEDLE.Group.shared.update())
   app.ticker.add( gameTick )

   initGame()

   startOverlay = new StartOverlay(gameDurationMS, startHandler) 
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
   gameElement.removeChild(app.view)
})

const initGame = ( () => {
   let style = {
      fill: "0x80D3E1",
      fontFamily: "Arial",
      fontSize: 18,
   }

   gfx.beginFill(0x44444a)
   gfx.lineStyle(1, 0x44444a, 1)
   gfx.drawRect(0,0,GAME_WIDTH, GAME_HEIGHT)
   gfx.endFill()

   clock = new Clock(270, 390, "Time Remaining\n")
   clock.setCountdownMode(gameDurationMS,  timeExpired, timerWarning)
   scene.addChild(clock)

   let patternLabel = new PIXI.Text("Patterns Matched", style)
   patternLabel.x = 270
   patternLabel.y = 435
   patternLabel.anchor.set(0.5, 0.5)
   scene.addChild(patternLabel)
   matchDisplay = new PIXI.Text("0", style)
   matchDisplay.x = 270
   matchDisplay.y = 460
   matchDisplay.anchor.set(0.5, 0.5)
   scene.addChild(matchDisplay)

   resetButton = new Button(203, 480, "Reset Tiles", resetClicked)
   resetButton.alignTopLeft()
   scene.addChild(resetButton)

   tileContainer = new PIXI.Container()
   tileContainer.x = 5 
   tileContainer.y = 5 
   scene.addChild(tileContainer)
   tileFilter = new PIXI.ColorMatrixFilter()
   tileContainer.filters = [tileFilter]
   initTiles()

   gfx.beginFill(0x34565c)
   gfx.drawRect(185,360,GAME_WIDTH-190, GAME_HEIGHT-360)
   gfx.endFill()

   targetContainer = new PIXI.Container() 
   targetContainer.x =  6
   targetContainer.y = 360
   scene.addChild(targetContainer)
   targetFilter = new PIXI.ColorMatrixFilter()
   targetContainer.filters = [targetFilter]
   generateTargetPuzzle()
})

const initTiles = (()=> {
   tiles = Array(ROWS).fill().map(() => Array(COLS))
   let x = 0
   let y = 0
   let color = 1
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         if ( advanced == 1) {
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
            tileContainer.addChild(t)
            tiles[r][c] = t
         } else {
            let t = new Tile(color, x,y, r,c)
            tileContainer.addChild(t)
            tiles[r][c] = t
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
   router.push("/")
})

const replayHandler = (() => {
   window.location.reload()
})

const startHandler = ((startMode) => {
   gameState = "play"
   advanced = false
   if (startMode == "advanced" ) {
      advanced = true
   }
   
   initTiles()
   generateTargetPuzzle()

   scene.removeChild(startOverlay)
})

const generateTargetPuzzle = (() => {
   let colors = null 
   if (advanced == 1 ) {
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
      matchCount++
      matchDisplay.text = `${matchCount}`
      matching = true 
      matchingTimer = 1000.0
      tileFilter.polaroid(true)
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

const timeExpired = (()=>{
   for (let r = 0; r < ROWS-1; r++) {
      for (let c = 0; c < COLS-1; c++) {
         tileContainer.removeChild(spinners[r][c] )
      }
   }
   scene.removeChild(resetButton)
   scene.addChild(endOverlay)
   gameState = "gameOver"
})

const timerWarning = ((flash) => {
   if ( flash ) {
      gfx.lineStyle(5, 0xcc2222, 1)
   } else {
      gfx.lineStyle(5, 0x44444a, 1)
   }
   gfx.drawRect(1,1,356,356)
})

const gameTick = (() => {
   if (gameState != "play") return

   clock.tick(app.ticker.deltaMS)

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
   // if ( timeSec != origTimeSec) {
   //    let secs = timeSec
   //    let mins = Math.floor(timeSec / 60)
   //    if ( mins > 0) {
   //       secs = timeSec - mins*60
   //    }

   //    // if (timeSec < 15) { 
   //    //    showTimerFlash()
   //    // }
      
   //    // let timeStr = `${mins}`.padStart(2,"0")+":"+`${secs}`.padStart(2,"0")
   //    // timerDisplay.text = timeStr
   // }
})

</script>

<style scoped>
#game {
   margin: 0;
}
</style> 