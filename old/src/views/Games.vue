<template>
   <div>
      <div class="content">
         <h2>Games</h2>
         <p>
            Lately, Studio332 has been experimenting with browser-based games
            using
            <a href="https://phaser.io/" target="_blank">Phaser</a>. The first
            sample is a bit rough, but is up and working. Play it at the link
            below. More to come soon!
         </p>
         <template v-if="working == false" >
            <p v-for="g in games" :key="g.id">
               <b>{{g.name}}</b>: {{g.description}}
               <router-link :to="g.url"><span>Play Now!</span></router-link>
            </p>
         </template>
      </div>
   </div>
</template>

<script>
import { mapState } from "vuex"
export default {
   name: "games",
   components: {},
   computed: {
      ...mapState({
         working: (state) => state.working,
         games: (state) => state.games,
      }),
   },
   created() {
      this.$store.dispatch("getGames")
   },
};
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
   color: crimson;
   font-weight: bold;
   cursor: pointer;
   text-decoration: none;
}
a:hover {
   text-decoration: underline;
}
</style>

