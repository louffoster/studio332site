<template>
   <div class="header">
      <router-link @click="homeClicked" :to="{ name: 'home'}">
         <img class="s332" src="@/assets/s332logotype.png" />
      </router-link>
   </div>
</template>

<script setup>
import { useGamesStore } from '@/stores/games'

const gamesStore = useGamesStore()

const homeClicked = (() => {
   gamesStore.fullScreen = false
   gamesStore.currentGame = ""
})
</script>

<style scoped>
div.header {
   background-color: white;
   color: #666;
   padding: 2px 5px 0 5px;
   border-bottom: 1px solid #666;
   display: flex;
   flex-flow: row;
   align-items: flex-end;
   justify-content: space-between;
}
.menu {
   /* overflow: hidden;
    position: absolute;
    right: 0;
    bottom: 0; */
   list-style: none;
   font-weight: bold;
   margin: 0;
}
.menu li {
   float: left;
   text-align: center;
   margin: 10px 5px;
   cursor: pointer;
   color: #444;
   border-bottom: 1px solid white;
}
.menu .router-link-active li {
   border-bottom: 1px solid crimson;
}
.menu li a {
   color: #444;
}
.menu li:hover,
.menu li a:hover {
   opacity: 1;
}
a {
   color: #444;
   text-decoration: none;
}
img.s332 {
   display: inline-block;
   box-sizing: border-box;
   height: 65px;
}
</style>
