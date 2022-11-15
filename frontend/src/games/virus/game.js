import * as PIXI from "pixi.js"
// import Letter from './letter'

export default class Game  {
   constructor(parentEle) {
      console.log(parentEle)
      this.pixiApp = new PIXI.Application({
         backgroundColor: 0x33334f,
         width: 640, height: 480,
         antialias: true,
         resolution: 1,
      })
      this.pixiApp.renderer.autoDensity = true
      this.pixiApp.renderer.backgroundColor = 0x061639;


      
      document.body.appendChild(this.pixiApp.view)
      // console.log("VW "+this.pixiApp.renderer.view.width)
      // console.log("R " + this.pixiApp.renderer.resolution)
      this.pixiApp.stage.width = this.pixiApp.renderer.view.width / window.devicePixelRatio


      // new Letter(this.pixiApp.stage, "X", 50, 50)
      // new Letter(this.pixiApp.stage, "Y", 50+85, 50)
      // new Letter(this.pixiApp.stage, "Z", 50+85*2, 50)
      // new Letter(this.pixiApp.stage, "A", 50+85 *3, 50)
      // new Letter(this.pixiApp.stage, "B", 50 + 85 *4, 50)
      // new Letter(this.pixiApp.stage, "C", 50 + 85 * 5, 50)

      // let stage = new PIXI.Stage(0xDDDDDD, true);
      // let renderer = new PIXI.CanvasRenderer(640, 480);
      // div.appendChild(renderer.view)
      // new Letter(stage, "X", 50, 50)
      // new Letter(stage, "Y", 50 + 85, 50)
      // new Letter(stage, "Z", 50 + 85 * 2, 50)
      // new Letter(stage, "A", 50 + 85 * 3, 50)
      // new Letter(stage, "B", 50 + 85 * 4, 50)
      // new Letter(stage, "C", 50 + 85 * 5, 50)
      
   }
}