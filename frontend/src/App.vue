<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <Studio332Header/>
    <router-view/>
    <Studio332Footer/>
  </div>
</template>

<script>
  import Studio332Header from '@/components/Studio332Header.vue'
  import Studio332Footer from '@/components/Studio332Footer.vue'
  export default {
    components: {
      Studio332Header,
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
