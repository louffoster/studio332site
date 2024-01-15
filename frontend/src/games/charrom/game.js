import BasePhysicsGame from "@/games/common/basephysicsgame"
import Supply from "@/games/charrom/supply"
import Puck from "@/games/charrom/puck"
import Board from "@/games/charrom/board"
import Striker from "@/games/charrom/striker"
import Tile from "@/games/charrom/tile"
import Button from "@/games/common/button"
import * as PIXI from "pixi.js"
import * as TWEEDLE from "tweedle.js"

export default class Charrom extends BasePhysicsGame {
   supply = new Supply()
   targetObject = null
   dragStartTime = -1
   dragStartX = 0 
   dragStartY = 0
   gameTimeMs = 0
   sunkLetters = []
   tileRackX = 7 
   tileRackY = Charrom.BOARD_HEIGHT+7
   tileRackHeight = 69
   word = null
   placePuck = true
   justFlicked = false
   flickTimeoutMS = 0
   board = null
   clearBtn = null 
   submitBtn = null

   static BOARD_WIDTH = 600
   static BOARD_HEIGHT = 600

   initialize() {
      this.physics.gravity.scale = 0

      this.board = new Board(this, Charrom.BOARD_WIDTH, Charrom.BOARD_HEIGHT)
      this.addChild(this.board)
      this.rackLetterPucks()

      let buttonsY = this.tileRackY+this.tileRackHeight + 5
      this.submitBtn = new Button( 338, buttonsY, "Submit", () => {
         this.submitWord()
      }, 0xFCFAFA,0x2f6690,0x5482bc)
      this.submitBtn.small()
      this.submitBtn.alignTopLeft()
      this.submitBtn.noShadow()
      this.submitBtn.setEnabled( false )
      this.addChild(this.submitBtn )

      this.clearBtn = new Button( 260, buttonsY, "Clear", () => {
         this.clearWord()
      }, 0xFCFAFA,0x9c5060,0x5482bc)
      this.clearBtn.small()
      this.clearBtn.alignTopLeft()
      this.clearBtn.noShadow()
      this.clearBtn.setEnabled( false )
      this.addChild(this.clearBtn )

      let wordStyle = new PIXI.TextStyle({
         fill: "#BDD5EA",
         fontFamily: "Arial",
         fontSize: 28,
         lineHeight: 28
      })
      this.word = new PIXI.Text("", wordStyle)
      this.word.anchor.set(0,0.5)
      this.word.x = 10
      this.word.y = buttonsY+10
      this.addChild(this.word)

      this.app.stage.eventMode = 'static'
      this.app.stage.hitArea = this.app.screen
      this.app.stage.on('pointerdown', this.pointerDown.bind(this))
      this.app.stage.on('pointerup', this.dragEnd.bind(this))
      this.app.stage.on('pointerupoutside', this.dragEnd.bind(this))

      this.draw()

      this.app.ticker.add(() => TWEEDLE.Group.shared.update())
   }

   rackLetterPucks() {
      let y = this.gameHeight*.15
      let x = (this.gameWidth-Puck.WIDTH)/2
      let rack = this.supply.getRack()
      rack.forEach( (l, idx) => {
         let puck = new Puck(x,y, l)
         this.addPhysicsItem( puck )
         x+= Puck.WIDTH

         if ( idx == 1 ) {
            y += 45
            x = ((this.gameWidth-Puck.WIDTH)/2 - Puck.WIDTH/2)
         } else if ( idx == 4) {
            y += 45  
            x = (this.gameWidth-Puck.WIDTH)/2
         }
      })
   }

   placeStriker(x,y) {
      let striker = new Striker( x, y, 0x000066, 0x5E3023)
      striker.setTouchListener( this.dragStart.bind(this))
      this.addPhysicsItem(striker)
      this.placePuck = false
   }

   pointerDown(e) {
      if ( this.placePuck) {
         let actualW = this.gameWidth*this.scale
         let scale = (this.gameWidth / actualW )
         if ( this.board.canPlaceStriker(e.global.y*scale, Striker.RADIUS) ) {
            this.placeStriker(e.global.x*scale, e.global.y*scale)
         } 
      }
   }

   dragStart( x,y,tgt ) {  
      this.targetObject = tgt 
      this.dragStartTime = this.gameTimeMs
      this.dragStartX = x
      this.dragStartY = y
      
   }

   dragEnd(e) {
      this.app.stage.off('pointermove', this.dragMove)
      if ( this.targetObject ) {
         let elapsedMS = this.gameTimeMs - this.dragStartTime 
         let dX = e.global.x - this.dragStartX
         let dY = e.global.y - this.dragStartY

         let dist = Math.sqrt( dX*dX + dY*dY) 
         let ratePxMerMs = dist / elapsedMS
         ratePxMerMs = Math.min(ratePxMerMs, 0.15)
         let fX = dX * (ratePxMerMs / 100)
         let fY = dY * (ratePxMerMs / 100)

         this.targetObject.applyForce(fX,fY)
         this.targetObject = null 
         this.dragStartTime = -1
         this.dragStartX = 0
         this.dragStartY = 0
         this.flickTimeoutMS = 1500
         this.justFlicked = true
      }
   }

   puckSunk( puck ) {
      if ( this.sunkLetters.length < 10) {
         let x = this.tileRackX
         let y = this.tileRackY
         let t = new Tile(puck.letter, x + this.sunkLetters.length*(Tile.WIDTH+4), y, this.tileSelected.bind(this))
         this.sunkLetters.push(t)
         this.addChild(t)
      } else {
         console.log("game over")
      }
   }

   tileSelected( t ) {
      this.word.text += t.text
   }

   drawLetterRack() {
      this.gfx.clear() 
      this.gfx.lineStyle( 1, 0x5E3023, 1 )
      this.gfx.beginFill(0x7A6C5D)
      this.gfx.drawRect(0,Charrom.BOARD_HEIGHT, this.gameWidth, this.tileRackHeight)

      this.gfx.lineStyle( 1, 0x5E3023)
      this.gfx.beginFill(0xF3E9DC)
      let x = this.tileRackX
      let y = this.tileRackY
      for (let i=0; i<10; i++) {
         this.gfx.drawRect(x,y, Tile.WIDTH, Tile.HEIGHT)
         x += Tile.WIDTH+4
      }
   }

   draw() {
      this.drawLetterRack()
   }

   update() {
      super.update()
      this.gameTimeMs += this.app.ticker.deltaMS
      if ( this.placePuck || this.justFlicked == false ) return 

      if ( this.flickTimeoutMS > 0) {
         this.flickTimeoutMS -= this.app.ticker.deltaMS
         this.flickTimeoutMS = Math.max(0, this.flickTimeoutMS)
      }

      let removeItems = []
      let striker = null
      let stopped = 0
      this.items.forEach( i => {

         if ( this.flickTimeoutMS == 0 ) {
            if ( i.velocity <= 0.05) {
              i.stop()
              stopped++
              
            }
         } 

         if ( i.tag == "striker") {
            striker = i
         }

         if (this.board.isSunk(i)) {
            removeItems.push( i )  
            if ( i.tag != "striker") {
               this.puckSunk( i )
            } else {
               striker = null
            }
         }
      })

      if ( stopped == this.items.length ) {
         this.justFlicked = false 
         this.placePuck = true
         if ( striker ) {
            striker.fade( () => this.removePhysicsItem(striker))
         }
      }
 

      removeItems.forEach( i => this.removePhysicsItem( i ) )
   }
}