<template>
   <div class="content">
      <h2>Virus</h2>
      <div class="stage"></div>
   </div>
</template>

<script setup>
// import Game from "@/games/virus/game"
import * as PIXI from "pixi.js"
import { onMounted, onBeforeUnmount, ref, nextTick } from "vue"

const game = ref(null)
const app = ref(null)
const scene = ref(null)

function createScaledContainer(tgtWidth, tgtHeight) {
   app.value.stage.removeChildren()

   // This is the stage for the new scene
   scene.value = new PIXI.Container()
   scene.value.width = tgtWidth
   scene.value.height = tgtHeight
   scene.value.scale.x = app.value.screen.width / tgtWidth
   scene.value.scale.y = app.value.screen.height / tgtHeight
   scene.value.x = app.value.screen.width / 2 - app.value.screen.width / 2
   scene.value.y = app.value.screen.height / 2 - app.value.screen.height / 2
   app.value.stage.addChild(scene.value)
}

// function setup() {
//    testSprite.value = new PIXI.Sprite(
//     PIXI.Loader.shared.resources["test.png"].texture 
//     console.log("LOADED")
//   )
// }

onBeforeUnmount(() => {
   console.log("DESTROY!!")
   scene.value.destroy({
      children: true,
      texture: true,
      baseTexture: true}
   )
   let gameEle = document.getElementById("app")
   gameEle.removeChild(app.value.view)
})

onMounted(() => {
   // nextTick(() => {
      // game = new Game("virus")
      let tgtW = 640
      let tgtH = 480
      
      PIXI.settings.RESOLUTION = window.devicePixelRatio || 1
      app.value = new PIXI.Application({
         autoDensity: true, // Handles high DPI screens
         backgroundColor: 0x00FFFF,
         width: tgtW, height: tgtH,
      })

      // The application will create a canvas element for you that you
      // can then insert into the DOM
      let gameEle = document.getElementById("app")
      gameEle.appendChild(app.value.view)
      createScaledContainer(tgtW, tgtH)

      let zzz = PIXI.Sprite.from('test.png')
      scene.value.addChild(zzz)
      // PIXI.Loader.shared
      //    .add("test.png")
      //    .load(setup)
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

