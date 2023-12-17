import * as PIXI from "pixi.js"
import * as TWEEDLE from "tweedle.js"
import * as particles from '@pixi/particle-emitter'
import axios from 'axios'
import StartOverlay from "@/games/letterdrop/startoverlay"
import BaseGame from "@/games/common/basegame"
import LetterPool from "@/games/common/letterpool"
import Clock from "@/games/common/clock"
import Button from "@/games/common/button"
import Letter from "@/games/letterdrop/letter"
import TrashMeter from "@/games/letterdrop/trashmeter"

import trashJson from '@/assets/trash.json'

const API_SERVICE = import.meta.env.VITE_S332_SERVICE

export default class LetterDrop extends BaseGame {
   pool = new LetterPool()
   clock = null
   gridTop = 80 
   gridLeft = 10
   columns = []
   columnButtons = []
   trashBtn = null
   trashMeter = null
   choices = []
   trashAnim = null
   startOverlay = null 
   gameState = "init"

   static COLUMNS = 5 
   static MAX_HEIGHT = 6 
   static TILE_W = 60 
   static TILE_H = 60

   initialize(replayHandler, backHandler) { 
      this.trashAnim = particles.upgradeConfig(trashJson, ['smoke.png'])

      this.drawBoard()

      let meterTop = this.gridTop+LetterDrop.TILE_H/4
      this.trashMeter = new TrashMeter(
         this.gridLeft+LetterDrop.TILE_W*5+LetterDrop.TILE_W/4, meterTop,
         LetterDrop.TILE_W/2, LetterDrop.TILE_H*5+LetterDrop.TILE_H/2)
      this.addChild(this.trashMeter)

      for (let c = 0; c < LetterDrop.COLUMNS; c++) {
         this.choices.push(null)
      }

      this.clock = new Clock(280, 515, "", 0xFCFAFA)
      this.addChild(this.clock)

      this.startOverlay = new StartOverlay( API_SERVICE, this.startHandler.bind(this)) 
      this.scene.addChild( this.startOverlay)
      
      // start the eicker last so everything is created / initialized
      this.app.ticker.add( this.gameTick.bind(this) )
      this.app.ticker.add(() => TWEEDLE.Group.shared.update())
   }

   startHandler() {
      this.scene.removeChild( this.startOverlay)
      this.gameState = "playing"
      this.fillChoices()
   }

   fillChoices() {
      let x = 10
      let y = 10
      for (let c = 0; c < LetterDrop.COLUMNS; c++) {
         if ( this.choices[c] == null ) {
            if (this.pool.hasTilesLeft() == false ) {
               this.pool.refill()
            }
            let letter = this.pool.pop()
            let tile = new Letter(  letter, x,y-80)
            tile.setClickHandler( this.newTileClicked.bind(this) )
            this.addChild(tile)
            this.choices[c] = tile
            new TWEEDLE.Tween(tile).to({ y: y}, 250).start().easing(TWEEDLE.Easing.Linear.None)
         }
         x+= LetterDrop.TILE_W
      }
   }

   newTileClicked( tile ) {
      if ( tile.selected ) {
         this.choices.forEach( t => {
            if ( t != null ) {
               if ( t != tile ) {
                  t.deselect()
               }
            }
         })
         this.toggleTileButtons(true)
      } else {
         this.toggleTileButtons(false)
      }
   }

   drawBoard() {
      let y = this.gridTop
      let x = this.gridLeft

      // main squares of the game grid
      this.gfx.clear()
      this.gfx.beginFill(0xA4B8C4)
      this.gfx.lineStyle(1, 0x2E4347, 1)

      for ( let r = 0; r < LetterDrop.MAX_HEIGHT; r++) {
         for (let c = 0; c < LetterDrop.COLUMNS; c++) {
            this.gfx.drawRect(x,y, LetterDrop.TILE_W, LetterDrop.TILE_H)
            x+= LetterDrop.TILE_W
         }
         y+= LetterDrop.TILE_H 
         x = 10
      }
      this.gfx.endFill(0x6E8894)

      let panelX = x 
      let panelY = y

      // boxes around column buttons
      x += LetterDrop.TILE_W / 2 
      y += (LetterDrop.TILE_H / 2 )
      this.gfx.beginFill(0x90a3a3)
      for ( let b=0; b < LetterDrop.COLUMNS; b++) {
         this.gfx.drawRect(panelX,panelY, LetterDrop.TILE_W, LetterDrop.TILE_H)
         panelX += LetterDrop.TILE_W

         let btn = new Button( x,y, `${b+1}`, () => {
            this.columnPicked(b)   
         },0x2E4347,0xbcc4de,0xcce4fe)
         btn.roundButton()
         btn.noShadow()
         btn.setEnabled(false)
         this.addChild(btn)
         this.columnButtons.push(btn)
         this.columns.push( [] )
         x+= LetterDrop.TILE_W
      }
      this.gfx.endFill()

      // backhgrounnd for trash meter
      this.gfx.beginFill(0x90a3a3)
      this.gfx.drawRect(this.gridLeft+LetterDrop.TILE_W*5,this.gridTop, LetterDrop.TILE_W, LetterDrop.TILE_H*6)
      this.gfx.endFill()

      // background for trash button
      this.gfx.beginFill(0xa09a9a)
      this.gfx.drawRect(this.gridLeft+LetterDrop.TILE_W*5,this.gridTop+LetterDrop.TILE_H*6, LetterDrop.TILE_W, LetterDrop.TILE_H)
      this.gfx.endFill()

      this.trashBtn = new Button( x,y, `X`, () => {
         this.trashSelectedTile()  
      },0x2E4347,0xc8a3a3,0xe8a3a3)
      this.trashBtn.roundButton()
      this.trashBtn.noShadow()
      this.trashBtn.setEnabled(false)
      this.addChild( this.trashBtn)
   }

   trashSelectedTile() {
      // TODO track drash count. add animation
      let choiceNum = this.choices.findIndex( t => t.selected)
      let tgtTile = this.choices[choiceNum]
      this.choices[choiceNum] = null

      var emitter = new particles.Emitter(this.scene, this.trashAnim )
      emitter.updateOwnerPos(0,0)
      emitter.updateSpawnPos(tgtTile.x+LetterDrop.TILE_W/2, tgtTile.y+LetterDrop.TILE_H/2)
      emitter.playOnceAndDestroy()   

      
      this.toggleTileButtons( false )
      this.trashMeter.increaseValue()

      setTimeout( () => {
         this.removeChild( tgtTile )
         tgtTile.destroy()
         this.fillChoices()
      }, 450)
   }

   toggleTileButtons( enabled ) {
      this.columnButtons.forEach( b => {
         if (b) b.setEnabled( enabled ) 
      })  
      this.trashBtn.setEnabled( enabled )
   }

   columnPicked( colNum ) {
      // get the tile from the choices list, remove it and set it 
      // at the top of the selected column
      let choiceNum = this.choices.findIndex( t => t.selected)
      let tgtTile = this.choices[choiceNum]
      this.choices[choiceNum] = null
      let colX = this.gridLeft + colNum*LetterDrop.TILE_W
      tgtTile.deselect()
      tgtTile.setPosition(colX, this.gridTop)


      // check the top tile in the tgt column and drop the target to 
      // just above that position
      let tgtY = this.gridTop+((LetterDrop.MAX_HEIGHT-1)*LetterDrop.TILE_H)
      let tgtCol = this.columns[ colNum ]
      tgtY -= ( LetterDrop.TILE_H * tgtCol.length)
      setTimeout( () => {
         tgtCol.push(tgtTile)
         this.fillChoices()
         new TWEEDLE.Tween(tgtTile).to({ y: tgtY}, 300).start().easing(TWEEDLE.Easing.Quadratic.Out)
         this.toggleTileButtons( false )
         tgtTile.setClickHandler( this.gridTileClicked.bind(this) )
      }, 250)
   } 

   gridTileClicked( tile ) {
      console.log(tile)  
   }

   gameTick()  {
      if ( this.gameState != "playing") return
      this.clock.tick(this.app.ticker.deltaMS)
   }
}