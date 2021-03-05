<template>
  <div id="app">
    <Studio332Header/>
    <router-view/>
  </div>
</template>

<script>
  import Studio332Header from '@/components/Studio332Header.vue'
  export default {
    components: {
       Studio332Header
    }
  }
</script>

<style>
  body {
    padding:0;
    margin: 0;
  }
  #app {
    padding:0;
    margin: 0;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: white;
  }
</style>
