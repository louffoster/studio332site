<template>
   <div class="header">
      <router-link :to="{ name: 'home'}"><span><img class="s332" src="../assets/s332logotype.png"/></span></router-link>
   </div>
</template>

<script>
export default {
}
</script>

<style scoped>
  div.header {
     background-color: white;
     color: #666;
     padding:15px;
     border-bottom: 3px solid red;
     text-align: left;
  }
  a {
    color: white;
    text-decoration: none;
  }
  div.header img.s332 {
    position: relative;
  }
</style>
