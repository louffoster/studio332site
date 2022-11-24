<template>
   <div id="game">
   </div>
</template>

<script setup>
import Letter from "@/games/virus/letter"
import Pool from "@/games/virus/pool"
import * as PIXI from "pixi.js"
import { onMounted, onBeforeUnmount } from "vue"


var app = null
var scene = null
var grid = null
var pool = new Pool()
var letterIndex = 0
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

onMounted(() => {
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
         let l = new Letter(scene, pool.pop(), x,y, r,c)
         l.setClickCallback(letterClicked)
         grid[r][c] = l
         x += 55
         if (r == 0 && c > 0 && c < 4) {
            l.infected = true
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

   app.start()
   app.ticker.add((delta) => {
      for (let r = 0; r < 8; r++) {
         for (let c = 0; c < 5; c++) {
            grid[r][c].update(delta, letterLost)
         }
      }
   })
})

function letterClicked( selected, letter) {
   Letter.wordFull = false
   if (selected) {
      word[letterIndex].text = letter
      letterIndex++ 
      if (letterIndex == 6) {
         Letter.wordFull = true
      }
   } else {
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
}

function letterLost( row, col ) {
   if ( grid[row][col].selected) {
      letterClicked(false, grid[row][col].text())
   }
   if ( row > 0) {
      grid[row-1][col].infected = true
   }
   if ( row < 7) {
      grid[row+1][col].infected = true
   }
   if ( col > 0) {
      grid[row][col-1].infected = true
   }
   if ( col < 4) {
      grid[row][col+1].infected = true
   }
}
</script>

<style scoped>
#game {
   margin-top: 15px;
}
</style>

