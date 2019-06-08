<template>
  <div>
   <Studio332Header page="games"/>
    <div class="content">
      <h2>Games</h2>
      <p>
        Lately, Studio332 has been experimenting with browser-based games using
        <a href="https://phaser.io/" target="_blank">Phaser</a>. The first sample is a bit rough, 
        but is up and working. Play it at the link below. More to some soon!
      </p>
      <p>
        <b>LatticeWords</b>: Shift rows and columns of letters to form words. Make several at 
        at time to score bonus points. Score as high as possible before time runs out.
        <router-link :to="{ name: 'latticewords'}"><span>Play Now!</span></router-link>
      </p>
      <p>
        <b>Squares</b>: 
        <router-link :to="{ name: 'squares'}"><span>Play Now!</span></router-link>
      </p>
    </div>
  </div>
</template>

<script>
  import Studio332Header from '@/components/Studio332Header.vue'
  export default {
    name: 'games',
    components: {
      Studio332Header
    }
  }
</script>

<style scoped>
div.content {
  text-align: left;
  width: 60%;
  margin: 0 auto;
  color: #444;
  font-size: 1.1em;
}
h2 {
  text-align: center;
  border-bottom: 1px solid crimson; 
  padding-bottom: 10px;
}
a {
  color:crimson;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>

