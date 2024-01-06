<template>
   <div id="game">
   </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue"
import PhysicsGame from "@/games/physics"
import { useRouter } from 'vue-router'

const GAME_WIDTH = 500
const GAME_HEIGHT = 800

var game = null

onMounted(async () => {
   game = new PhysicsGame(GAME_WIDTH, GAME_HEIGHT, 0x495867 )
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