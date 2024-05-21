<template>
   <div id="game">
   </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue"
import Sweep from "@/games/letterdrop/game"
import { useRouter } from 'vue-router'

const GAME_WIDTH = 380
const GAME_HEIGHT = 515

const router = useRouter()

var game = null


// https://coolors.co/palette/fcfafa-c8d3d5-a4b8c4-6e8387
onMounted(async () => {
   game = new Sweep(GAME_WIDTH, GAME_HEIGHT, 0x6E8387 )
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