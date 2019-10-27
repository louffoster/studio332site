<template>
  <div>
    <Studio332Header page="games"></Studio332Header>
    <div id="wordomino"></div>
  </div>
</template>

<script>
  import Phaser from 'phaser'
  import Wordomino from '@/games/wordomino/main'
  import Studio332Header from '@/components/Studio332Header.vue'

  export default {
    name: 'Wordomino',
    components: {
      Studio332Header
    },
    mounted: function() {
      var config = {
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.NO_CENTER
        },
        parent: 'wordomino',
        width: 490,
        height: 490,
        title: "Wordomino",
        backgroundColor: '000a12',
        scene: [Wordomino]
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
  margin-top: 0;
}
</style>

