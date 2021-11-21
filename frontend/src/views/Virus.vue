<template>
   <div class="content">
      <h2>Virus</h2>
      <div class="container"></div>
   </div>
</template>

<script>
// import Game from "@/games/virus/game";
import * as PIXI from "pixi.js"
export default {
   name: "virus",
   components: {},
   data() {
      return { 
         game: null,
      }
   },
   mounted() {
      // this.game = new Game("virus")
   
      // The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application(600,800);

// The application will create a canvas element for you that you
// can then insert into the DOM
// document.body.appendChild(app.view);
document.querySelector('.container').appendChild(app.view);

// load the texture we need
app.loader.add('bunny', 'test.png').load((_loader, resources) => {
    // This creates a texture from a 'bunny.png' image
    const bunny = new PIXI.Sprite(resources.bunny.texture);

    // Setup the position of the bunny
    bunny.x = app.renderer.width / 2;
    bunny.y = app.renderer.height / 2;

    // Rotate around the center
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    // Add the bunny to the scene we are building
    app.stage.addChild(bunny);

    // Listen for frame updates
    app.ticker.add(() => {
         // each frame we spin the bunny around a bit
        bunny.rotation += 0.01;
    });
});
   },
}
</script>

<style scoped>
#virus {
   width: 640px;
   height: 480px;
   margin: 0 auto;
   position:relative;
}
.container {
    display: flex;
    justify-content: center;
    height: 100%;
}
canvas {
    height: 100%;
}
</style>

