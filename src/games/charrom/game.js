import BasePhysicsGame from "@/games/common/basephysicsgame"
import Supply from "@/games/charrom/supply"
import Puck from "@/games/charrom/puck"
import Board from "@/games/charrom/board"
import Striker from "@/games/charrom/striker"
import Tile from "@/games/charrom/tile"
import Timer from "@/games/charrom/timer"
import Button from "@/games/common/button"
import Dictionary from "@/games/common/dictionary"
import ShotIndicator from "@/games/charrom/shotindicator"
import StartOverlay from "@/games/charrom/startoverlay"
import EndOverlay from "@/games/charrom/endoverlay"
import TrashAnim from "@/games/letterdrop/trashanim"
import { Text, Assets } from "pixi.js"
// // import * as TWEEDLE from "tweedle.js"

export default class Charrom extends BasePhysicsGame {
   dictionary = new Dictionary()
   supply = new Supply()
   striker = null
   offTable = []
   sunkLetters = []
   puckCount = 0
   tileRackHeight = 69
   statsHeight = 55
   word = null
   score = 0
   sunkCount = 0 
   wordCount = 0
   endReason = ""
   scoreTxt = null
   scratchesLeft = 3
   scratchTxt = null
   board = null
   clearBtn = null 
   submitBtn = null
   rackBtn = null
   gameState = "init"
   startOverlay = null
   shotOverlay = null
   endOverlay = null
   timer = null
   replayHandler  = null 
   backHandler = null
   smoke = null

   static BOARD_WIDTH = 600
   static BOARD_HEIGHT = 600
   static LETTER_LIMIT = 8

   async initialize(replayHandler, backHandler) {
      await super.initialize()
      this.smoke = await Assets.load('/smoke.png')

      this.physics.gravity.scale = 0
      this.replayHandler = replayHandler 
      this.backHandler = backHandler

      this.board = new Board(this, this.statsHeight, Charrom.BOARD_WIDTH, Charrom.BOARD_HEIGHT)
      this.addChild(this.board)

      this.scoreTxt = new Text({text: "00000", style: {
         fontFamily: "Arial",
         fontSize: 28,
         lineHeight: 28,
         fill: 0xF3E9DC
      }})
      this.scoreTxt.anchor.set(1,0.5)
      this.scoreTxt.x = this.gameWidth/2
      this.scoreTxt.y = 26
      this.scoreTxt.anchor.set(0.5)
      this.addChild(this.scoreTxt )

      this.scratchTxt = new Text({ text: `= ${this.scratchesLeft}`, style: {
         fontFamily: "Arial",
         fontSize: 18,
         lineHeight: 18,
         fill: 0xF3E9DC
      }})
      this.scratchTxt.anchor.set(0,0.5)
      this.scratchTxt.x = 52
      this.scratchTxt.y = 26
      this.addChild(this.scratchTxt )

      this.timer = new Timer(this.gameWidth-110, 5, 103, 45)
      this.timer.setTimeoutHandler( this.timeExpired.bind(this) )
      this.addChild(this.timer)

      // NOTE: if you set hit area = scree, mobile pointer events for children are BLOCKED
      this.app.stage.eventMode = 'static'
      this.app.stage.on('pointerdown', this.pointerDown.bind(this))
      this.app.stage.on('pointermove', this.pointerMove.bind(this))
      this.app.stage.on('pointerup', this.dragEnd.bind(this))
      this.app.stage.on('pointerupoutside', this.dragEnd.bind(this))

      this.draw()

      this.word = new Text({text: "", style: {
         fontFamily: "Arial",
         fontSize: 28,
         lineHeight: 28,
         fill: 0xBDD5EA
      }})
      this.word.anchor.set(0,1)
      this.word.x = 25
      this.word.y =  this.gameHeight - 16
      this.addChild(this.word)

      let buttonsY = this.gameHeight - 50
      this.submitBtn = new Button( this.gameWidth-110, buttonsY, "Submit", () => {
         this.submitWord()
      }, 0xFCFAFA,0x2f6690,0x5482bc)
      this.submitBtn.alignTopLeft()
      this.submitBtn.setEnabled( false )
      this.addChild(this.submitBtn )

      this.clearBtn = new Button( this.gameWidth-205, buttonsY, "Clear", () => {
         this.clearWord()
      }, 0xFCFAFA,0x9c5060,0x7c3040)
      this.clearBtn.alignTopLeft()
      this.clearBtn.setEnabled( false )
      this.addChild(this.clearBtn )

      this.rackBtn = new Button( 7, buttonsY, "New Rack", () => {
         this.rackLetterPucks()
      }, 0xFCFAFA,0x1b998b,0x3bb9ab)
      this.rackBtn.alignTopLeft()
      this.rackBtn.setEnabled( false )
      this.addChild(this.rackBtn )

      this.shotOverlay = new ShotIndicator()

      this.startOverlay = new StartOverlay( this.gameWidth, this.gameHeight, () => {
         this.rackLetterPucks()
         this.removeChild(this.startOverlay)
         this.gameState = "place"
      }) 
      this.addChild(this.startOverlay)

      this.app.ticker.add(() => TWEEDLE.Group.shared.update())
   }

   rackLetterPucks() {
      let rack = this.supply.getRack()
      let centerX = Charrom.BOARD_WIDTH/2 
      let centerY =  Charrom.BOARD_HEIGHT/2+this.statsHeight
      let spots = [
         {x: centerX-Puck.DIAMETER/2, y: centerY-45}, {x: centerX+Puck.DIAMETER/2, y: centerY-45}, 
         {x: centerX, y: centerY}, {x: centerX-Puck.DIAMETER, y: centerY}, {x: centerX+Puck.DIAMETER, y: centerY},
         {x: centerX-Puck.DIAMETER/2, y: centerY+45}, {x: centerX+Puck.DIAMETER/2, y: centerY+45}, 
      ]
      this.shuffleArray(rack).forEach( (ltr,idx) => {
         let pos = spots[idx]
         let puck = new Puck(pos.x, pos.y, ltr)
         this.addPhysicsItem( puck )
         this.puckCount++
      })
      this.rackBtn.setEnabled(false)
   }

   placeStriker(x,y) {
      if ( this.striker == null) {
         this.striker = new Striker( x, y, 0x000066, 0x5E3023)
         this.striker.setTouchListener( this.strikerTouched.bind(this))
         this.addPhysicsItem(this.striker)
      } else {
         this.striker.placeOnTable( x, y)
      }
      this.gameState = "touch"
   }

   pointerDown(e) {
      if ( this.gameState == "place") {
         let actualW = this.gameWidth*this.scale
         let scale = (this.gameWidth / actualW )
         if ( this.board.canPlaceStriker(e.global.x*scale, e.global.y*scale, Striker.RADIUS) ) {
            this.placeStriker(e.global.x*scale, e.global.y*scale)
         } 
      }
   }

   pointerMove( e ) {
      if (  this.gameState != "aim" ) return

      let actualW = this.gameWidth*this.scale
      let scale = (this.gameWidth / actualW )
      let ptX = e.global.x*scale
      let ptY = e.global.y*scale
      let dX =  ptX - this.striker.x
      let dY =  ptY - this.striker.y
      let pullDist = Math.sqrt( dX*dX + dY*dY)
      let angle = Math.atan2(dY, dX)
      this.shotAngle = angle + Math.PI
      this.shotOverlay.setRotation(this.shotAngle* 180.0 / Math.PI)
      this.shotOverlay.setPullbackDistance( pullDist )
   }

   strikerTouched() {  
      if ( this.gameState != "touch") return
      this.shotOverlay.place( this.striker.x, this.striker.y)
      this.addChild(this.shotOverlay)
      this.gameState = "aim"
   }

   dragEnd() {
      if (  this.gameState == "aim" ) {
         if ( this.shotOverlay.power > 0.01) {
            let fX = Math.cos(this.shotAngle) * 0.45 * this.shotOverlay.power
            let fY = Math.sin(this.shotAngle) * 0.45 * this.shotOverlay.power

            this.striker.applyForce(fX,fY)
            this.gameState = "shot"
            this.removeChild(this.shotOverlay, false)
         } else {
            this.gameState = "touch"
            this.removeChild(this.shotOverlay, false)   
         }
      }
   }

   puckSunk( puck ) {
      this.sunkCount++
      this.puckCount--
      this.score += 25
      this.timer.puckSunk()
      if ( this.endReason == "expired") {
         this.endReason = ""
      }
      this.renderScore()

      let sunkLetter = puck.letter
      if ( this.sunkLetters.length < Charrom.LETTER_LIMIT) {
         let x = 65
         let y = Charrom.BOARD_HEIGHT+7+this.statsHeight
         let t = new Tile(sunkLetter, x + this.sunkLetters.length*(Tile.WIDTH+4), y, this.tileSelected.bind(this))
         this.sunkLetters.push(t)
         this.addChild(t)
      } else {
         this.endReason = "overflow"
         if ( this.gameState != "shot") {
            this.gameOver()
         }
      }

      if ( this.puckCount == 0 ) {
         this.rackLetterPucks()
      }
   }

   renderScore() {
      this.scoreTxt.text = `${this.score}`.padStart(5,"0")
   }

   tileSelected( t ) {
      this.word.text += t.text
      this.clearBtn.setEnabled( true )
      this.submitBtn.setEnabled( this.word.text.length >= 3 )
   }

   submitWord() {
      if ( this.dictionary.isValid(this.word.text) ) {
         this.submitSuccess()
      } else {
         this.submitFailed()
      }

      this.clearBtn.setEnabled( false )
      this.submitBtn.setEnabled( false )
      this.clearWord()
   }

   submitSuccess() {
      // FIXME
      let tileCnt = this.word.text.length
      let totalTileValue = 0
      let clear = []
      this.sunkLetters.forEach( sl => {
         if ( sl.selected ) {
            clear.push(sl)
            sl.setSuccess()
            totalTileValue += sl.value
         }
      })

      this.score += (totalTileValue * tileCnt) 
      this.renderScore()
      this.word.text = ""
      this.wordCount++
      this.timer.reset()

      setTimeout(  () => {
         clear.forEach( c => {
            let idx = this.sunkLetters.findIndex( sl => sl == c)
            if ( idx > -1 ) {
               this.removeChild(c)
               this.sunkLetters.splice(idx,1)
            }
         })

         // collapse tiles back to left
         let tgtX = 7
         this.sunkLetters.forEach( sl => {
            if ( sl.x != tgtX) {
               new TWEEDLE.Tween(sl).to({ x: tgtX}, 250).start().easing(TWEEDLE.Easing.Linear.None)
            }
            tgtX += (Tile.WIDTH+4)
         })
      }, 300)
   }

   submitFailed() {
      this.sunkLetters.forEach( sl => {
         if ( sl.selected ) {
            sl.setError()
         }
      })
   }

   timeExpired() {
      // set the end reason, but don't end the game if a shot is in progress
      this.endReason = "expired"
      if ( this.gameState != "shot" ) {
         this.gameOver()
      }
   }

   gameOver() {
      if ( this.striker ) {
         this.striker.fade( () => {
            this.removePhysicsItem( this.striker )
            this.striker = null
         })
      }
      this.gameState = "over"
      if ( this.endReason == "overflow") {
         this.sunkLetters.forEach( sl => {
            new TrashAnim(this.app.stage, this.smoke, sl.x+Puck.DIAMETER/2, sl.y+Puck.DIAMETER/2)
         })
      }

      setTimeout( () => {
         let endOverlay = new EndOverlay(Charrom.BOARD_HEIGHT, Charrom.BOARD_HEIGHT, this.endReason, this.replayHandler, this.backHandler)
         endOverlay.setResults(this.score, this.sunkCount, this.wordCount )
         this.addChild( endOverlay )
      }, 500)
   }

   clearWord() {
      this.word.text = ""
      this.sunkLetters.forEach( t => t.deselect() )
      this.clearBtn.setEnabled( false )
   }

   drawLetterRack() {
      // background and border
      let rackY = Charrom.BOARD_HEIGHT+this.statsHeight
      this.gfx.rect(0,rackY, this.gameWidth, this.tileRackHeight).fill(0x7A6C5D)
      this.gfx.moveTo(0, rackY)
      this.gfx.lineTo(this.gameWidth, rackY).stroke({width: 5, color: 0x5E3023})

      // empty letters
      let x = 65
      let y = rackY+7
      for (let i=0; i< Charrom.LETTER_LIMIT; i++) {
         this.gfx.rect(x,y, Tile.WIDTH, Tile.HEIGHT).fill(0xF3E9DC).stroke({width:1, color: 0x5E3023})
         x += Tile.WIDTH+4
      }
   }

   drawTopBar() {
      // background and board sep
      this.gfx.rect(0,0, this.gameWidth, this.statsHeight).fill(0x7A6C5D)
      this.gfx.moveTo(0,this.statsHeight)
      this.gfx.lineTo(this.gameWidth,this.statsHeight)
      this.gfx.stroke({ width: 5, color: 0x5E3023} )

      // draw striker for scratch count marker
      this.gfx.circle(25,25,20).fill(0x5E3023).stroke({width: 1, color: 0x000066})
      this.gfx.circle(25,25,10).fill(0x895737).stroke({width: 1, color: 0x000066})

       // background for timer
       this.gfx.rect(this.gameWidth-115, 2, 115, this.statsHeight-4 ).fill(0x2E4347)
   }

   draw() {
      this.gfx.clear() 
      this.drawLetterRack()
      this.drawTopBar()
   }

   update() {
      if ( this.gameState == "init" || this.gameState == "over") return 

      super.update()
      this.timer.tick(this.app.ticker.deltaMS)

      if ( this.gameState != "shot" ) return 

      let stopped = 0
      let scratched = false
      this.items.forEach( i => {

         if ( i.velocity <= 0.5) {
            i.stop()
            stopped++
         }

         if (  this.board.checkSunk( i ) ) {
            if ( i.tag != "striker") {
               this.puckSunk( i )
               i.removeFromTable()
               this.offTable.push( i )
            } else {
               scratched = true
               this.scratchesLeft--
               this.scratchTxt.text = `= ${this.scratchesLeft}`
               new TrashAnim(this.app.stage, this.smoke, this.striker.x, this.striker.y)
               this.striker.removeFromTable()
               this.offTable.push( this.striker )
            }
         }
      })

      if ( stopped == this.items.length ) {         
         if ( this.scratchesLeft == 0 ) {
            this.endReason = "scratch"
         }
         if ( this.endReason != "" ) {
            this.gameOver()
         } else {
            this.rackBtn.setEnabled( true )
            this.gameState = "place"
            if ( scratched == false  ) {
               this.striker.fade( () => {
                  this.striker.removeFromTable()
                  this.offTable.push( this.striker )
                  this.gameState = "place"
               })
            } 

            setTimeout( () => {
               this.offTable.forEach( p => {
                  if ( p.tag != "striker") {
                     this.removePhysicsItem(p, false )
                  } 
               })
               this.offTable = [] 
            }, 250)
         }
      } else {
         this.rackBtn.setEnabled( false )
      }
   }
}