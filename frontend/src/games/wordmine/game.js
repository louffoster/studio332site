import * as PIXI from "pixi.js"
import BasePhysicsGame from "@/games/common/basephysicsgame"
import Dictionary from "@/games/common/dictionary"
import PhysicsShape from "@/games/common/physicsshape"
import Rock from "@/games/wordmine/rock"
import ToggleButton from "@/games/wordmine/togglebutton"
import IconButton from "@/games/wordmine/iconbutton"
import LetterPool from "@/games/common/letterpool"
import Matter from 'matter-js'
import * as particles from '@pixi/particle-emitter'
import explodeJson from '@/assets/trash.json'

export default class WordMine extends BasePhysicsGame {
   pool = new LetterPool()
   explodeAnim = null
   toggleButtons = []
   clearBtn = null 
   submitBtn = null
   clickMode = "pick" // modes: pick, push, bomb
   lastPickedRock = null
   selections = []
   word = null
   score = 0
   dictionary = null
   markers = []

   async initialize(replayHandler, backHandler) {
      this.dictionary = new Dictionary()
      this.explodeAnim = particles.upgradeConfig(explodeJson, ['smoke.png'])

      // set bottom aand sides
      let b = Matter.Bodies.rectangle(this.gameWidth/2, this.gameHeight+25, this.gameWidth, 50, { isStatic: true, friction: 0, restitution: 0})
      Matter.Composite.add(this.physics.world, b)
      let l = Matter.Bodies.rectangle(-25, this.gameHeight/2, 50, this.gameHeight, { isStatic: true, friction: 0, restitution: 0})
      Matter.Composite.add(this.physics.world, l)
      let r = Matter.Bodies.rectangle((Rock.WIDTH*6)+25, (this.gameHeight+250)/2, 50, this.gameHeight-125, { isStatic: true, friction: 0, restitution: 0})
      Matter.Composite.add(this.physics.world, r)
      let r2 = Matter.Bodies.rectangle(this.gameWidth+25, this.gameHeight/2, 50, this.gameHeight, { isStatic: true, friction: 0, restitution: 0})
      Matter.Composite.add(this.physics.world, r2)

      let wedge = PhysicsShape.createTriangle(Rock.WIDTH*7+0.5,165, 82, 82, 0xA68A64,0xA68A64, true)
      wedge.setAngle(.785*4)
      this.addPhysicsItem(wedge)

      // let y = this.gameHeight - Rock.HEIGHT/2
      // let x = Rock.WIDTH/2
      // for ( let c=0; c< 6; c++) {
      //    for ( let r=0; r< 10; r++) {
      //       let ltr = this.pool.popScoringLetter()
      //       let rock = new Rock( x,y, ltr, this.rockTouhed.bind(this) )
      //       this.addPhysicsItem( rock )
      //       y -= Rock.HEIGHT
      //    }
      //    y = this.gameHeight - Rock.HEIGHT/2 - 1
      //    x+= Rock.WIDTH
      // }

      let btnsY = 205
      let pick = PIXI.Sprite.from('/images/wordmine/pick.png')
      let pickButton = new ToggleButton(this.gameWidth-ToggleButton.WIDTH-10, btnsY, "pick", pick )
      pickButton.setSelected(true)
      pickButton.setListener( this.toggleButtonClicked.bind(this) )
      this.toggleButtons.push( pickButton )
      this.addChild(pickButton)

      btnsY += ToggleButton.HEIGHT + 10
      let submit = PIXI.Sprite.from('/images/wordmine/check.png')
      this.submitBtn = new IconButton(this.gameWidth-IconButton.WIDTH-10, btnsY, "submit", submit )
      this.submitBtn.setListener( this.submitClicked.bind(this) )
      this.submitBtn.setEnabled( false )
      this.addChild(this.submitBtn)

      btnsY += IconButton.HEIGHT + 10
      let clear = PIXI.Sprite.from('/images/wordmine/clear.png')
      this.clearBtn = new IconButton(this.gameWidth-IconButton.WIDTH-10, btnsY, "clear", clear )
      this.clearBtn.setListener( this.clearClicked.bind(this) )
      this.clearBtn.setEnabled(false)
      this.addChild(this.clearBtn)

      btnsY += IconButton.HEIGHT + 30
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

      // fill in rocks
      this.pool.refill()
      let y = 0
      let x = this.gameWidth - Rock.WIDTH*0.5

      for ( let c=0; c< 65; c++) {
         x = this.gameWidth - Rock.WIDTH
         if ( c % 2) {
            x = this.gameWidth - Rock.WIDTH*0.5   
         }
         let ltr = this.pool.popScoringLetter()
         let rock = new Rock( x,y, ltr, this.rockTouhed.bind(this) )
         this.addPhysicsItem( rock )
         await new Promise(r => setTimeout(r, 50))
      }


      // add markers
      setTimeout( () => {
         let mX = 50
         let xPos = [ 30, this.gameWidth/2, this.gameWidth-30]
         for ( let i=0; i < 3; i++) {
            // let m = PhysicsShape.createTriangle(xPos[i], 20, 30,30, 0x662222, 0xcc5533)
            // m.setAngle(3.927)
            let m = PhysicsShape.createCircle(xPos[i], 20,15, 0x662222, 0xcc5533)
            this.addPhysicsItem(m)
            this.markers.push(m)
            mX+=(Rock.WIDTH*2)
         }
      }, 4000)
   }

   toggleButtonClicked( name ) {
      this.clickMode = name
      this.toggleButtons.forEach( b => {
         if (b.name != name ) {
            b.setSelected(false)
         }
      })
   }
   clearClicked() {
      this.word.text = "" 
      this.selections = [] 
      this.resetRocks()
      this.clearBtn.setEnabled(false)
      this.submitBtn.setEnabled(false)
   }
   submitClicked() {
      if ( this.dictionary.isValid(this.word.text)) {
         this.submitSuccess()
      } else {
         this.submitFailed()
      }
   }
   submitSuccess() {
      let gone = []
      this.items.forEach( i => {
         if ( i.tag.indexOf("rock") == 0 ) {
            if (i.selected) {
               var emitter = new particles.Emitter(this.scene, this.explodeAnim )
               emitter.updateOwnerPos(0,0)
               emitter.updateSpawnPos(i.x, i.y)
               emitter.playOnceAndDestroy()
               gone.push(i)
            }
         }
      })
      setTimeout( () => {
         gone.forEach( r => this.removePhysicsItem(r))
         this.resetRocks()
         this.clearBtn.setEnabled(false)
         this.submitBtn.setEnabled(false)
         this.word.text = "" 
         this.selections = [] 
      }, 150)
   }
   submitFailed() {
      // FIXME maybe blow up one of the markers.
      // Game ends when no markers, or they reach the bottom of the screen
      console.log("LOSER")    
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
            this.clearBtn.setEnabled(false)
            this.submitBtn.setEnabled(false)
            return
         }
         tgtRock = this.selections[ this.selections.length-1]
         tgtRock.setTarget(true) 
      }

      this.clearBtn.setEnabled(true)
      this.submitBtn.setEnabled(this.word.text.length > 3)

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
            i.setTarget(false)
            i.setEnabled(true)
         }
      })
      this.submitBtn.setEnabled( false )
      this.clearBtn.setEnabled(false)
      this.word.text = "" 
      this.selections = [] 
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

      // black box for drop chute
      this.gfx.beginFill(0x333D29)
      this.gfx.lineStyle(0,0x333D29)
      this.gfx.drawRect(this.gameWidth-110,105, this.gameWidth, 85)
      

      // buttons divider
      this.gfx.lineStyle(3, 0x582F0E, 1)
      this.gfx.moveTo(this.gameWidth-110, 420)
      this.gfx.lineTo(this.gameWidth, 420)

      this.gfx.endFill()
   }

   update() {
      super.update()
   }
}