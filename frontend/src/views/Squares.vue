<template>
  <div>
    <Studio332Header page="games"></Studio332Header>
    <div id="squaresgame"></div>
  </div>
</template>

<script>
  import Phaser from 'phaser'
  import Squares from '@/assets/squares/javascripts/squares'
  import Studio332Header from '@/components/Studio332Header.vue'

  export default {
    name: 'Squares',
    components: {
      Studio332Header
    },
    mounted: function() {
      var config = {
        type: Phaser.AUTO,
        parent: 'squaresgame',
        width: 600,
        height: 640,
        title: "Squares",
        scene: [Squares]
      };

      window.game = new Phaser.Game(config);
    },
    destroyed() {
      window.game.destroy(true)
    },
  }
</script>

<style scoped>
#squaresgame {
  margin-top: 5px;
}
</style>

