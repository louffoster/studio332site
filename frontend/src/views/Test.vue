<template>
   <div id="game">
   </div>
</template>

<script setup>
import * as PIXI from "pixi.js"
import { onMounted, onBeforeUnmount } from "vue"

var app = null
var scene = null 
var gfx = null
const GAME_WIDTH = 400
const GAME_HEIGHT = 600

const resize = (() => {
    // Determine which screen dimension is most constrained
    let ratio = window.innerWidth / GAME_WIDTH
    // scale the view appropriately to fill that dimension
    scene.scale.x = scene.scale.y = ratio
   //  # Update the renderer dimensions
   app.renderer.resize( window.innerWidth, window.innerHeight)
})

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
   // let gameEle = document.getElementById("game")
   // gameEle.appendChild(app.view)
   document.body.appendChild(app.view)

   scene = new PIXI.Container()
   app.stage.addChild(scene)

   gfx = new PIXI.Graphics() 
   scene.addChild(gfx)

   resize()

   gfx.lineStyle(1, 0x888899, 1)
   gfx.drawCircle(200,200,198)

})


onBeforeUnmount(() => {
   app.ticker.stop()
   app.stage.removeChildren()
   scene.destroy({
      children: true,
      texture: true,
      baseTexture: true
   })
   
   let gameEle = document.getElementById("game")
   gameEle.removeChild(app.view)
})
</script>

<style scoped>
#game {
   margin: 0;
}
</style>

