import {Sprite, Container} from "pixi.js"
import * as TWEEDLE from "tweedle.js"

export default class SparkAnim extends Container {
   group = null
   particleCnt = 500

   constructor(stage, texture, x,y) {
      super()
      stage.addChild(this)

      this.group = new TWEEDLE.Group()
      for (let i=0; i<this.particleCnt; i++) {
         const spark = new Sprite(texture)
         spark.x = x+this.randomRange(-10, 10)
         spark.y = y+this.randomRange(-10, 10)
         spark.alpha = 0.7
         if (i % 2) {
            spark.tint = 0x00ffff
         } else {
            spark.tint = 0xffee00   
         }
         spark.anchor.set(0.5, 0.5)
         spark.scale = 0.25
         this.addChild(spark)
         let rangeX = this.randomRange(0,80)
         let endY = this.randomRange(-40, -180)
         let endX = this.randomRange(rangeX*-1, rangeX)
         const anim = new TWEEDLE.Tween(spark).
            to({ x: x+endX, y: y+endY, scale: {x:0, y: 0}}, 1500).
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
   }

   randomRange(min, max) {
      const a = Math.min(min, max)
      const b = Math.max(min, max)
      return (a + (b - a) * Math.random())
  }
}