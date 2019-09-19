<template>
  <div>
    <Studio332Header page="games"></Studio332Header>
    <div id="wordpuzzle"></div>
  </div>
</template>

<script>
  import Phaser from 'phaser'
  import WordPuzzle from '@/games/wordpuzzle/main'
  import Studio332Header from '@/components/Studio332Header.vue'

  export default {
    name: 'WordPuzzle',
    components: {
      Studio332Header
    },
    mounted: function() {
      var config = {
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.NO_CENTER
        },
        parent: 'wordpuzzle',
        width: 490,
        height: 490,
        title: "WordPuzzle",
        backgroundColor: '000a12',
        scene: [WordPuzzle]
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

