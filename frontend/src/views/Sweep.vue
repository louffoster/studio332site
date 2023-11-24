<template>
   <div id="game">
   </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue"
import Sweep from "@/games/sweep/game"
import { useRouter } from 'vue-router'

const GAME_WIDTH = 370
const GAME_HEIGHT = 560

const router = useRouter()

var game = null

onMounted(async () => {
   game = new Sweep(GAME_WIDTH, GAME_HEIGHT, 0x023E8A )
   game.initialize(replayHandler, backHandler)
})

const backHandler = (() =>{
   router.push("/")
})

const replayHandler = (() => {
   window.location.reload()
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