<template>
   <div id="game">
   </div>
</template>

<script setup>
import * as PIXI from "pixi.js"
import axios from 'axios'
import { onMounted, onBeforeUnmount } from "vue"
import { useGamesStore } from '@/stores/games'
import LetterPool from "@/games/common/letterpool"
import Letter from "@/games/sweep/letter"
import StartOverlay from "@/games/sweep/startoverlay"
import PickOverlay from "@/games/sweep/pickoverlay"
import EndOverlay from "@/games/sweep/endoverlay"
import Clock from "@/games/common/clock"
import Button from "@/games/common/button"
import { useRouter } from 'vue-router'

import * as particles from '@pixi/particle-emitter'
import stars from '@/assets/stars.json'
import bad from '@/assets/bad_word.json'

const GAME_WIDTH = 370
const GAME_HEIGHT = 560
const ROWS = 6
const COLS = 6
const API_SERVICE = import.meta.env.VITE_S332_SERVICE

const gameStore = useGamesStore()
const router = useRouter()

var gameElement = null
var app = null
var scene = null
var gfx = null
var pool = new LetterPool()
var gameState = "init"
var grid = null
var clock = null
var word = null
var helpers = []
var giveUpButton = null
var clearButton = null 
var submitButton = null
var startOverlay = null
let pickOverlay = null
let endOverlay = null
var explode = null
var badWord = null

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

   explode = particles.upgradeConfig(stars, ['snow.png'])
   badWord = particles.upgradeConfig(bad, ['spark.png'])

   gfx = new PIXI.Graphics() 
   scene.addChild(gfx)

   app.ticker.add( gameTick )

   initGame()

   startOverlay = new StartOverlay(API_SERVICE, startHandler) 
   scene.addChild(startOverlay)
   pickOverlay = new PickOverlay( helperHandler )
   endOverlay = new EndOverlay(replayHandler, backHandler)
})

const helperHandler = (( pickedLetters ) => {
   pickedLetters.forEach( (l,idx) => {
      helpers[idx].set( l )
   })
   gameState = "play"
   scene.removeChild(pickOverlay)
   enableGrid( true )
})

const startHandler = (() => {
   gameState = "pick"
   scene.removeChild(startOverlay)
   scene.addChild(pickOverlay)
})

const backHandler = (() =>{
   router.push("/")
})

const replayHandler = (() => {
   window.location.reload()
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
         let l = new Letter(pool.pop(), x,y, letterClicked)
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
      lineHeight: 28,
   })
   word = new PIXI.Text("", wordStyle)
   word.anchor.set(0.5, 1)
   word.x = 185 
   word.y = 410
   scene.addChild(word)

   giveUpButton = new Button( 20, 425, "Give Up", giveUpClicked, 0xCAF0F8,0x0077B6,0x48CAE4)
   giveUpButton.alignTopLeft()
   scene.addChild(giveUpButton)

   clearButton = new Button( 145, 425, "Clear", () => {
         clearSelections()
      }, 0xCAF0F8,0x0077B6,0x48CAE4)
   clearButton.alignTopLeft()
   scene.addChild(clearButton)
   
   submitButton = new Button( 247, 425, "Submit", submitWord, 0xCAF0F8,0x0077B6,0x48CAE4)
   submitButton.disable()
   submitButton.alignTopLeft()
   scene.addChild(submitButton)

   gfx.beginFill(0x48CAE4)
   gfx.lineStyle(1, 0xCAF0F8)
   gfx.drawRect(4, 488, Letter.WIDTH*3+8, Letter.HEIGHT+8)
   gfx.endFill()

   let helpX = 8
   for ( let i=0; i<3; i++ ) {
      let h = new Letter("?", helpX,492, letterClicked)
      helpers.push( h )
      helpX += Letter.WIDTH
      scene.addChild(h)
   }

   clock = new Clock(280, 515, "", 0xCAF0F8)
   scene.addChild(clock)
   enableGrid( false )
})

const clearSelections = (() => {
   word.text = ""
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         grid[r][c].deselect()
      }
   }
   helpers.forEach( t => t.deselect())
   enableGrid( true )
   submitButton.disable()
})

const giveUpClicked = (() => {
  gameState = "over"
  endOverlay.setLoss( countRemainingLetters() )
  scene.addChild( endOverlay )
  enableGrid(false) 
  submitButton.disable()
  clearButton.disable()
  giveUpButton.disable()
})

const submitWord = (() => {
   let testWord = word.text
   let url = `${API_SERVICE}/sweep/check?w=${testWord}`
   axios.post(url).then( () => {
      explodeTiles()
      checkForWin()
      word.text = ""
   }).catch( _e => {
      submitFailed()
   })
})

const countRemainingLetters = (() => {
   let cnt = 0
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         if (grid[r][c].cleared == false ) {
            cnt++
         }
      }
   }
   return cnt
})

const checkForWin = (()=>{
   let cnt = countRemainingLetters()
   if ( cnt == 0) {
      gameState = "over"
      endOverlay.setWin(clock.gameTimeFormatted())
      scene.addChild(endOverlay)
   }
})

const submitFailed = (() => {
   let origColor = word.style.fill
   word.style.fill = 0xFF4500
   setTimeout( () => {
      let centerX = GAME_WIDTH / 2.0
      let wordW = word.width 
      let coords = [centerX-wordW/2.0, centerX, centerX+wordW/2.0]
      for (let i = 0; i<3; i++) {
         var emitter = new particles.Emitter(scene, badWord )
         emitter.updateSpawnPos(coords[i], word.y - 10)
         emitter.playOnceAndDestroy()   
      }
      setTimeout( () => {
            clearSelections()
            word.style.fill = origColor
         }, 100)
   }, 500)
})

const explodeTiles = (() => {
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         if ( grid[r][c].selected) {
            var tile = grid[r][c]
            var emitter = new particles.Emitter(scene, explode )
            emitter.updateSpawnPos(tile.x+Letter.WIDTH/2.0, tile.y+Letter.HEIGHT/2.0)
            emitter.playOnceAndDestroy()
            tile.clear()
         }
      }
   }
   helpers.forEach( tile => {
      if (tile.selected ) {
         var emitter = new particles.Emitter(scene, explode )
         emitter.updateSpawnPos(tile.x+Letter.WIDTH/2.0, tile.y+Letter.HEIGHT/2.0)
         emitter.playOnceAndDestroy()
         tile.clear()
      }
   })
})

const enableGrid = ((enabled) => {
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         if ( enabled ) {
            grid[r][c].enable() 
         } else {("d")
            grid[r][c].disable()   
         }
      }
   }
})

const letterClicked = ((letter) => {
   if (word.text.length < 10) {
      word.text += letter.text
   }
   if (word.text.length == 10) {
      enableGrid(false)
   }
   if (word.text.length > 3 ) {
      submitButton.enable()
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