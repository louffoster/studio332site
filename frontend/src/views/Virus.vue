<template>
   <div id="game">
   </div>
</template>

<script setup>
import Letter from "@/games/virus/letter"
import * as PIXI from "pixi.js"
import { onMounted, onBeforeUnmount } from "vue"


var app = null
var scene = null
var letters = []

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

   let y = 40
   let x = 40   
   for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 5; c++) {
         let l = new Letter(scene, "A", x,y)
         letters.push(l)
         x += 55
         if (c == 3 && r == 5) {
            l.infected = true
         }
      }
      y += 55
      x = 40
   } 

   app.start()
   app.ticker.add((delta) => {
      letters.forEach( l=> l.update(delta))
   })
})
</script>

<style scoped>
#game {
   margin-top: 15px;
}
</style>

