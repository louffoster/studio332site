import { Sprite, Text, Assets } from "pixi.js"
import BasePhysicsGame from "@/games/common/basephysicsgame"
import Dictionary from "@/games/common/dictionary"
import PhysicsShape from "@/games/common/physicsshape"
import Rock from "@/games/wordmine/rock"
import ToggleButton from "@/games/wordmine/togglebutton"
import RotateButton from "@/games/wordmine/rotatebutton"
import IconButton from "@/games/wordmine/iconbutton"
import Boom from "@/games/wordmine/boom"
import LetterPool from "@/games/common/letterpool"
import Matter from 'matter-js'
import * as TWEEDLE from "tweedle.js"

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
   scoreDisplay = null
   dictionary = null
   markers = []
   gameState = "init"
   mineFloor = null
   smoke = null
   bit = null
   shoveBtn = null

   async initialize(replayHandler, backHandler) {
      await super.initialize()
      this.app.ticker.add(() => TWEEDLE.Group.shared.update())
      const pickImg = await Assets.load('/images/wordmine/pick.png')
      const checkImg = await Assets.load('/images/wordmine/check.png')
      const clearImg = await Assets.load('/images/wordmine/clear.png')
      const bombImg = await Assets.load('/images/wordmine/bomb.png')
      const upImg = await Assets.load('/images/wordmine/up.png')

      this.smoke = await Assets.load('/smoke.png')
      this.bit = await Assets.load('/particle.png')

      this.dictionary = new Dictionary()

      // set bottom aand sides
      this.mineFloor = Matter.Bodies.rectangle(this.gameWidth/2, this.gameHeight+25, this.gameWidth, 50, { isStatic: true, friction: 0, restitution: 0})
      this.mineFloor.friction = 0
      Matter.Composite.add(this.physics.world, this.mineFloor)
      let l = Matter.Bodies.rectangle(-25, this.gameHeight/2, 50, this.gameHeight, { isStatic: true, friction: 0, restitution: 0})
      l.friction = 0
      Matter.Composite.add(this.physics.world, l)
      let r = Matter.Bodies.rectangle((Rock.WIDTH*6)+25, (this.gameHeight+250)/2, 50, this.gameHeight-125, { isStatic: true, friction: 0, restitution: 0})
      r.friction = 0
      Matter.Composite.add(this.physics.world, r)
      let r2 = Matter.Bodies.rectangle(this.gameWidth+25, this.gameHeight/2, 50, this.gameHeight, { isStatic: true, friction: 0, restitution: 0})
      r2.friction = 0   
      Matter.Composite.add(this.physics.world, r2)

      let wedge = PhysicsShape.createTriangle(Rock.WIDTH*7+0.5,165, 82, 82, 0xA68A64,0xA68A64, true)
      wedge.setAngle(.785*4)
      wedge.setFriction(0)
      this.addPhysicsItem(wedge)

      // let lX = [Rock.WIDTH, this.gameWidth/2-Rock.WIDTH, Rock.WIDTH*5]
      // let lY = [this.gameHeight-Rock.HEIGHT*4.5, this.gameHeight-Rock.HEIGHT*7.5, this.gameHeight-Rock.HEIGHT*1.5]
      // for (let l = 0; l< 3; l++) {
      //    let ledge = PhysicsShape.createBox(lX[l], lY[l], 120, 10, 0xA68A64,0xA68A64, true)
      //    ledge.setFriction(0)
      //    this.addPhysicsItem(ledge)
      // }
      // let w = PhysicsShape.createBox(lX[0]+55, lY[0]-10, 10, 15, 0xA68A64,0xA68A64, true)
      // this.addPhysicsItem(w)
      // let w1 = PhysicsShape.createBox(lX[1]-55, lY[1]-10, 10,15, 0xA68A64,0xA68A64, true)
      // this.addPhysicsItem(w1)
      // let w2 = PhysicsShape.createBox(lX[1]+55, lY[1]-10, 10,15, 0xA68A64,0xA68A64, true)
      // this.addPhysicsItem(w2)
      // let w3 = PhysicsShape.createBox(lX[2]-55, lY[2]-10, 10,15, 0xA68A64,0xA68A64, true)
      // this.addPhysicsItem(w3)


      // control buttons -----
      let btnsY = 205
      let pickButton = new ToggleButton(this.gameWidth-ToggleButton.WIDTH-10, btnsY, "pick", Sprite.from(pickImg) )
      pickButton.setSelected(true)
      pickButton.setListener( this.toggleButtonClicked.bind(this) )
      this.toggleButtons.push( pickButton )
      this.addChild(pickButton)

      btnsY += ToggleButton.HEIGHT + 10
      this.submitBtn = new IconButton(this.gameWidth-IconButton.WIDTH-10, btnsY, "submit", Sprite.from(checkImg) )
      this.submitBtn.setListener( this.submitClicked.bind(this) )
      this.submitBtn.setEnabled( false )
      this.addChild(this.submitBtn)

      btnsY += IconButton.HEIGHT + 10
      this.clearBtn = new IconButton(this.gameWidth-IconButton.WIDTH-10, btnsY, "clear", Sprite.from(clearImg) )
      this.clearBtn.setListener( this.clearClicked.bind(this) )
      this.clearBtn.setEnabled(false)
      this.addChild(this.clearBtn)

      btnsY += IconButton.HEIGHT + 30
      let bombButton = new ToggleButton(this.gameWidth-ToggleButton.WIDTH-10, btnsY, "bomb", Sprite.from(bombImg) )
      bombButton.setListener( this.toggleButtonClicked.bind(this) )
      this.toggleButtons.push( bombButton )
      this.addChild(bombButton)
      btnsY += ToggleButton.HEIGHT + 10
      this.shoveBtn = new RotateButton(this.gameWidth-ToggleButton.WIDTH-10, btnsY, "shove", Sprite.from(upImg) )
      this.shoveBtn.setListener( this.toggleButtonClicked.bind(this) )
      this.toggleButtons.push( this.shoveBtn )
      this.addChild(this.shoveBtn)

      let wordStyle = {
         fill: "#FCFAFF",
         fontFamily: "Arial",
         fontSize: 28,
         stroke: {color: "#333333", width: 2},
      }
      this.word = new Text({text: "", style: wordStyle})
      this.word.x = 10 
      this.word.y = 65
      this.addChild(this.word)

      this.score = 0
      this.scoreDisplay = new Text({text: "00000", style: wordStyle})
      this.scoreDisplay.anchor.set(0.5)
      this.scoreDisplay.x = this.gameWidth/2
      this.scoreDisplay.y = 20
      this.addChild(this.scoreDisplay)

      this.draw()

      // fill in rocks
      this.pool.refill()
      let y = 0
      let x = this.gameWidth - Rock.WIDTH*0.5

      for ( let c=0; c< 14; c++) {
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
            let m = PhysicsShape.createBox(xPos[i], 20,25,25, 0x662222, 0xcc5533)
            this.addPhysicsItem(m)
            this.markers.push(m)
            mX+=(Rock.WIDTH*2)
         }
         this.gameState = "play"
      }, 3000)
   }

   toggleButtonClicked( name ) {
      if (this.gameState != "play") return 

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
               new Boom(this.app.stage, this.smoke, this.bit, i.x, i.y)
               gone.push(i)
            }
         }
      })

      let tileCnt = this.word.text.length
      let totalTileValue = 0
      this.selections.forEach( s=> {
         totalTileValue += s.value  
      })
      this.score += (totalTileValue * tileCnt) 
      this.renderScore()

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
      this.selections.forEach( s => {
         s.setError()
      })
      setTimeout( () => {
         this.resetRocks()
      }, 500) 

      let m = this.markers.pop() 
      new Boom(this.app.stage, this.smoke, this.bit, m.x,m.y, () => {
         this.removePhysicsItem( m )
         if ( this.markers.length == 0) {
            this.gameOver()
         }
      })
   }

   rockTouhed( rock ) {
      if (this.gameState != "play") return 

      if ( this.clickMode == "bomb") {
         new Boom(this.app.stage, this.smoke, this.bit, rock.x, rock.y, () => {
            this.removePhysicsItem( rock )
         })
      } else if ( this.clickMode == "pick") {
         this.rockSelected( rock )
      } else if ( this.clickMode == "shove") {
         this.resetRocks()
         if (this.shoveBtn.angle == 0) {
            rock.pushUp()
         } else if (this.shoveBtn.angle == 90) {
            rock.pushRight()
         } else if (this.shoveBtn.angle == 270) {
            rock.pushLeft()
         }
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
               
               if ( dist <= (Rock.WIDTH*1.25)) {
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

   renderScore() {
      this.scoreDisplay.text = `${this.score}`.padStart(5,"0")
   }

   gameOver() {
      for ( let i=0; i<5; i++) {
         new Boom(this.app.stage, this.smoke, this.bit, 10+(this.gameWidth/5)*i, this.gameHeight-10)
      }
      Matter.Composite.remove(this.physics.world, this.mineFloor)
      this.gameState = "over"
      this.toggleButtons.forEach( tb => {
         tb.setEnabled(false)
      })
      this.resetRocks()
   }

   draw() {
      this.gfx.clear() 

      // sky
      this.gfx.rect(0,0, this.gameWidth, 105).
         fill(0x86BBD8).stroke({width: 1, color: 0x86BBD8})

      // buttons container
      this.gfx.rect(330,125, this.gameWidth-330, this.gameHeight-125).
         fill(0xA68A64).stroke({width: 2, color: 0x582F0E} )

      // black box for drop chute
      this.gfx.rect(this.gameWidth-110,105, this.gameWidth, 85).fill(0x333D29)

       // grass
       this.gfx.roundRect(-20,105, this.gameWidth-100, 20, 20).
         fill(0x73a942).stroke({width: 2, color: 0x538922})
      
      // buttons divider
      this.gfx.moveTo(this.gameWidth-110, 420)
      this.gfx.lineTo(this.gameWidth, 420)
      this.gfx.stroke({width: 3, color: 0x582F0E})
   }

   update() {
      super.update()
      if (this.gameState != "play") return 

      if (this.markers.length > 0) {
         let pop = []
         this.markers.forEach( (m,idx) => {
            if ( m.y >= this.gameHeight - 15 ) {
               m.stop()
               pop.push(idx)
            }
         })
         pop.forEach( idx => {
            const m = this.markers[idx]
            this.markers.splice(idx,1)
            new Boom(this.app.stage, this.smoke, this.bit, m.x,m.y, () => {
               this.removePhysicsItem( m )
            })
         })
      }  else {
         this.gameOver()
      }
   }
}