import {Sprite, Container} from "pixi.js"
import * as TWEEDLE from "tweedle.js"

export default class TrashAnim extends Container {
   constructor(stage, texture, x,y ) {
      super()
      stage.addChild(this)
      this.group = new TWEEDLE.Group()
      for (let i=0; i<10; i++) {
         const smoke = new Sprite(texture)
         smoke.x = x+this.randomRange(-10, 10)
         smoke.y = y+this.randomRange(-10, 10)
         smoke.scale = 0.2
         smoke.anchor.set(0.5, 0.5)
         this.addChild(smoke)
         let angle = this.randomRange(-360, 360)
         let rangeX = this.randomRange(10, 50)
         let rangeY = this.randomRange(10, 50)
         let endX = this.randomRange(rangeX*-1, rangeX)
         let endY = this.randomRange(rangeY*-1, rangeY)
         const anim = new TWEEDLE.Tween(smoke).
            to({angle: angle, alpha: 0, scale: {x:0.9,y:0.9}, x: x+endX, y: y+endY}, 700).
            easing(TWEEDLE.Easing.Quadratic.Out).
            onComplete( () => {
               stage.removeChild(this)
            })
         this.group.add( anim )
      }
      this.group.getAll().forEach( a => a.start())
   }

   randomRange(min, max) {
      const a = Math.min(min, max)
      const b = Math.max(min, max)
      return (a + (b - a) * Math.random())
  }
}