<template>
  <div>
    <div id="lwgame"></div>
  </div>
</template>

<script>
  import Phaser from 'phaser'
  import Menu from '@/games/latticewords/main_menu'
  import Latticewords from '@/games/latticewords/main'

  export default {
    name: 'LatticeWords',
    components: {
    },
    mounted: function() {
      var config = {
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.NO_CENTER
        },
        parent: 'lwgame',
        width: 600,
        height: 640,
        backgroundColor: '3F51B5',
        title: "LatticeWords",
        scene: [Menu,Latticewords]
      };

      window.game = new Phaser.Game(config);
    },
    destroyed() {
      window.game.destroy(true)
    },
  }
</script>

<style scoped>
#lwgame {
  margin:0;
}
</style>

