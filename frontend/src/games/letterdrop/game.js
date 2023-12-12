import * as PIXI from "pixi.js"
import * as TWEEDLE from "tweedle.js"
import * as particles from '@pixi/particle-emitter'
import axios from 'axios'
import BaseGame from "@/games/common/basegame"
import LetterPool from "@/games/common/letterpool"
import Clock from "@/games/common/clock"
import Button from "@/games/common/button"
import Letter from "@/games/letterdrop/letter"

const API_SERVICE = import.meta.env.VITE_S332_SERVICE

export default class LetterDrop extends BaseGame {
   pool = new LetterPool()
   clock = null
   gridTop = 80 
   gridLeft = 10
   columns = []
   columnButtons = []
   choices = []

   static COLUMNS = 5 
   static MAX_HEIGHT = 6 
   static TILE_W = 60 
   static TILE_H = 60

   initialize(replayHandler, backHandler) {
   

      this.drawBoard()

      for (let c = 0; c < LetterDrop.COLUMNS; c++) {
         this.choices.push(null)
      }
      this.fillChoices()

      this.clock = new Clock(280, 515, "", 0xFCFAFA)
      this.addChild(this.clock)
      
      // start the eicker last so everything is created / initialized
      this.app.ticker.add( this.gameTick.bind(this) )
      this.app.ticker.add(() => TWEEDLE.Group.shared.update())
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
            let tile = new Letter(  letter, x,y-80, () => {
               this.newTileClicked( tile )
            })
            this.addChild(tile)
            this.choices[c] = tile
            new TWEEDLE.Tween(tile).to({ y: y}, 250).start()
         }
         x+= LetterDrop.TILE_W
      }
   }

   newTileClicked( tile ) {
      if ( tile.selected ) {
         this.choices.forEach( t => {
            if ( t != tile ) {
               t.deselect()
            }
         })
         this.columnButtons.forEach( b => b.setEnabled(true) )
      } else {
         this.columnButtons.forEach( b => b.setEnabled(false) )   
      }
   }

   drawBoard() {
      let y = this.gridTop
      let x = this.gridLeft

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

      x += LetterDrop.TILE_W / 2 
      y += (LetterDrop.TILE_H / 2 )
      this.gfx.beginFill(0xC8D3D5)
      for ( let b=0; b < LetterDrop.COLUMNS; b++) {
         this.gfx.drawRect(panelX,panelY, LetterDrop.TILE_W, LetterDrop.TILE_H)
         panelX += LetterDrop.TILE_W

         let btn = new Button( x,y, `${b+1}`, () => {
            this.columnPicked(b)   
         },0x2E4347,0xbcf4de,0x9af4be)
         btn.roundButton()
         btn.noShadow()
         btn.setEnabled(false)
         this.addChild(btn)
         this.columnButtons.push(btn)
         this.columns.push( [] )
         x+= LetterDrop.TILE_W
      }
      this.gfx.endFill(0x6E8894)
   }

   columnPicked( colNum ) {
      // get the tile from the choices list, remove it and set it 
      // at the top of the selected column
      let tgtTile = this.choices[colNum]
      this.choices[colNum] = null
      let colX = this.gridLeft + colNum*LetterDrop.TILE_W
      tgtTile.setPosition(colX, this.gridTop)

      // check the top tile in the tgt column and drop the target to 
      // just above that position
      let tgtY = this.gridTop+(LetterDrop.MAX_HEIGHT-1)*LetterDrop.TILE_H
      let tgtCol = this.columns[ colNum ]
      if (tgtCol.length == 0) {
         /// bpp
      } 
      new TWEEDLE.Tween(tgtTile).to({ y: tgtY}, 250).start()
   } 

   gameTick()  {
      this.clock.tick(this.app.ticker.deltaMS)
   }
}