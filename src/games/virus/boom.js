import {Sprite, Container} from "pixi.js"
// import * as TWEEDLE from "tweedle.js"

export default class Boom extends Container {
   group = null
   particleCnt = 750

   constructor(stage, texture, x,y, virus = true ) {
      super()
      stage.addChild(this)

      this.group = new TWEEDLE.Group()
      for (let i=0; i<this.particleCnt; i++) {
         const spark = new Sprite(texture)
         spark.x = x+this.randomRange(-10, 10)
         spark.y = y+this.randomRange(-10, 10)
         spark.alpha = 1
         if (virus ) {
            if (i % 2) {
               spark.tint = 0xffccff
            } else {
               spark.tint = 0xaa55aa   
            }
         } else {
            if (i % 2) {
               spark.tint = 0xccffff
            } else {
               spark.tint = 0x55aaaa   
            }
         }
         spark.anchor.set(0.5, 0.5)
         spark.scale = 0.4
         if ( virus == false)  spark.scale = 0.1
         this.addChild(spark)
         let rangeX = this.randomRange(40, 150)
         let rangeY = this.randomRange(40, 150)
         let endX = this.randomRange(rangeX*-1, rangeX)
         let endY = this.randomRange(rangeY*-1, rangeY)
         const anim = new TWEEDLE.Tween(spark).
            to({ alpha: 0, x: x+endX, y: y+endY, scale: {x:0.05, y: 0.05}}, 1000).
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