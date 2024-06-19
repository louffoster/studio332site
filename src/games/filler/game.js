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

      //let scoredLetter = this.pool.popScoringLetter()
   
      // let wordStyle = new TextStyle({
      //    fill: "#CAF0F8",
      //    fontFamily: "Arial",
      //    fontSize: 28,
      //    lineHeight: 28,
      // })
      // this.word = new Text({text: "", style: wordStyle})
      // this.word.anchor.set(0.5, 1)
      // this.word.x = 185 
      // this.word.y = 410
      // this.addChild(this.word)
   
      // this.giveUpButton = new Button( 20, 425, "Give Up", 
      //    this.giveUpClicked.bind(this), 0xEAE0E8,0x892b64,0xa94b84)
      // this.giveUpButton.alignTopLeft()
      // this.addChild(this.giveUpButton)
   
      // this.clearButton = new Button( 145, 425, "Clear", 
      //    this.clearSelections.bind(this), 0xEAE0E8,0xc5472b,0xe5674b)
      // this.clearButton.alignTopLeft()
      // this.addChild(this.clearButton)
      // this.clearButton.disable()
      
      // this.submitButton = new Button( 247, 425, "Submit", 
      //    this.submitWord.bind(this), 0xedf6f9,0x298058,0x48CAE4)
      // this.submitButton.disable()
      // this.submitButton.alignTopLeft()
      // this.addChild(this.submitButton)

   
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
   
   update() {
      if ( this.gameState != "play" ) return
      this.clock.tick(this.app.ticker.deltaMS)
   }
}