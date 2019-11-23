<template>
  <div>
    <div id="wordomino"></div>
  </div>
</template>

<script>
  import Phaser from 'phaser'
  import Wordomino from '@/games/wordomino/main'

  export default {
    name: 'Wordomino',
    components: {
    },
    mounted: function() {
      var config = {
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.NO_CENTER
        },
        parent: 'wordomino',
        width: 490,
        height: 520,
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
</style>

