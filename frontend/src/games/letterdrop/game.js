import * as PIXI from "pixi.js"
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
            let tile = new Letter(  letter, x,y, () => {
               console.log("FOO")
            })
            this.addChild(tile)
            this.choices[c] == tile
         }
         x+= LetterDrop.TILE_W
      }
   }

   drawBoard() {
      let y = 80
      let x = 10 

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
         this.addChild(btn)
         x+= LetterDrop.TILE_W
      }
      this.gfx.endFill(0x6E8894)
   }

   columnPicked( colNum ) {
      console.log("CLICKED "+(colNum+1))
   } 

   gameTick()  {
      this.clock.tick(this.app.ticker.deltaMS)
   }
}