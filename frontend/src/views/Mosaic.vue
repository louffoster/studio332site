<template>
   <div id="game">
   </div>
</template>

<script setup>
// import * as PIXI from "pixi.js"
// import * as TWEEDLE from "tweedle.js"
import Mosaic from "@/games/mosaic/game"
import { onMounted, onBeforeUnmount } from "vue"
// import Tile from "@/games/mosaic/tile"
// import Spinner from "@/games/mosaic/spinner"
// import StartOverlay from "@/games/mosaic/startoverlay"
// import EndOverlay from "@/games/mosaic/endoverlay"
// import Button from "@/games/common/button"
// import Clock from "@/games/common/clock"

import { useRouter } from 'vue-router'

const GAME_WIDTH = 360
const GAME_HEIGHT = 540
const router = useRouter()

var game = null

onMounted(async () => {
   game = new Mosaic(GAME_WIDTH, GAME_HEIGHT)
   game.initialize(replayHandler, backHandler)
})

onBeforeUnmount(() => {
   game.destroy()
})

const backHandler = (() =>{
   router.push("/")
})

const replayHandler = (() => {
   window.location.reload()
})
</script>

<style scoped>
#game {
   margin: 0;
}
</style> 