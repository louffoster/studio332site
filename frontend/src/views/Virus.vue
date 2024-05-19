<template>
   <div id="game">
   </div>
</template>

<script setup>

import { onMounted, onBeforeUnmount } from "vue"
import { useRouter } from 'vue-router'
import Virus from "@/games/virus/game"

const router = useRouter()

const GAME_WIDTH = 350
const GAME_HEIGHT = 570

var game = null 

onMounted(async () => {
   game = new Virus(GAME_WIDTH, GAME_HEIGHT, 0x44444a)
   game.initialize(restartHandler, backHandler)
})

onBeforeUnmount(() => {
   game.destroy()
})

const restartHandler = (() => {
   window.location.reload()
})

const backHandler = (() =>{
   router.push("/")
})
</script>

<style scoped>
#game {
   margin-top: 0;
}
</style>

