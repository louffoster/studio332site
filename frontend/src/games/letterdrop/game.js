import * as PIXI from "pixi.js"
import * as particles from '@pixi/particle-emitter'
import axios from 'axios'
import BaseGame from "@/games/common/basegame"
import LetterPool from "@/games/common/letterpool"
import Clock from "@/games/common/clock"
import Button from "@/games/common/button"

const API_SERVICE = import.meta.env.VITE_S332_SERVICE

export default class LetterDrop extends BaseGame {
   pool = new LetterPool()
   clock = null
   columnButtons = []

   static COLUMNS = 5 
   static MAX_HEIGHT = 6 
   static TILE_W = 60 
   static TILE_H = 60

   initialize(replayHandler, backHandler) {
   

      this.drawBoard()

      this.clock = new Clock(280, 515, "", 0xFCFAFA)
      this.addChild(this.clock)
      
      // start the eicker last so everything is created / initialized
      this.app.ticker.add( this.gameTick.bind(this) )
   }

   drawBoard() {
      let y = 70
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

      let b = new Button( x,y, "1", () => {
         console.log("CLICKED 1")
      })
      b.roundButton()
      this.addChild(b)
   }

   gameTick()  {
      this.clock.tick(this.app.ticker.deltaMS)
   }
}