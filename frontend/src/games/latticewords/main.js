// Game constants ===================
const TILE_SIZE= 75
const ROWS = 6
const COLS = 6
const START_TIME = 240

import Phaser from 'phaser'
import Cookies from 'js-cookie'
import Grid from './grid'
import Pool from './pool'

export default  class Latticewords extends Phaser.Scene {
   constructor ()   {
      super({ key: 'latticewords' })
   }
   preload () {
      this.load.spritesheet('pause', '/latticewords/images/pause.png',  { frameWidth: 32, frameHeight: 32 })
      this.load.image('grid', '/latticewords/images/grid.png')
   }

   create () {
      this.pool = new Pool()
      this.pool.refill()
      this.gameOver = false
      this.pointerDown = false
      this.paused = false
      this.currRow = -1
      this.currCol = -1
      this.dragged = false
      this.clickCount = 0

      this.textCfg = {
         fontFamily: 'Arial',
         fill: '#fff',
         stroke: "#222",
         strokeThickness: 6
      }

      this.grid = new Grid(this, ROWS, COLS, TILE_SIZE, this.pool)
      this.grid.fill()

      this.addScoreAndTimer()

      // dark blue box to block out the letters that slide out of grid
      var rect1 = new Phaser.Geom.Rectangle(0, 490, 460, 60)
      var gfx = this.add.graphics({ fillStyle: { color: "0x003F51B5" } })
      gfx.fillRectShape(rect1)

      // score button (text)
      let btnTxt = this.add.text(230, 520, "Score Grid", {
         fontFamily: 'Arial',
         fill: '#fff',
         stroke: "#000",
         strokeThickness: 2,
         backgroundColor: '#757de8',
      }).setPadding(172,10)
      btnTxt.setFontSize(20)
      btnTxt.setOrigin(0.50)
      btnTxt.setInteractive()
      btnTxt.setName("scorebtn")
      btnTxt.on("pointerover", () => {
         btnTxt.setBackgroundColor("#858df8")
      })
      btnTxt.on("pointerout", () => {
         btnTxt.setBackgroundColor("#757de8")
      })
      btnTxt.on("pointerup", () => {
         this.onCheckClick()
      })

      this.createPauseMenu()
      this.createGameOverMenu()


      // all game objects highlight yellow when moused over
      this.input.on('gameobjectover', (_pointer, gameObject) => {
         if (gameObject.name != "scorebtn") {
            gameObject.setTint('0x00ffff')
         }
      })
      this.input.on('gameobjectout', (_pointer, gameObject) => {
         gameObject.clearTint()
      })

      // Mouse handlers
      this.input.on('pointerdown', pointer => {
         if (this.paused || this.gameOver ) return
         this.pointerDown = true
         this.currRow = this.grid.getClickedRow(pointer.y)
         this.currCol = this.grid.getClickedCol(pointer.x)
         this.dragged = false
      })

      this.input.on('pointerup',  pointer => {
         if (this.paused || this.gameOver) return
         this.pointerDown = false
         this.currRow = -1
         this.currCol = -1
         if ( this.dragged == false) {

            this.clickCount++
            if ( this.clickCount == 1) {
               this.time.addEvent({ delay: 200, callback:  ()=> {
                  this.grid.handlePointerUp(pointer.x, pointer.y, (this.clickCount>=2) )
                  this.clickCount = 0
               }})
            }
         }
         this.dragged = false
      })
   }

   update() {
      if (this.gameOver == true || this.paused == true) return

      var pointer = this.input.activePointer
      if (pointer.x < 10 || pointer.x > 450 || pointer.y < 50 || pointer.y > 490) {
         this.pointerDown = false
         this.currRow = -1
         this.currCol = -1
         this.dragged = false
         return
      }

      if ( this.pointerDown) {
         let newRow = this.grid.getClickedRow(pointer.y)
         let newCol = this.grid.getClickedCol(pointer.x)
         if (newCol > this.currCol) {
            this.grid.shiftTiles('R', newRow)
            this.currCol = newCol
            this.dragged = true
         } else if (newCol < this.currCol) {
            this.grid.shiftTiles('L', newRow)
            this.currCol = newCol
            this.dragged = true
         } else if (newRow < this.currRow) {
            this.grid.shiftTiles('U', newCol)
            this.currRow = newRow
            this.dragged = true
         } else if (newRow > this.currRow) {
            this.grid.shiftTiles('D', newCol)
            this.currRow = newRow
            this.dragged = true
         }
      }
   }

   restartGame() {
      this.score = 0
      this.gameOver = false
      this.timeLeft = START_TIME
      var minutes = Math.floor(this.timeLeft / 60)
      var seconds = (this.timeLeft - minutes * 60)
      this.timerDisplay.setText(  (("0"+minutes).substr(-2) + ":" + ("0"+seconds).substr(-2)))
      this.pool.refill()
      this.grid.empty()
      this.grid.fill()
      this.pauseGroup.setVisible(false)
      this.grid.setVisible(true)
      this.gameOverGroup.visible = false
      this.paused = false
      this.pauseBtn.setFrame(0)
      this.gameTimer.paused = false
      this.pauseBtn.setVisible(true)
   }

   createGameOverMenu() {
      let bkg = this.add.rectangle(0, 40, 460, 550, 0x03F51B5)
      bkg.setOrigin(0, 0)

      var text = this.add.text( 230, 80, "Game Over", this.textCfg)
      text.setFontSize(36)
      text.setOrigin(0.5)

      var restart = this.add.text( 230, 220, "Play Again", this.textCfg)
      restart.setFontSize(24)
      restart.setOrigin(0.5)
      restart.setInteractive()
      restart.on('pointerup', function(/*pointer,x,y*/) {
         setTimeout( () => {
            this.restartGame()
         }, 100)
      }, this)

      this.bestLabel = this.add.text( 230, 350, "Best Score", this.textCfg)
      this.bestLabel.setFontSize(22)
      this.bestLabel.setOrigin(0.5)
      this.bestScore = this.add.text( 230, 380, "0", this.textCfg)
      this.bestScore.setFontSize(16)
      this.bestScore.setOrigin(0.5)
      var bestScore = Cookies.get('bestScore')
      if ( bestScore ) {
         this.bestScore.setText(bestScore)
      }

      this.gameOverGroup = this.add.container(0, 40, [bkg, text, restart, this.bestLabel, this.bestScore])
      this.gameOverGroup.setVisible(false)
   }

   createPauseMenu() {
      let bkg = this.add.rectangle(0, 40, 460, 550, 0x03F51B5)
      bkg.setOrigin(0,0)
      
      var text = this.add.text( 230, 80, "Game Paused", this.textCfg)
      text.setFontSize(36)
      text.setOrigin(0.50)

      var resume = this.add.text( 230, 200, "Resume", this.textCfg)
      resume.setFontSize(24)
      resume.setOrigin(0.5)
      resume.setInteractive()
      resume.on('pointerup', function(/*pointer,x,y*/) {
         this.pauseBtn.setFrame(0)
         this.gameTimer.paused = false
         this.pauseGroup.setVisible(false)
         this.grid.setVisible(true)
         setTimeout( () => {
            this.paused = false
         }, 100)
      }, this)

      var restart = this.add.text( 230, 270, "Restart", this.textCfg)
      restart.setFontSize(24)
      restart.setOrigin(0.5)
      restart.setInteractive()
      restart.on('pointerup', function(/*pointer,x,y*/) {
         setTimeout(() => {
            this.restartGame()
         },100)
      }, this)

      this.pauseGroup = this.add.container(0, 40, [ bkg, text, resume, restart])
      this.pauseGroup.setVisible(false)
      this.grid.setVisible(true)
   }

   addScoreAndTimer() {
      this.score = 0
      this.timeLeft = START_TIME

      var rect = new Phaser.Geom.Rectangle(0, 0, 460, 40)
      var gfx = this.add.graphics({ fillStyle: { color: 0x00000099 } })
      gfx.fillRectShape(rect)

      this.scoreDisplay = this.add.text( 10,3, "000000", this.textCfg)
      this.scoreDisplay.setFontSize(26)
      this.timerDisplay =  this.add.text( 450,3, "04:00", this.textCfg)
      this.timerDisplay.setFontSize(26)
      this.timerDisplay.setOrigin(1,0)
      this.gameTimer = this.time.addEvent({ delay: 1000, callback: this.tick, callbackScope: this, loop: true })

      // pause / play button
      this.paused = false
      this.pauseBtn = this.add.sprite(230,4, 'pause')
      this.pauseBtn.setInteractive()
      this.pauseBtn.setOrigin(0.5,0)
      this.pauseBtn.on('pointerdown', function() {
         this.paused  = !this.paused
          if ( this.paused == true ) {
              this.pauseBtn.setFrame(1)
              this.gameTimer.paused = true
              this.pauseGroup.setVisible(true)
              this.grid.setVisible(false)
          } else {
             this.pauseBtn.setFrame(0)
             this.gameTimer.paused = false
             this.pauseGroup.setVisible(false)
             this.grid.setVisible(true)
          }

      }, this)
   }

   tick() {
      if (this.gameOver) return

      this.timeLeft--
      var minutes = Math.floor(this.timeLeft / 60)
      var seconds = (this.timeLeft - minutes * 60)
      this.timerDisplay.setText(  (("0"+minutes).substr(-2) + ":" + ("0"+seconds).substr(-2)))
      var scoreTxt = ""+this.score
      this.scoreDisplay.setText( scoreTxt.padStart(6, "0"))

      if ( this.timeLeft <= 15 ) {
         this.grid.flash()
      }
      if (this.timeLeft == 0) {
         this.gameOver = true
         this.pauseBtn.setVisible(false)
         this.gameOverGroup.setVisible(true)
         this.grid.setVisible(false)
         var bestScore = parseInt(Cookies.get('bestScore'),10)
         if ( !bestScore ) bestScore = 0
         if ( this.score > bestScore ) {
            Cookies.set('bestScore', this.score)
            this.bestScore.setText(this.score)
            this.bestLabel.setText("New Best Score!")
         } else {
            this.bestLabel.setText("Best Score")
         }
      }
   }

   onCheckClick() {
      if (this.paused || this.gameOver) return
      this.grid.checkWords( (points, addedTime) => {
         this.score += points
         this.timeLeft += addedTime
      } )
   }
}
