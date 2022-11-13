<template>
   <div class="content">
      <h2>Virus</h2>
   </div>
</template>

<script setup>
// import Game from "@/games/virus/game"
import * as PIXI from "pixi.js"
import { onMounted, onBeforeUnmount, ref, nextTick } from "vue"

const game = ref(null)
const app = ref(null)
const scene = ref(null)

function resizeHandler( logicalWidth, logicalHeight) {
  const scaleFactor = Math.min(
    window.innerWidth / logicalWidth,
    window.innerHeight / logicalHeight
  );
  const newWidth = Math.ceil(logicalWidth * scaleFactor);
  const newHeight = Math.ceil(logicalHeight * scaleFactor);
  
  app.value.renderer.view.style.width = `${newWidth}px`;
  app.value.renderer.view.style.height = `${newHeight}px`;

  app.value.renderer.resize(newWidth, newHeight);
  scene.value.scale.set(scaleFactor); 
}

onBeforeUnmount(() => {
   scene.value.destroy({
      children: true,
      texture: true,
      baseTexture: true}
   )
   app.value.stage.removeChildren()
   let gameEle = document.getElementById("app")
   gameEle.removeChild(app.value.view)
})

onMounted(() => {
      // game = new Game("virus")
   let tgtW = 480
   let tgtH = 480
   
   PIXI.settings.RESOLUTION = window.devicePixelRatio || 1
   app.value = new PIXI.Application({
      autoDensity: true, // Handles high DPI screens
      backgroundColor: 0x00FFFF,
      width: tgtW, 
      height: tgtH,
   })

   // The application will create a canvas element for you that you
   // can then insert into the DOM
   let gameEle = document.getElementById("app")
   gameEle.appendChild(app.value.view)
   scene.value = new PIXI.Container()
   app.value.stage.addChild(scene.value)
   resizeHandler(tgtW, tgtH)

   let zzz = PIXI.Sprite.from('test.png')
   scene.value.addChild(zzz)

   const graphics = new PIXI.Graphics()
   graphics.lineStyle(2, 0xFF0000, 1)
   graphics.drawRect(1, 1, 479, 479)
   scene.value.addChild(graphics)
})
</script>

<style scoped>
</style>

