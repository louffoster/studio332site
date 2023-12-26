<template>
   <div id="game">
   </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue"
import Physics from "@/games/physics"
import { useRouter } from 'vue-router'

const GAME_WIDTH = 400
const GAME_HEIGHT = 500

const router = useRouter()

var game = null

onMounted(async () => {
   game = new Physics(GAME_WIDTH, GAME_HEIGHT, 0x495867 )
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