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
   lastPickedRock = null
   selections = []
   word = null
   score = 0

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
         y = this.gameHeight - Rock.HEIGHT/2 - 1
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

      let wordStyle = new PIXI.TextStyle({
         fill: "#FCFAFF",
         fontFamily: "Arial",
         fontSize: 28,
         lineHeight: 28,
         stroke: "#333333",
         strokeThickness: 2,
      })
      this.word = new PIXI.Text("", wordStyle)
      this.word.x = 10 
      this.word.y = 65
      this.addChild(this.word)

      this.score = new PIXI.Text("00000", wordStyle)
      this.score.anchor.set(0.5)
      this.score.x = this.gameWidth/2
      this.score.y = 20
      this.addChild(this.score)

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
         this.rockSelected( rock )
      } else if ( this.clickMode == "left") {
         this.resetRocks()
         rock.pushLeft()
      } else if ( this.clickMode == "right") {
         this.resetRocks()
         rock.pushRight()
      }
   }

   rockSelected( rock ) {
      if ( this.word.text.length == 10 && rock.selected == false) return

      rock.toggleSelected()

      let tgtRock = rock
      if ( tgtRock.selected ) {
         this.word.text += rock.text
         if ( this.selections.length > 0 ) {
            let last = this.selections[ this.selections.length-1]
            last.setTarget(false)
         } 
         this.selections.push( rock )
         tgtRock.setTarget(true)
      } else {
         this.word.text =  this.word.text.slice(0, rock.text.length*-1 )
         tgtRock.setTarget(false)   
         this.selections.pop()
         if ( this.selections.length == 0) {
            this.resetRocks()
            return
         }
         tgtRock = this.selections[ this.selections.length-1]
         tgtRock.setTarget(true) 
      }

      this.items.forEach( i => {
         if ( i == tgtRock ) return

         if ( i.tag.indexOf("rock") == 0 ) {
            if ( i.selected == false ) {
               let dX = tgtRock.x - i.x
               let dY = tgtRock.y - i.y
               let dist = Math.sqrt( dX*dX + dY*dY )
               
               if ( dist <= (Rock.WIDTH+10)) {
                  i.setEnabled( ( this.word.text.length < 10) )
               } else {
                  i.setEnabled(false)
               }
            } 
         }
      })
   }

   resetRocks() {
      this.items.forEach( i => {
         if ( i.tag.indexOf("rock") == 0 ) {
            i.deselect()
            i.setEnabled(true)
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