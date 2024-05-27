import {Sprite, Container} from "pixi.js"
// import * as TWEEDLE from "tweedle.js"

export default class Boom extends Container {
   group = null
   particleCnt = 250 

   constructor(stage, texture, x,y ) {
      super()
      stage.addChild(this)

      this.group = new TWEEDLE.Group()
      for (let i=0; i<this.particleCnt; i++) {
         const spark = new Sprite(texture)
         spark.x = x+this.randomRange(-10, 10)
         spark.y = y+this.randomRange(-10, 10)
         spark.alpha = 1
         if (i % 2) {
            spark.tint = 0xffccff
         } else {
            spark.tint = 0xddaadd   
         }
         spark.anchor.set(0.5, 0.5)
         this.addChild(spark)
         let rangeX = this.randomRange(20, 70)
         let rangeY = this.randomRange(20, 70)
         let endX = this.randomRange(rangeX*-1, rangeX)
         let endY = this.randomRange(rangeY*-1, rangeY)
         let angle = this.randomRange(-360,360)
         const anim = new TWEEDLE.Tween(spark).
            to({ alpha: 0, angle: angle, x: x+endX, y: y+endY}, 1000).
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
   }

   randomRange(min, max) {
      const a = Math.min(min, max)
      const b = Math.max(min, max)
      return (a + (b - a) * Math.random())
  }

   start( listener) {
      this.group.getAll().forEach( a => a.start())
      setTimeout( ()=>listener(), 300)
   }
}