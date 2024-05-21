<template>
   <div id="game">
   </div>
</template>

<script setup>
import Mosaic from "@/games/mosaic/game"
import { onMounted, onBeforeUnmount } from "vue"

import { useRouter } from 'vue-router'

const GAME_WIDTH = 360
const GAME_HEIGHT = 540
const router = useRouter()

var game = null

onMounted(async () => {
   game = new Mosaic(GAME_WIDTH, GAME_HEIGHT, 0x44444a)
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