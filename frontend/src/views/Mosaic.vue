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

const GAME_WIDTH = 360
const GAME_HEIGHT = 545
const ROWS = 5
const COLS = 5

var app = null
var scene = null
var gfx = null
var tiles = null
var targetTiles = null
var spinners = null
var gameTime = 0.0
var timerDisplay = null

// const actualWidth = (() => {
//    const { width, height } = app.screen;
//    const isWidthConstrained = width < height * 9 / 16;
//    return isWidthConstrained ? width : height * 9 / 16;
// })

// const actualHeight = (() => {
//    const { width, height } = app.screen;
//    const isHeightConstrained = width * 16 / 9 > height;
//    return isHeightConstrained ? height : width * 16 / 10;
// })

// const createScene =(() => {
//    scene = new PIXI.Container();
//    scene.width = GAME_WIDTH;
//    scene.height = GAME_HEIGHT;
//    scene.scale.x = actualWidth() / GAME_WIDTH;
//    scene.scale.y = actualHeight() / GAME_HEIGHT;
//    scene.x = app.screen.width / 2 - actualWidth() / 2;
//    scene.y = app.screen.height / 2 - actualHeight() / 2;
// })

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
   // createScene()
   app.stage.addChild(scene)

   gfx = new PIXI.Graphics() 
   scene.addChild(gfx)

   // Update the shared group
   app.ticker.add(() => TWEEDLE.Group.shared.update())
   app.ticker.add( gameTick )

   initGame()
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
   timerDisplay = new PIXI.Text("00:00", {
      fill: "0x80D3E1",
      fontFamily: "\"Courier New\", Courier, monospace",
      fontSize: 18,
   })
   // timerDisplay.anchor.set(0.5,0)
   timerDisplay.x = 240
   timerDisplay.y = 380
   scene.addChild(timerDisplay)

   tiles = Array(ROWS).fill().map(() => Array(COLS))
   let x = 5
   let y = 5
   let color = 0
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         let t = new Tile(color, x,y, r,c)
         scene.addChild(t)
         tiles[r][c] = t
         x+= Tile.width
         if (color == 0) {
            color = 1
         } else {
            color = 0
         }
      }
      x = 5
      y += Tile.height
   }

   spinners = Array(ROWS-1).fill().map(() => Array(COLS-1))
   x = 5+Tile.width
   y = 5+Tile.height
   for (let r = 0; r < ROWS-1; r++) {
      for (let c = 0; c < COLS-1; c++) {
         let s = new Spinner(x,y, r,c, spinnerCallback)
         scene.addChild(s)
         spinners[r][c] = s
         x+= Tile.width
      }
      y+= Tile.height
      x = 5+Tile.width
   }

   gfx.beginFill(0x34565c)
   gfx.drawRect(0,360,GAME_WIDTH, GAME_HEIGHT-360)
   gfx.endFill()
   gfx.lineStyle(2, 0x80D3E1,1 )
   gfx.moveTo(0,360)
   gfx.lineTo(GAME_WIDTH, 360)

   gfx.moveTo(185, 360)
   gfx.lineTo(185, GAME_HEIGHT)

   generateTargetPuzzle()
})

const generateTargetPuzzle = (() => {
   let colors = [
      0,0,0,0,0,0,0,0,0,0,0,0,0,
      1,1,1,1,1,1,1,1,1,1,1,1
   ]
   colors = shuffle(colors)
   let x = 5
   let y = 365
   let r = 0
   let c = 0
   targetTiles = Array(ROWS).fill().map(() => Array(COLS))
   colors.forEach( colorIndex => {
      let t = new Tile(colorIndex,x,y,r,x,true) // true makes the tile small 
      scene.addChild(t)
      targetTiles[r][c] = t
      x += t.tileW 
      c++
      if (c == (COLS)) {
         c = 0
         x = 5
         r++
         y+= t.tileH
      }
   }) 
   // gfx.lineStyle(5, 0x00ff00, 1)  
   // gfx.drawRect(0,365, 35*5+5, GAME_HEIGHT-365)
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
      setTimeout( (()=> {generateTargetPuzzle()}), 3000 )
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

const gameTick = (() => {
   // get prior time and new time. necessary to check if a new second has gone by
   let origTimeSec = Math.round(gameTime / 1000)
   gameTime += app.ticker.deltaMS
   let timeSec = Math.round(gameTime / 1000)

   // Update the timer and display it
   if ( timeSec > origTimeSec) {
      let secs = timeSec
      let mins = Math.floor(timeSec / 60)
      if ( mins > 0) {
         secs = timeSec - mins*60
      }
      let timeStr = `${mins}`.padStart(2,"0")+":"+`${secs}`.padStart(2,"0")
      timerDisplay.text = timeStr
   }
})

</script>

<style scoped>
#game {
   margin-top: 15px;
}
</style> 