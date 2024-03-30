import {Sprite, Container} from "pixi.js"
import * as TWEEDLE from "tweedle.js"

export default class Confetti extends Container {
   group = null
   particleCnt = 2000

   constructor(stage, texture, maxW, listener ) {
      super()
      stage.addChild(this)

      this.group = new TWEEDLE.Group()
      for (let i=0; i<this.particleCnt; i++) {
         const flake = new Sprite(texture)
         flake.x = this.randomRange(0, maxW)
         flake.y = this.randomRange(-1200, 100)
         if ( i % 7 == 0) {
            flake.tint = 0xffdd44
         } else if (i % 2) {
            flake.tint = 0xff8888
         } else {
            flake.tint = 0x88ccff   
         }
         flake.scale = 0.4
         this.addChild(flake)
         let angle = this.randomRange(-360*3,360*3)
         let endX = this.randomRange(-500, 500)
         const anim = new TWEEDLE.Tween(flake).
            to({ alpha: 0, angle: angle, x: flake.x+endX, y: flake.y+750}, 3000).
            easing(TWEEDLE.Easing.Linear.None).
            onComplete( () => {
               this.particleCnt-- 
               if ( this.particleCnt == 0) {
                  this.destroy( {
                     children: true
                  })
                  stage.removeChild(this)
                  listener()
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