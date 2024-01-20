<template>
   <div id="game">
   </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue"
import Charrom from "@/games/charrom/game.js"

const GAME_WIDTH = 600
const GAME_HEIGHT = 780

var game = null

onMounted(async () => {
   game = new Charrom(GAME_WIDTH, GAME_HEIGHT, 0x2A3D45 )
   game.initialize()
})

onBeforeUnmount(() => {
   game.destroy()
})
</script>

<style scoped>
#game {
   margin: 0;
}
</style> 