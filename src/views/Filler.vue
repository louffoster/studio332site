<template>
   <div id="game">
   </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue"
import Filler from "@/games/filler/game"
import { useRouter } from 'vue-router'

const GAME_WIDTH = 370
const GAME_HEIGHT = 580

const router = useRouter()

var game = null

onMounted(async () => {
   game = new Filler(GAME_WIDTH, GAME_HEIGHT, 0x006d77 )
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