import {Sprite, Container} from "pixi.js"
import * as TWEEDLE from "tweedle.js"

export default class Boom extends Container {
   particleCnt = 500

   constructor(stage, smokeImg, bitImg, x,y, listener ) {
      super()
      stage.addChild(this)
      this.group = new TWEEDLE.Group()
      for (let i=0; i<5; i++) {
         const smoke = new Sprite(smokeImg)
         smoke.x = x+this.randomRange(-5, 5)
         smoke.y = y+this.randomRange(-5, 5)
         smoke.scale = 0.1
         smoke.anchor.set(0.5, 0.5)
         this.addChild(smoke)
         let endX = this.randomRange(-30, 30)
         let endY = this.randomRange(-30, 30)
         const anim = new TWEEDLE.Tween(smoke).
            to({alpha: 0, scale: {x:0.7,y:0.7}, x: x+endX, y: y+endY}, 1000).
            easing(TWEEDLE.Easing.Quadratic.Out).
            onComplete( () => {
               stage.removeChild(this)
            })
         this.group.add( anim )
      }

      for (let i=0; i<this.particleCnt; i++) {
         const spark = new Sprite(bitImg)
         spark.x = x+this.randomRange(-10, 10)
         spark.y = y+this.randomRange(-10, 10)
         spark.scale = 0.15
         spark.alpha = 1
         if (i % 2) {
            spark.tint = 0xffcc33
         } else {
            spark.tint = 0xddaa00   
         }
         spark.anchor.set(0.5, 0.5)
         this.addChild(spark)
         let rangeX = this.randomRange(75, 200)
         let rangeY = this.randomRange(75, 200)
         let endX = this.randomRange(rangeX*-1, rangeX)
         let endY = this.randomRange(rangeY*-1, rangeY)
         const anim = new TWEEDLE.Tween(spark).
            to({ alpha: 0, x: x+endX, y: y+endY}, 1000).
            easing(TWEEDLE.Easing.Quadratic.Out).
            onComplete( () => {
               this.particleCnt-- 
               if ( this.particleCnt == 0) {
                  this.destroy( {
                     children: true
                  })
                  stage.removeChild(this)
               }
            })
         this.group.add( anim )
      }

      this.group.getAll().forEach( a => a.start())

      if (listener) {
         setTimeout( () => { listener() }, 500)
      }
   }

   randomRange(min, max) {
      const a = Math.min(min, max)
      const b = Math.max(min, max)
      return (a + (b - a) * Math.random())
  }
}