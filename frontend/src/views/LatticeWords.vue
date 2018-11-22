<template>
  <div id="lwgame"></div>
</template>

<script>
  import Phaser from 'phaser'
  import Menu from '@/assets/latticewords/javascripts/main_menu'
  import Latticewords from '@/assets/latticewords/javascripts/latticewords'
  export default {
    name: 'LatticeWords',
    mounted: function() {
      var config = {
        type: Phaser.AUTO,
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
  margin-top: 5px;
}
</style>

