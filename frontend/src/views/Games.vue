<template>
  <div>
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
        <router-link to="/games/latticewords"><span>Play Now!</span></router-link>
      </p>
      <p>
        <b>Squares</b>: Prototype game with rotating clusters of squares. No gameplay, just an experiment.
        <router-link to="/games/squares"><span>View Now!</span></router-link>
      </p>
       <p>
        <b>Wordomino</b>: Prototype game combining word finding with a pentomino puzzle.
        <router-link to="/games/wordomino"><span>View Now!</span></router-link>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'games',
    components: {
    }
  }
</script>

<style scoped>
div.content {
  text-align: left;
  margin: 0 auto;
  color: #444;
  font-size: 1.1em;
}
@media only screen and (min-width: 768px) {
   div.content {
      width: 60%;
   }
}
@media only screen and (max-width: 768px) {
   div.content {
      width: 90%;
   }
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

