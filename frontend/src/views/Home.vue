<template>
  <div>
    <h1>Welcome</h1>
    <router-link :to="{ name: 'latticewords'}"><span>Play LatticeWords</span></router-link>
  </div>
</template>

<script>
  export default {
    name: 'home',
  }
</script>

<style scoped>
</style>

