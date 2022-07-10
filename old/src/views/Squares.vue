<template>
  <div>
    <div id="squaresgame"></div>
  </div>
</template>

<script>
  import Phaser from 'phaser'
  import Squares from '@/games/squares/main'

  export default {
    name: 'Squares',
    components: {
    },
    mounted: function() {
      var config = {
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.NO_CENTER
        },
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
  margin-top: 0;
}
</style>

