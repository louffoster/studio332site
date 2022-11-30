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

   // setup blank word... to be filled with clicked letters from grid
   x = 15
   for ( let i=0; i<6; i++) {
      // draw the underline for the letter
      gfx.moveTo(x, 510)
      gfx.lineTo(x+25, 510)  

      let wordLetter = new PIXI.Text("", style)
      wordLetter.x = x+2
      wordLetter.y = 475
      scene.addChild(wordLetter)
      word.push( {letter: wordLetter, fromRow: -1, fromCol: -1})

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
   let clearAdjacent = newLetters.length > 3
   for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 5; c++) {
         if (grid[r][c].selected) {
            let replacement = newLetters.pop()
            grid[r][c].replace( replacement )   

            // stop infection on any adjecent tiles
           if (clearAdjacent) {
               if ( r > 0) {
                  grid[r-1][c].disinfect()
               }
               if ( r < 7) {
                  grid[r+1][c].disinfect()
               }
               if ( c > 0) {
                  grid[r][c-1].disinfect()
               }
               if ( c < 4) {
                  grid[r][c+1].disinfect()
               }
           }
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
   console.log(letter+" "+row+","+col)
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

function letterLost( letter, row, col ) {
   console.log("lost "+letter+" at "+row+","+col)
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

