<template>
   <div id="game">
   </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue"
import WordMine from "@/games/wordmine/game"
import { useRouter } from 'vue-router'

const GAME_WIDTH = 435
const GAME_HEIGHT = 650

const router = useRouter()

var game = null


// https://coolors.co/palette/fcfafa-c8d3d5-a4b8c4-6e8387
onMounted(async () => {
   game = new WordMine(GAME_WIDTH, GAME_HEIGHT, 0xA68A64 )
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