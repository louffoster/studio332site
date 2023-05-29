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

const GAME_WIDTH = 430
const GAME_HEIGHT = 600
const ROWS = 6
const COLS = 6

var app = null
var scene = null
var gfx = null
var tiles = null
var spinners = null

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

   gfx = new PIXI.Graphics() 
   scene.addChild(gfx)

   // Update the shared group
   app.ticker.add(() => TWEEDLE.Group.shared.update())

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
   tiles = Array(ROWS).fill().map(() => Array(COLS))
   let x = 5
   let y = 5
   let color = 0
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         let t = new Tile(color, x,y, r,c)
         scene.addChild(t)
         tiles[r][c] = t
         x+= 70
         if (color == 0) {
            color = 1
         } else {
            color = 0
         }
      }
      x = 5
      y+=70
      if (color == 0) {
         color = 1
      } else {
         color = 0
      }
   }

   spinners = Array(ROWS-1).fill().map(() => Array(COLS-1))
   x = 75
   y = 75
   for (let r = 0; r < ROWS-1; r++) {
      for (let c = 0; c < COLS-1; c++) {
         let s = new Spinner(x,y, r,c, spinnerCallback)
         scene.addChild(s)
         spinners[r][c] = s
         x+= 70
      }
      y+= 70
      x = 75
   }
})

const spinnerCallback = ( ( tgtTiles ) => {
   let tl = tiles[ tgtTiles[0].row ][ tgtTiles[0].col ]
   new TWEEDLE.Tween(tl).to({ x: tl.x+70}, 100).start()

   let tr = tiles[ tgtTiles[1].row ][ tgtTiles[1].col ]
   new TWEEDLE.Tween(tr).to({ y: tr.y+70}, 100).start()

   let br = tiles[ tgtTiles[2].row ][ tgtTiles[2].col ]
   new TWEEDLE.Tween(br).to({ x: br.x-70}, 100).start()

   let bl = tiles[ tgtTiles[3].row ][ tgtTiles[3].col ]
   new TWEEDLE.Tween(bl).to({ y: bl.y-70}, 100).start()

   setTimeout( () => {
      tiles[ tgtTiles[0].row ][ tgtTiles[0].col ] = bl
      tiles[ tgtTiles[1].row ][ tgtTiles[1].col ] = tl
      tiles[ tgtTiles[2].row ][ tgtTiles[2].col ] = tr
      tiles[ tgtTiles[3].row ][ tgtTiles[3].col ] = br
   }, 110)
})

</script>

<style scoped>
#game {
   margin-top: 15px;
}
</style> 