<template>
   <div id="game">
   </div>
</template>

<script setup>
import Letter from "@/games/virus/letter"
import EnterKey from "@/games/virus/enterkey"
import Pool from "@/games/virus/pool"
import * as PIXI from "pixi.js"
import { onMounted, onBeforeUnmount } from "vue"
import axios from 'axios'
const API_SERVICE = import.meta.env.VITE_S332_SERVICE


var app = null
var scene = null
var grid = null
var pool = new Pool()
var letterIndex = 0
var checkCountdown = 1000
var word = []
var gfx = null


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

onMounted(async () => {
   let tgtW = 300
   let tgtH = 600
   pool.refill()

   PIXI.settings.RESOLUTION = window.devicePixelRatio || 1
   app = new PIXI.Application({
      autoDensity: true, // Handles high DPI screens
      backgroundColor: 0x44444a,
      width: tgtW,
      height: tgtH,
   })

   let url = `${API_SERVICE}/start?game=virus`
   await axios.post(url)

   // The application will create a canvas element for you that you
   // can then insert into the DOM, then add the base scene container 
   // in this setup, all content added to the scene is auto scaled
   let gameEle = document.getElementById("game")
   gameEle.appendChild(app.view)
   scene = new PIXI.Container()
   app.stage.addChild(scene)
   gfx = new PIXI.Graphics() 
   scene.addChild(gfx)

   let y = 40
   let x = 40   
   grid = Array(8).fill().map(() => Array(5))
   for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 5; c++) {
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
      x = 40
   } 

   let style = new PIXI.TextStyle({
      fill: "#cccccc",
      fontFamily: "\"Courier New\", Courier, monospace",
      fontSize: 32,
   })

   gfx.lineStyle(1, 0xcccccc, 1)
   gfx.moveTo(0, 465)
   gfx.lineTo(300, 465)
   gfx.moveTo(0, 520)
   gfx.lineTo(300, 520)
   x = 15
   for ( let i=0; i<6; i++) {
      gfx.moveTo(x, 510)
      gfx.lineTo(x+25, 510)  

      let wordLetter = new PIXI.Text("", style)
      wordLetter.x = x+2
      wordLetter.y = 475
      scene.addChild(wordLetter)
      word.push(wordLetter)

      x+=30
   }

   let enterKey = new EnterKey(215,475, enterWord)
   scene.addChild(enterKey)

   app.start()
   app.ticker.add((delta) => {
      checkCountdown -= app.ticker.deltaMS 
      if (checkCountdown <= 0 ) {
         checkInfectedCount()
      }
      for (let r = 0; r < 8; r++) {
         for (let c = 0; c < 5; c++) {
            grid[r][c].update(delta, letterLost)
         }
      }
   })
})

function checkInfectedCount() {
   checkCountdown = 1000.0
   let cnt = 0
   for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 5; c++) {
         if (grid[r][c].infected && grid[r][c].virusPercent < 100) {
            cnt++
         }
      }
   }
   if ( cnt < 3) {
      for (let r = 0; r < 8; r++) {
         for (let c = 0; c < 5; c++) {
            if (grid[r][c].infected == false) {
               cnt++
               grid[r][c].infect()
            }
            if (cnt >= 3) break
         }
         if (cnt >= 3) break
      }
   }
}

async function enterWord() {
   if ( letterIndex < 3) return
   let testWord = ""
   word.forEach( l => testWord += l.text)
   let url = `${API_SERVICE}/virus/check?w=${testWord}`
   await axios.post(url).then( () => {
      replaceAll( )
   }).catch( e => {
      deselectAll()
   })
}

function replaceAll() {
   let newLetters = drawNewLetters(letterIndex)
   console.log("success. new letters: "+newLetters)
   for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 5; c++) {
         if (grid[r][c].selected) {
            let replacement = newLetters.pop()
            console.log("replace "+r+","+c+" with "+replacement)
            grid[r][c].replace( replacement )   
         }
      }
   }
   word.forEach( wl  => wl.text = "")
   letterIndex = 0
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

function deselectAll() {
   for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 5; c++) {
         grid[r][c].deselect()
      }
   }
   word.forEach( wl  => wl.text = "")
   letterIndex = 0
}

function letterClicked( selected, letter) {
   Letter.wordFull = false
   if (selected) {
      word[letterIndex].text = letter
      letterIndex++ 
      if (letterIndex == 6) {
         Letter.wordFull = true
      }
   } else {
      deselectLetter( letter )
   }
}

function deselectLetter( letter ) {
   let delIdx = -1 
   word.forEach( (wl,idx) => {
      if (wl.text == letter) {
         delIdx = idx
      }
   })
   if (delIdx > -1) {
      if (delIdx == 5) {
         word[delIdx].text = ""
      } else {
         for (let idx = delIdx; idx <= 4; idx++) {
            word[idx].text = word[idx+1].text
         }
         word[5].text = ""
      }
      letterIndex--
   }
}

function letterLost( letter, row, col ) {
   deselectLetter( letter )
   if ( row > 0) {
      grid[row-1][col].infect()
   }
   if ( row < 7) {
      grid[row+1][col].infect()
   }
   if ( col > 0) {
      grid[row][col-1].infect()
   }
   if ( col < 4) {
      grid[row][col+1].infect()
   }
}
</script>

<style scoped>
#game {
   margin-top: 15px;
}
</style>

