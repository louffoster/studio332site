import { Sprite, Text, Assets } from "pixi.js"
import BasePhysicsGame from "@/games/common/basephysicsgame"
import Dictionary from "@/games/common/dictionary"
import PhysicsShape from "@/games/common/physicsshape"
import Rock from "@/games/wordmine/rock"
import ToggleButton from "@/games/wordmine/togglebutton"
import IconButton from "@/games/wordmine/iconbutton"
import ShoveIndicator from "@/games/wordmine/shoveindicator"
import StartOverlay from "@/games/wordmine/startoverlay"
import EndOverlay from "@/games/wordmine/endoverlay"
import Boom from "@/games/wordmine/boom"
import Marker from "@/games/wordmine/marker"
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
   wordCount = 0
   score = 0
   scoreDisplay = null
   dictionary = null
   markers = []
   gameState = "init"
   mineFloor = null
   smoke = null
   bit = null
   shoveRock = null
   shoveOverlay = null


   static LEFT_EDGE_W = 25
   static PIT_TOP = 105

   async initialize(replayHandler, backHandler) {
      await super.initialize()
      this.app.ticker.add(() => TWEEDLE.Group.shared.update())
      const pickImg = await Assets.load('/images/wordmine/pick.png')
      const checkImg = await Assets.load('/images/wordmine/check.png')
      const clearImg = await Assets.load('/images/wordmine/clear.png')
      const bombImg = await Assets.load('/images/wordmine/bomb.png')
      const throwImg = await Assets.load('/images/wordmine/throw.png')
      const nailImg = await Assets.load('/images/wordmine/nail.png')

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
      const l2 = PhysicsShape.createBox(0,this.gameHeight/2+75, 50, this.gameHeight-WordMine.PIT_TOP, 0x664A24,0xA68A64,true)
      this.addPhysicsItem(l2)
      let r = Matter.Bodies.rectangle(WordMine.LEFT_EDGE_W+(Rock.WIDTH*6)+25, (this.gameHeight+250)/2, 
         50, this.gameHeight-125, { isStatic: true, friction: 0, restitution: 0})
      r.friction = 0
      Matter.Composite.add(this.physics.world, r)
      let r2 = Matter.Bodies.rectangle(this.gameWidth+25, this.gameHeight/2, 50, this.gameHeight, { isStatic: true, friction: 0, restitution: 0})
      r2.friction = 0   
      Matter.Composite.add(this.physics.world, r2)

      let wedge = PhysicsShape.createTriangle(Rock.WIDTH*7+WordMine.LEFT_EDGE_W,165, 82, 82, 0xA68A64,0xA68A64, true)
      wedge.setAngle(.785*4)
      wedge.setFriction(0)
      this.addPhysicsItem(wedge)

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
      let throwBtn = new ToggleButton(this.gameWidth-ToggleButton.WIDTH-10, btnsY, "shove", Sprite.from(throwImg) )
      throwBtn.setListener( this.toggleButtonClicked.bind(this) )
      this.toggleButtons.push( throwBtn )
      this.addChild(throwBtn)
      btnsY += ToggleButton.HEIGHT + 10
      let pinBtn = new ToggleButton(this.gameWidth-ToggleButton.WIDTH-10, btnsY, "pin", Sprite.from(nailImg) )
      pinBtn.setListener( this.toggleButtonClicked.bind(this) )
      this.toggleButtons.push( pinBtn )
      this.addChild(pinBtn)

      let wordStyle = {
         fill: "#ffffff",
         fontFamily: "Arial",
         fontSize: 28,
         stroke: {color: "#333333", width: 4},
      }
      this.word = new Text({text: "", style: wordStyle})
      this.word.x = 10 
      this.word.y = 65
      this.addChild(this.word)

      this.score = 0
      this.scoreDisplay = new Text({text: "$0000", style: wordStyle})
      this.scoreDisplay.anchor.set(0.5)
      this.scoreDisplay.x = this.gameWidth/2
      this.scoreDisplay.y = 20
      this.addChild(this.scoreDisplay)

      this.draw()

      const startOverlay = new StartOverlay(WordMine.LEFT_EDGE_W+Rock.WIDTH*6, Rock.HEIGHT*10, () => {
         this.removeChild(startOverlay)
         this.fillRocks()
      })
      this.addChild(startOverlay)
      this.endOverlay = new EndOverlay(WordMine.LEFT_EDGE_W+Rock.WIDTH*6, Rock.HEIGHT*10, replayHandler, backHandler)

      // setup drag to set shove angle
      this.app.stage.eventMode = 'static'
      this.shoveOverlay = new ShoveIndicator()
      this.app.stage.on('pointermove', this.pointerMove.bind(this))
      this.app.stage.on('pointerup', this.dragEnd.bind(this))
      this.app.stage.on('pointerupoutside', this.dragEnd.bind(this))
   }

   async fillRocks() {
      this.pool.refill()
      let y = 0
      let x = this.gameWidth - Rock.WIDTH*0.5

      for ( let c=0; c< 60; c++) {
         x = this.gameWidth - Rock.WIDTH
         if ( c % 2) {
            x = this.gameWidth - Rock.WIDTH*2  
         }
         let ltr = this.pool.popScoringLetter()
         let rock = new Rock( x,y, ltr, this.rockTouhed.bind(this) )
         this.addPhysicsItem( rock )
         await new Promise(r => setTimeout(r, 60))
         if ( c == 20 || c == 40 ) {
            let m = new Marker( this.gameWidth-150, 20, this.markerTouched.bind(this) )
            this.addPhysicsItem(m)
            this.markers.push(m)
         }
      }

      setTimeout( () => {
         let m = new Marker( this.gameWidth-50, 20, this.markerTouched.bind(this) )
         this.addPhysicsItem(m)
         this.markers.push(m)
         this.gameState = "play"
      }, 2000)
   }

   async dropExtraRocks() {
      let y = 0
      let x = this.gameWidth - Rock.WIDTH*0.5

      for ( let c=0; c< 10; c++) {
         x = this.gameWidth - Rock.WIDTH
         if ( c % 2) {
            x = this.gameWidth - Rock.WIDTH*2  
         }
         let ltr = this.pool.popScoringLetter()
         let rock = new Rock( x,y, ltr, this.rockTouhed.bind(this) )
         this.addPhysicsItem( rock )
         await new Promise(r => setTimeout(r, 60))
      }   
   }

   pointerMove(e) {
      if (this.shoveRock != null) {
         let actualW = this.gameWidth*this.scale
         let scale = (this.gameWidth / actualW )
         let ptX = e.global.x*scale
         let ptY = e.global.y*scale
         let dX =  ptX - this.shoveRock.x
         let dY =  ptY - this.shoveRock.y
         let angle = Math.atan2(dY, dX)
         this.shoveAngle = angle + Math.PI
         this.shoveOverlay.setRotation(this.shoveAngle* 180.0 / Math.PI)
      }
   }

   dragEnd() {
      if ( this.shoveRock != null ) {
         let force = 0.08 
         if ( this.shoveRock.isVowel) {
            // vowel rocks are smaller... use less force
            force = 0.06
         }
         let fX = Math.cos(this.shoveAngle) * force
         let fY = Math.sin(this.shoveAngle) * force
         this.shoveRock.applyForce(fX,fY)
         this.shoveRock = null
         this.removeChild(this.shoveOverlay, false)
      }
   }

   markerTouched( marker ) {
      if ( this.gameState != "play") return  

      if (  this.clickMode == "bomb" ) {
         if ( this.markers.length > 1) {
            let idx = this.markers.findIndex( m => m == marker )
            this.markers.splice(idx,1)
            marker.fade()
            new Boom(this.app.stage, this.smoke, this.bit, marker.x, marker.y, () => {
               this.removePhysicsItem( marker )
               this.dropExtraRocks()
            })
         } else {
            // dont allow the last marker to be blown up
         }
      } else if ( this.clickMode == "shove") {
         this.resetRocks()
         this.shoveOverlay.place( marker.x, marker.y)
         this.addChild(this.shoveOverlay)
         this.shoveRock = marker
      }
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
         this.shoveOverlay.place( rock.x, rock.y)
         this.addChild(this.shoveOverlay)
         this.shoveRock = rock
      } else if ( this.clickMode == "pin") {
         this.resetRocks()    
         if ( rock.pinned == false ) {
            rock.pin()
         } else {
            rock.unPin()
         }
      }
   }

   toggleButtonClicked( name ) {
      if (this.gameState == "over") return 

      this.clickMode = name
      this.toggleButtons.forEach( b => {
         if (b.name != name ) {
            b.setSelected(false)
         }
      })
      this.resetRocks()
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
      this.score += (totalTileValue * tileCnt * 5) 
      this.renderScore()

      this.markers[0].extendTime()

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

      let m = this.markers.shift() 
      new Boom(this.app.stage, this.smoke, this.bit, m.x,m.y, () => {
         this.removePhysicsItem( m )
         if ( this.markers.length == 0) {
            this.gameOver()
         }
      })
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
            i.setBombMode( this.clickMode == 'bomb')
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
      let val = `${this.score}`.padStart(4,"0")
      this.scoreDisplay.text = `$${val}`
   }

   gameOver() {
      if ( this.gameState == "over" ) return

      this.gameState = "over"
      this.resetRocks()
      for ( let i=0; i<5; i++) {
         new Boom(this.app.stage, this.smoke, this.bit, 10+(this.gameWidth/5)*i, this.gameHeight-10)
      }
      Matter.Composite.remove(this.physics.world, this.mineFloor)
      this.toggleButtons.forEach( tb => {
         tb.setEnabled(false)
      })

      console.log("END OVERLAY")
      const endY = this.endOverlay.y
      this.endOverlay.y = -1200
      this.addChild(this.endOverlay)
      new TWEEDLE.Tween(this.endOverlay).to({ y: endY}, 2500).start().easing(TWEEDLE.Easing.Linear.None)
   }

   draw() {
      this.gfx.clear() 

      // sky
      this.gfx.rect(0,0, this.gameWidth, WordMine.PIT_TOP).
         fill(0x86BBD8).stroke({width: 1, color: 0x86BBD8})

      this.gfx.rect(0,WordMine.PIT_TOP, this.gameWidth, this.gameHeight-WordMine.PIT_TOP).fill(0x333D29)

      // buttons container
      const containerX = WordMine.LEFT_EDGE_W+330 
      this.gfx.rect(containerX,190, this.gameWidth-containerX, this.gameHeight-190).
         fill(0xA68A64)//.stroke({width: 2, color: 0x582F0E} )

       // grass
       this.gfx.roundRect(-20,105, this.gameWidth-100, 20, 20).
         fill(0x73a942).stroke({width: 2, color: 0x538922})
      
      // buttons divider
      this.gfx.moveTo(this.gameWidth-80, 420)
      this.gfx.lineTo(this.gameWidth, 420)
      this.gfx.stroke({width: 3, color: 0x582F0E})
   }

   update() {
      super.update()
      if (this.gameState != "play") return 

      if (this.markers.length > 0) {
         if (this.markers.length == 1) {
            const lastM = this.markers[0]
            if (lastM.countDown == false ) {
               lastM.countDown = true
            }
            lastM.tick(this.app.ticker.deltaMS, () => {
               new Boom(this.app.stage, this.smoke, this.bit, lastM.x,lastM.y, () => {
                  this.removePhysicsItem( lastM )
                  this.gameOver()
               })    
            })
         }
         let pop = []
         this.markers.forEach( (m,idx) => {
            if ( m.y >= this.gameHeight - Marker.HEIGHT/2-5 ) {
               m.stop()
               pop.push(idx)
            }
         })
         pop.forEach( idx => {
            const m = this.markers[idx]
            this.markers.splice(idx,1)
            new Boom(this.app.stage, this.smoke, this.bit, m.x,m.y, () => {
               this.removePhysicsItem( m )
               this.dropExtraRocks()
            })
         })
      }  else {
         this.gameOver()
      }
   }
}