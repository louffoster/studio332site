<template>
   <div id="game">
   </div>
</template>

<script setup>
import * as PIXI from "pixi.js"
import { onMounted, onBeforeUnmount } from "vue"
import { useGamesStore } from '@/stores/games'
import Pool from "@/games/sweep/pool"
import Letter from "@/games/sweep/letter"

const GAME_WIDTH = 370
const GAME_HEIGHT = 540
const ROWS = 6
const COLS = 6

const gameStore = useGamesStore()

var gameElement = null
var app = null
var scene = null
var gfx = null
var pool = new Pool()
var grid = null

const initPixiJS = (() => {
   gameStore.currentGame = "mosaic"
   PIXI.settings.RESOLUTION = window.devicePixelRatio || 1
   app = new PIXI.Application({
      autoDensity: true, // Handles high DPI screens
      antialias: true,
      backgroundColor: 0x44444a,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
   })

   if (window.innerWidth <= GAME_WIDTH || window.innerHeight <= GAME_HEIGHT   ) {
      gameStore.fullScreen = true
      gameElement = document.body
      gameElement.appendChild(app.view)
      scene = new PIXI.Container()
      app.stage.addChild(scene)
      resize()
   } else {
      gameStore.fullScreen = false
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
   gameElement.removeChild(app.view)
})

const initGame = (() => {
   pool.refill()
   grid = Array(ROWS).fill().map(() => Array(COLS))
   let x = 5 
   let y = 5
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         let l = new Letter(pool.pop(), x,y, r,c)
         scene.addChild(l)
         grid[r][c] = l
         x += Letter.WIDTH
      }
      y += Letter.HEIGHT
      x = 5
   } 
})

const gameTick = (() => {
})

</script>

<style scoped>
#game {
   margin: 0;
}
</style> 