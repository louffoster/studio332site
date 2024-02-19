import BasePhysicsGame from "@/games/common/basephysicsgame"
import Rock from "@/games/wordmine/rock"
import LetterPool from "@/games/common/letterpool"
import Matter from 'matter-js'
import * as particles from '@pixi/particle-emitter'
import explodeJson from '@/assets/trash.json'

export default class WordMine extends BasePhysicsGame {
   pool = new LetterPool()
   explodeAnim = null
   clickMode = "pick" // modes: pick, push, bomb

   initialize(replayHandler, backHandler) {
      this.explodeAnim = particles.upgradeConfig(explodeJson, ['smoke.png'])

      // set bottom aand sides
      let b = Matter.Bodies.rectangle(this.gameWidth/2, this.gameHeight+25, this.gameWidth, 50, { isStatic: true, friction: 0, restitution: 0})
      Matter.Composite.add(this.physics.world, b)
      let l = Matter.Bodies.rectangle(-25, this.gameHeight/2, 50, this.gameHeight, { isStatic: true, friction: 0, restitution: 0})
      Matter.Composite.add(this.physics.world, l)
      let r = Matter.Bodies.rectangle(this.gameWidth+25, this.gameHeight/2, 50, this.gameHeight, { isStatic: true, friction: 0, restitution: 0})
      Matter.Composite.add(this.physics.world, r)

      // fill in rocks
      this.pool.refill()
      let y = this.gameHeight - Rock.HEIGHT/2
      let x = Rock.WIDTH/2
      for ( let c=0; c< 6; c++) {
         for ( let r=0; r< 10; r++) {
            let ltr = this.pool.popScoringLetter()
            let rock = new Rock( x,y, ltr, this.rockClicked.bind(this) )
            this.addPhysicsItem( rock )
            y -= Rock.HEIGHT
         }
         y = this.gameHeight - Rock.HEIGHT/2
         x+= Rock.WIDTH
      }

      this.draw()
   }

   rockClicked( rock ) {
      var emitter = new particles.Emitter(this.scene, this.explodeAnim )
      emitter.updateOwnerPos(0,0)
      emitter.updateSpawnPos(rock.x, rock.y)
      emitter.playOnceAndDestroy( () => {
         console.log("remove "+rock.tag)
      }) 
      this.removePhysicsItem( rock )
   }

   draw() {
      this.gfx.clear() 
      this.gfx.beginFill(0x86BBD8)
      this.gfx.lineStyle(1, 0x86BBD8, 1)
      this.gfx.drawRect(0,0, this.gameWidth, 105)
      this.gfx.beginFill(0x73a942)

      this.gfx.lineStyle(3, 0x656D4A, 1)
      this.gfx.drawRect(0,105, this.gameWidth, 20)

      this.gfx.beginFill(0xA68A64)
      this.gfx.lineStyle(2, 0x582F0E, 1)
      this.gfx.drawRect(330,125, this.gameWidth-330, this.gameHeight-125)

      this.gfx.endFill()
   }

   update() {
      super.update()
   }
}