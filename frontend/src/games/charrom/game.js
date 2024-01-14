import BasePhysicsGame from "@/games/common/basephysicsgame"
import LetterPool from "@/games/common/letterpool"
import LetterBall from "@/games/charrom/letterball"
import Board from "@/games/charrom/board"
import Striker from "@/games/charrom/striker"
import Tile from "@/games/charrom/tile"
import * as PIXI from "pixi.js"
import * as TWEEDLE from "tweedle.js"

export default class Charrom extends BasePhysicsGame {
   pool = new LetterPool()
   targetObject = null
   dragStartTime = -1
   dragStartX = 0 
   dragStartY = 0
   gameTimeMs = 0
   sunkLetters = []
   word = null
   placePuck = true
   justFlicked = false
   flickTimeoutMS = 0
   board = null

   static BOARD_WIDTH = 600
   static BOARD_HEIGHT = 600

   initialize() {
      this.physics.gravity.scale = 0

      this.board = new Board(this, Charrom.BOARD_WIDTH, Charrom.BOARD_HEIGHT)
      this.addChild(this.board)

      this.rackLetterPucks()

      let wordStyle = new PIXI.TextStyle({
         fill: "#BDD5EA",
         fontFamily: "Arial",
         fontSize: 20,
         lineHeight: 20
      })
      this.word = new PIXI.Text("", wordStyle)
      this.word.anchor.set(0.5,1)
      this.word.x = this.gameWidth/2
      this.word.y = this.gameHeight - 20
      this.addChild(this.word)

      this.app.stage.eventMode = 'static'
      this.app.stage.hitArea = this.app.screen
      this.app.stage.on('pointerdown', this.pointerDown.bind(this))
      this.app.stage.on('pointerup', this.dragEnd.bind(this))
      this.app.stage.on('pointerupoutside', this.dragEnd.bind(this))

      this.app.ticker.add(() => TWEEDLE.Group.shared.update())
   }

   rackLetterPucks() {
      let numRows = 4
      let rackLeft = (this.gameWidth-160)/2
      let rackTop = this.gameHeight*.15
      let sz = numRows
      let xPos = rackLeft
      for (let r = 0; r<numRows;r++) {
         for ( let c = 0; c< sz; c++) {
            this.addPuck(xPos, rackTop)
            xPos += 50
         }
         sz--
         xPos = rackLeft+25*(numRows-sz)
         rackTop+=46
      }
   }

   addPuck(x,y) {
      if ( this.pool.hasTilesLeft() == false ) {
         this.pool.refill()
      }
      let letter = this.pool.popScoringLetter()
      let ball = new LetterBall(x,y,letter)
      this.addPhysicsItem( ball )
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
         let tilesLeft = 10
         let tilesTop = Charrom.BOARD_HEIGHT + 10
         let t = new Tile(puck.letter, tilesLeft + this.sunkLetters.length*Tile.WIDTH, tilesTop, this.tileSelected.bind(this))
         this.sunkLetters.push(t)
         this.addChild(t)
      } else {
         console.log("game over")
      }
   }

   tileSelected( t ) {
      this.word.text += t.text
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