<template>
   <div id="game">
   </div>
</template>

<script setup>
import * as PIXI from "pixi.js"
import { onMounted, onBeforeUnmount } from "vue"

const GAME_WIDTH = 430
const GAME_HEIGHT = 600

var app = null
var scene = null
var gfx = null

onMounted(async () => {
   PIXI.settings.RESOLUTION = window.devicePixelRatio || 1
   app = new PIXI.Application({
      autoDensity: true, // Handles high DPI screens
      backgroundColor: 0xf0f0f0,
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

</script>

<style scoped>
#game {
   margin-top: 15px;
}
</style>