<script setup>
import { RouterView } from 'vue-router'
import Studio332Header from '@/components/Studio332Header.vue'

</script>

<template>
   <Studio332Header />
   <RouterView />
</template>

<style>
html,
body {
   margin: 0;
   padding: 0;
   width: 100%;
   height: 100%;
   overflow: hidden;
   background-color: white;
}

#app {
   padding: 0;
   margin: 0;
   font-family: "Avenir", Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   text-align: center;
   color: #2c3e50;
   background-color: white;
}
</style>
