import * as PIXI from "pixi.js"
import BasePhysicsGame from "@/games/common/basephysicsgame"
import Rock from "@/games/wordmine/rock"
import ToggleButton from "@/games/wordmine/togglebutton"
import LetterPool from "@/games/common/letterpool"
import Matter from 'matter-js'
import * as particles from '@pixi/particle-emitter'
import explodeJson from '@/assets/trash.json'

export default class WordMine extends BasePhysicsGame {
   pool = new LetterPool()
   explodeAnim = null
   toggleButtons = []
   clickMode = "pick" // modes: pick, push, bomb

   initialize(replayHandler, backHandler) {
      this.explodeAnim = particles.upgradeConfig(explodeJson, ['smoke.png'])

      // set bottom aand sides
      let b = Matter.Bodies.rectangle(this.gameWidth/2, this.gameHeight+25, this.gameWidth, 50, { isStatic: true, friction: 0, restitution: 0})
      Matter.Composite.add(this.physics.world, b)
      let l = Matter.Bodies.rectangle(-25, this.gameHeight/2, 50, this.gameHeight, { isStatic: true, friction: 0, restitution: 0})
      Matter.Composite.add(this.physics.world, l)
      let r = Matter.Bodies.rectangle((Rock.WIDTH*6)+25, this.gameHeight/2, 50, this.gameHeight, { isStatic: true, friction: 0, restitution: 0})
      Matter.Composite.add(this.physics.world, r)

      // fill in rocks
      this.pool.refill()
      let y = this.gameHeight - Rock.HEIGHT/2
      let x = Rock.WIDTH/2
      for ( let c=0; c< 6; c++) {
         for ( let r=0; r< 10; r++) {
            let ltr = this.pool.popScoringLetter()
            let rock = new Rock( x,y, ltr, this.rockTouhed.bind(this) )
            this.addPhysicsItem( rock )
            y -= Rock.HEIGHT
         }
         y = this.gameHeight - Rock.HEIGHT/2
         x+= Rock.WIDTH
      }

      let btnsY = 135
      let pick = PIXI.Sprite.from('/images/wordmine/pick.png')
      let pickButton = new ToggleButton(this.gameWidth-ToggleButton.WIDTH-10, btnsY, "pick", pick )
      pickButton.setSelected(true)
      pickButton.setListener( this.toggleButtonClicked.bind(this) )
      this.toggleButtons.push( pickButton )
      this.addChild(pickButton)
      btnsY += ToggleButton.HEIGHT + 10
      let bomb = PIXI.Sprite.from('/images/wordmine/bomb.png')
      let bombButton = new ToggleButton(this.gameWidth-ToggleButton.WIDTH-10, btnsY, "bomb", bomb )
      bombButton.setListener( this.toggleButtonClicked.bind(this) )
      this.toggleButtons.push( bombButton )
      this.addChild(bombButton)
      btnsY += ToggleButton.HEIGHT + 10
      let left = PIXI.Sprite.from('/images/wordmine/left.png')
      let pushLeft = new ToggleButton(this.gameWidth-ToggleButton.WIDTH-10, btnsY, "left", left )
      pushLeft.setListener( this.toggleButtonClicked.bind(this) )
      this.toggleButtons.push( pushLeft )
      this.addChild(pushLeft)
      btnsY += ToggleButton.HEIGHT + 10
      let right = PIXI.Sprite.from('/images/wordmine/right.png')
      let pushRight = new ToggleButton(this.gameWidth-ToggleButton.WIDTH-10, btnsY, "right", right )
      pushRight.setListener( this.toggleButtonClicked.bind(this) )
      this.toggleButtons.push( pushRight )
      this.addChild(pushRight)

      this.draw()
   }

   toggleButtonClicked( name ) {
      this.clickMode = name
      this.toggleButtons.forEach( b => {
         if (b.name != name ) {
            b.setSelected(false)
         }
      })
   }

   rockTouhed( rock ) {
      if ( this.clickMode == "bomb") {
         var emitter = new particles.Emitter(this.scene, this.explodeAnim )
         emitter.updateOwnerPos(0,0)
         emitter.updateSpawnPos(rock.x, rock.y)
         emitter.playOnceAndDestroy( () => {
            console.log("remove "+rock.tag)
         }) 
         this.removePhysicsItem( rock )
      } else if ( this.clickMode == "pick") {
         rock.toggleSelected()
      } else if ( this.clickMode == "left") {
         this.clearSelectedRocks()
         rock.pushLeft()
      } else if ( this.clickMode == "right") {
         this.clearSelectedRocks()
         rock.pushRight()
      }
   }

   clearSelectedRocks() {
      this.items.forEach( i => {
         if ( i.tag.indexOf("rock") == 0 ) {
            i.deselect()
         }
      })
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