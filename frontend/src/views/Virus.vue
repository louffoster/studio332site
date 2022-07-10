<template>
   <div class="content">
      <h2>Virus</h2>
      <div class="container"></div>
   </div>
</template>

<script setup>
// import Game from "@/games/virus/game"
import * as PIXI from "pixi.js"
import { onMounted, onUnmounted, ref, nextTick } from "vue"

const game = ref(null)
const app = ref(null)
const container = ref(null)

function createScaledContainer(tgtWidth, tgtHeight) {
   app.value.stage.removeChildren()

   // This is the stage for the new scene
   container.value = new PIXI.Container()
   container.value.width = tgtWidth
   container.value.height = tgtHeight
   container.value.scale.x = app.value.screen.width / tgtWidth
   container.value.scale.y = app.value.screen.height / tgtHeight
   container.value.x = app.value.screen.width / 2 - app.value.screen.width / 2
   container.value.y = app.value.screen.height / 2 - app.value.screen.height / 2
   app.value.stage.addChild(container.value)
}

onMounted(() => {
   nextTick(() => {
      // game = new Game("virus")
      let tgtW = 640
      let tgtH = 480
      let gameEle = document.getElementById("app")
      PIXI.settings.RESOLUTION = window.devicePixelRatio || 1
      app.value = new PIXI.Application({
         // resizeTo: window, // Auto fill the screen
         autoDensity: true, // Handles high DPI screens
         backgroundColor: 0xFFFFFF,
         width: tgtW, height: tgtH,
      })

      // The application will create a canvas element for you that you
      // can then insert into the DOM
      //  document.body.appendChild(app.view)
      gameEle.appendChild(app.value.view)
      createScaledContainer(tgtW, tgtH)

      // load the texture we need
      app.value.loader.add("bunny", "test.png").load((_loader, resources) => {
         const bunny = new PIXI.Sprite(resources.bunny.texture)
         bunny.x = 0
         bunny.y = 0
         container.value.addChild(bunny)
      })
   })
})
</script>

<style scoped>
/* #virus {
   width: 640px
   height: 480px
   margin: 0 auto
   position: relative
}
canvas {
   height: 100%
} */
</style>

