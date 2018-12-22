<template>
  <div id="app">
    <router-view/>
    <Studio332Footer/>
  </div>
</template>

<script>
  import Studio332Footer from '@/components/Studio332Footer.vue'
  export default {
    components: {
      Studio332Footer
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
  }
</style>
