<template>
   <div id="game">
   </div>
</template>

<script setup>
import * as PIXI from "pixi.js"
import axios from 'axios'
import { onMounted, onBeforeUnmount } from "vue"
import { useGamesStore } from '@/stores/games'
import Pool from "@/games/sweep/pool"
import Letter from "@/games/sweep/letter"
import StartOverlay from "@/games/sweep/startoverlay"
import Clock from "@/games/common/clock"
import Button from "@/games/common/button"

const GAME_WIDTH = 370
const GAME_HEIGHT = 540
const ROWS = 6
const COLS = 6
const API_SERVICE = import.meta.env.VITE_S332_SERVICE

const gameStore = useGamesStore()

var gameElement = null
var app = null
var scene = null
var gfx = null
var pool = new Pool()
var gameState = "init"
var grid = null
var clock = null
var word = null
var clearButton = null 
var submitButton = null
var startOverlay = null

const initPixiJS = (() => {
   gameStore.currentGame = "mosaic"
   PIXI.settings.RESOLUTION = window.devicePixelRatio || 1
   app = new PIXI.Application({
      autoDensity: true, // Handles high DPI screens
      antialias: true,
      backgroundColor: 0x023E8A,
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

   startOverlay = new StartOverlay(API_SERVICE, startHandler) 
   scene.addChild(startOverlay)
})

const startHandler = (() => {
   gameState = "play"
   scene.removeChild(startOverlay)
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
         let l = new Letter(pool.pop(), x,y, r,c, letterClicked)
         scene.addChild(l)
         grid[r][c] = l
         x += Letter.WIDTH
      }
      y += Letter.HEIGHT
      x = 5
   } 

   let wordStyle = new PIXI.TextStyle({
      fill: "#CAF0F8",
      fontFamily: "Arial",
      fontSize: 28,
      stroke: '#03045E',
      strokeThickness: 2,
   })
   word = new PIXI.Text("", wordStyle)
   word.anchor.set(0.5, 0)
   word.x = 185 
   word.y = 370
   scene.addChild(word)

   gfx.lineStyle(1, 0xCAF0F8, 1)
   gfx.moveTo(80, 405)
   gfx.lineTo(290,405)

   clearButton = new Button( 30, 425, "Clear Word", () => {
         word.text = ""
         for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
               grid[r][c].deselect()
            }
         }
         Letter.Active = true
      }, 0xCAF0F8,0x0077B6,0x48CAE4)
   scene.addChild(clearButton)
   
   submitButton = new Button( 190, 425, "Submit Word", submitWord, 0xCAF0F8,0x0077B6,0x48CAE4)
   scene.addChild(submitButton)

   clock = new Clock(185, 500, "Elapsed Time", 0xCAF0F8)
   scene.addChild(clock)
})

const submitWord = (() => {
   let testWord = word.text
   let url = `${API_SERVICE}/sweep/check?w=${testWord}`
   axios.post(url).then( () => {
      console.log("ACCEPTED")
   }).catch( _e => {
      console.log("FAILED")
   })
})

const letterClicked = ((r,c, letter) => {
   console.log(r+", "+c+": " +letter)
   if (word.text.length < 10) {
      word.text += letter
   }
   if (word.text.length == 10) {
      Letter.Active = false
   }
})

const gameTick = (() => {
   if (gameState != "play" ) return

   clock.tick(app.ticker.deltaMS)
})

</script>

<style scoped>
#game {
   margin: 0;
}
</style> 