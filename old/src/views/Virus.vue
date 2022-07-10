<template>
   <div class="content">
      <h2>Virus</h2>
      <div class="container"></div>
   </div>
</template>

<script>
// import Game from "@/games/virus/game";
import * as PIXI from "pixi.js";
export default {
   name: "virus",
   components: {},
   data() {
      return {
         game: null,
         app: null,
         container: null
      };
   },
   methods: {
      createScaledContainer(tgtWidth, tgtHeight) {
         this.app.stage.removeChildren();

         // This is the stage for the new scene
         this.container = new PIXI.Container();
         this.container.width = tgtWidth;
         this.container.height = tgtHeight;
         this.container.scale.x = this.app.screen.width / tgtWidth;
         this.container.scale.y = this.app.screen.height / tgtHeight;
         this.container.x = this.app.screen.width / 2 - this.app.screen.width / 2;
         this.container.y = this.app.screen.height / 2 - this.app.screen.height / 2;
         this.app.stage.addChild(this.container);
      },
   },
   mounted() {
      this.$nextTick(() => {
         // this.game = new Game("virus")
         let tgtW = 640 
         let tgtH = 480
         let gameEle = document.getElementById("app")
         PIXI.settings.RESOLUTION = window.devicePixelRatio || 1;
         this.app = new PIXI.Application({
            // resizeTo: window, // Auto fill the screen
            autoDensity: true, // Handles high DPI screens
            backgroundColor: 0xFFFFFF,
             width: tgtW, height: tgtH,
         });

         // The application will create a canvas element for you that you
         // can then insert into the DOM
        //  document.body.appendChild(this.app.view);
         gameEle.appendChild(this.app.view)
         this.createScaledContainer(tgtW, tgtH)

         // load the texture we need
         this.app.loader.add("bunny", "test.png").load((_loader, resources) => {
            const bunny = new PIXI.Sprite(resources.bunny.texture);
            bunny.x = 0;
            bunny.y = 0;
            this.container.addChild(bunny);
         });
      });
   },
};
</script>

<style scoped>
/* #virus {
   width: 640px;
   height: 480px;
   margin: 0 auto;
   position: relative;
}
canvas {
   height: 100%;
} */
</style>

