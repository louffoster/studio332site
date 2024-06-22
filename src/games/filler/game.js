import {Text, TextStyle, Assets } from "pixi.js"
import * as TWEEDLE from "tweedle.js"
import Dictionary from "@/games/common/dictionary"
import BaseGame from "@/games/common/basegame"
import LetterPool from "@/games/common/letterpool"
import Clock from "@/games/common/clock"
import Button from "@/games/common/button"
import Tile from "@/games/filler/tile"
import Blank from "@/games/filler/blank"

export default class Filler extends BaseGame {
   dictionary = new Dictionary()
   pool = new LetterPool()
   nextTiles = []
   gameState = "init"
   grid = null
   clock = null
   word = null
   score = 0 
   scoreDisplay = null

   static ROWS = 8
   static COLS = 7
   static GRID_TOP = 45
   static GRID_LEFT = 10
   static TILES_TOP = 460
   static PREVIEW_CNT = 5
   
   // palette: https://coolors.co/palette/ef476f-ffd166-06d6a0-118ab2-073b4c
   async initialize(replayHandler, backHandler) {
      await super.initialize()

      this.app.ticker.add(() => TWEEDLE.Group.shared.update())
      
      this.pool.refill()
      this.grid = Array(Filler.ROWS).fill().map(() => Array(Filler.COLS))
      let x = Filler.GRID_LEFT
      let y = Filler.GRID_TOP
      for (let r = 0; r < Filler.ROWS; r++) {
         for (let c = 0; c < Filler.COLS; c++) {
            let t = new Blank( x,y, r,c, this.blankClicked.bind(this))
            this.addChild(t)
            this.grid[r][c] = t
            x += Tile.WIDTH
         }
         y += Tile.HEIGHT
         x = Filler.GRID_LEFT
      } 

      x = 54
      for ( let i=0; i<Filler.PREVIEW_CNT; i++ ) {
         let letter = this.pool.popScoringLetter()
         let tile = new Tile(letter, x, Filler.TILES_TOP, this.tileClicked.bind(this))
         tile.setEnabled(false)
         this.nextTiles.push(tile)
         this.addChild( tile )
         x += Tile.WIDTH
         if ( i==Filler.PREVIEW_CNT-2) {
            x += 10
         }
      }

      // highlight the last tile
      x -= (Tile.WIDTH+4)
      this.gfx.rect(x,Filler.TILES_TOP-4, Tile.WIDTH+8, Tile.HEIGHT+8).stroke({width:2, color:0xfff3b0})
   
      let btnY = Filler.TILES_TOP + Tile.HEIGHT+15
      this.giveUpButton = new Button( 10, btnY, "Give Up", 
         this.giveUpClicked.bind(this), 0xedf6f9,0xbd6360,0xfda3a0)
      this.giveUpButton.alignTopLeft()
      this.addChild(this.giveUpButton)
      
      this.submitButton = new Button( this.gameWidth-40, btnY, "Submit", 
         this.submitWord.bind(this), 0xedf6f9,0x5977b9,0x48CAE4)
      this.submitButton.disable()
      this.submitButton.alignTopRight()
      this.addChild(this.submitButton)

   
      this.clock = new Clock(335, 20, "", 0xedf6f9)
      this.addChild(this.clock)
      this.scoreDisplay = new Text({text: "00000", style: {
         fill: "#edf6f9",
         fontFamily: "Arial",
         fontSize: 24,
      }})
      this.scoreDisplay.anchor.set(0, 0.5)
      this.scoreDisplay.x = 10 
      this.scoreDisplay.y = 20
      this.addChild(this.scoreDisplay)
   }

   blankClicked( blank) {
      console.log(blank)
   }

   tileClicked( tile ) {
      console.log(tile)
   }

   submitWord() {

   }

   giveUpClicked() {
      console.log("loseer")
   }
   
   update() {
      if ( this.gameState != "play" ) return
      this.clock.tick(this.app.ticker.deltaMS)
   }
}