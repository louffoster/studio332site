// Game constants ===================
const TILE_SIZE= 75;
const GRID_X = 77+35;
const GRID_Y = 77+35+40;
const ROWS = 6;
const COLS = 6;
const START_TIME = 180

import Phaser from 'phaser'
import Cookies from 'js-cookie'
import Grid from './grid'
import Pool from './pool'

export default  class Latticewords extends Phaser.Scene {
   constructor ()   {
      super({ key: 'latticewords' })
   }
   preload () {
      this.load.image('grid-bkg', '/latticewords/images/grid-bkg.png')
      this.load.spritesheet('pause', '/latticewords/images/pause.png',  { frameWidth: 32, frameHeight: 32 })
      this.load.image('grid', '/latticewords/images/grid.png')
      this.load.image('pause-bkg', '/latticewords/images/pause_bkg.png')
      this.load.image('left', '/latticewords/images/left.png')
      this.load.image('right', '/latticewords/images/right.png')
      this.load.image('up', '/latticewords/images/up.png')
      this.load.image('down', '/latticewords/images/down.png')
      this.load.image('clear', '/latticewords/images/clear.png')
      this.load.image('check', '/latticewords/images/check.png')
   }

   create () {
      this.pool = new Pool()
      this.pool.refill()
      this.animating = false
      this.activeButton = ""
      this.clearsRemaining = 3
      this.gameOver = false
      this.pointerDown = false
      this.paused = false
      this.clearsRemaining = 3

      this.textCfg = {
         fontFamily: 'Arial',
         fill: '#fff',
         stroke: "#222",
         strokeThickness: 6
      }

      this.addScoreAndTimer()

      this.grid = new Grid(this, ROWS, COLS, TILE_SIZE, this.pool)
      this.grid.fill()

      this.addRowControls()
      this.addColControls()
      this.createPauseMenu()
      this.createGameOverMenu()

      this.clearBtn = this.add.sprite(0,640, 'clear')
      this.clearBtn.setInteractive()
      this.clearBtn.setOrigin(0,1)
      this.clearBtn.on('pointerdown', this.onClearClick, this)
      this.clearBtn.on('pointerover', function() {
         if (this.clearsRemaining > 0) {
            this.clearBtn.setTint('0xcc6666')
         }
      },this)
      this.clearCounter = this.add.text( 24, 620, "3", this.textCfg)
      this.clearCounter.setOrigin(0.5,0.5)
      this.clearCounter.setFontSize(28)
      this.clearCounter.setStroke(0,4)

      var check = this.add.image(600,640, 'check')
      check.setOrigin(1,1)
      check.setInteractive()
      check.on('pointerdown', this.onCheckClick, this)
      check.on('pointerover', function() {
         check.setTint('0x00cc00')
      },this)


      // all game objects highlight yellow when moused over
      this.input.on('gameobjectover', function (pointer, gameObject) {
         if (gameObject == this.clearBtn) return
         gameObject.setTint('0x00ffff')
      }, this)
      this.input.on('gameobjectout', function (pointer, gameObject) {
         gameObject.clearTint()
      })

      // Mouse handlers
      this.input.on('pointerdown', function (pointer) {
         if (this.paused || this.gameOver ) return
         this.pointerDown = true
         this.grid.handlePointerDown(pointer.x, pointer.y)
      }, this)

      this.input.on('pointerup', function () {
         this.pointerDown = false
         if (this.paused || this.gameOver ) return
         this.grid.handlePointerUp()
      }, this)

       this.input.on('pointermove', function (pointer) {
          if (this.paused || this.gameOver ) return
          if ( this.pointerDown ) {
             this.grid.handlePointerDown(pointer.x, pointer.y)
           }
       }, this)
   }

   update() {
      if (this.gameOver == true || this.paused == true) return
      if ( this.activeButton != "" ) {
         this.grid.shiftTiles(this.activeButton)
         return
      }
   }

   restartGame() {
      this.score = 0
      this.gameOver = false
      this.clearsRemaining = 3
      this.clearCounter.setText("3")
      this.timeLeft = START_TIME
      var minutes = Math.floor(this.timeLeft / 60)
      var seconds = (this.timeLeft - minutes * 60)
      this.timerDisplay.setText(  (("0"+minutes).substr(-2) + ":" + ("0"+seconds).substr(-2)))
      this.animating = false
      this.activeButton = ""
      this.pool.refill()
      this.grid.empty()
      this.grid.fill()
      this.pauseGroup.visible = false
      this.gameOverGroup.visible = false
      this.paused = false
      this.clearBtn.alpha = 1
      this.clearCounter.alpha = 1
      this.pauseBtn.setFrame(0)
      this.gameTimer.paused = false
   }

   createGameOverMenu() {
      var text = this.add.text( 230, 80, "Game Over", this.textCfg)
      text.setFontSize(36)
      text.setOrigin(0.5)
      var pauseBkg = this.add.image(0,0,  'pause-bkg')
      pauseBkg.setOrigin(0,0)

      var restart = this.add.text( 230, 220, "Play Again?", this.textCfg)
      restart.setFontSize(24)
      restart.setOrigin(0.5)
      restart.setInteractive()
      restart.on('pointerup', function(/*pointer,x,y*/) {
         this.restartGame()
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

      this.gameOverGroup = this.add.container((600-460)/2, 110, [
         pauseBkg, text, restart, this.bestLabel, this.bestScore])
      this.gameOverGroup.setVisible(false)
   }

   createPauseMenu() {
      var text = this.add.text( 230, 80, "Game Paused", this.textCfg)
      text.setFontSize(36)
      text.setOrigin(0.5)
      var pauseBkg = this.add.image(0,0,  'pause-bkg')
      pauseBkg.setOrigin(0,0)

      var resume = this.add.text( 230, 200, "Resume", this.textCfg)
      resume.setFontSize(24)
      resume.setOrigin(0.5)
      resume.setInteractive()
      resume.on('pointerup', function(/*pointer,x,y*/) {
         this.pauseBtn.setFrame(0)
         this.gameTimer.paused = false
         this.pauseGroup.setVisible(false)
         this.paused = false
      }, this)

      var restart = this.add.text( 230, 270, "Restart", this.textCfg)
      restart.setFontSize(24)
      restart.setOrigin(0.5)
      restart.setInteractive()
      restart.on('pointerup', function(/*pointer,x,y*/) {
         this.restartGame()
      }, this)

      this.pauseGroup = this.add.container((600-460)/2, 110, [ pauseBkg, text, resume, restart])
      this.pauseGroup.setVisible(false)
   }

   addScoreAndTimer() {
      this.score = 0
      this.timeLeft = START_TIME

      var rect = new Phaser.Geom.Rectangle(0, 0, 600, 40)
      var gfx = this.add.graphics({ fillStyle: { color: 0x00000099 } })
      gfx.fillRectShape(rect)

      this.scoreDisplay = this.add.text( 10,3, "000000", this.textCfg)
      this.scoreDisplay.setFontSize(26)
      this.timerDisplay =  this.add.text( 590,3, "03:00", this.textCfg)
      this.timerDisplay.setFontSize(26)
      this.timerDisplay.setOrigin(1,0)
      this.gameTimer = this.time.addEvent({ delay: 1000, callback: this.tick, callbackScope: this, loop: true })

      // pause / play button
      this.paused = false
      this.pauseBtn = this.add.sprite(300,4, 'pause')
      this.pauseBtn.setInteractive()
      this.pauseBtn.setOrigin(0.5,0)
      this.pauseBtn.on('pointerdown', function() {
         this.paused  = !this.paused
          if ( this.paused == true ) {
              this.pauseBtn.setFrame(1)
              this.gameTimer.paused = true
              this.pauseGroup.setVisible(true)
          } else {
             this.pauseBtn.setFrame(0)
             this.gameTimer.paused = false
             this.pauseGroup.setVisible(false)
          }

      }, this)
   }

   addShiftButton(x,y, id, image ) {
      var name = image[0].toUpperCase()+id
      var btn = this.add.sprite(x,y, image)
      btn.on('pointerdown', function() {
         this.activeButton = btn.name
      }, this)
      btn.on('pointerup', function() {
         this.activeButton = ""
      }, this)
      btn.setName(name)
      btn.setOrigin(0.5, 0.5)
      btn.setInteractive()
   }

   addRowControls() {
      var ds = TILE_SIZE
      for ( var r=0; r < ROWS; r++) {
         this.addShiftButton(54, GRID_Y+ds*r, r, 'left')
         this.addShiftButton(600-55, GRID_Y+ds*r, r, 'right')
      }
   }

   addColControls() {
      var ds = TILE_SIZE
      for ( var c=0; c<COLS; c++) {
         this.addShiftButton(GRID_X+ds*c,94, c, 'up')
         this.addShiftButton(GRID_X+ds*c,640-55, c, 'down')
      }
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
         this.gameOverGroup.setVisible(true)
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

   /**
   * Button Handlers
   */
   onClearClick() {
      if (this.paused || this.gameOver || this.clearsRemaining  == 0) return

      this.clearsRemaining -= 1
      this.clearCounter.setText( ""+this.clearsRemaining)
      if ( this.clearsRemaining == 0) {
         this.clearBtn.alpha = 0.5
         this.clearCounter.alpha = 0.5
      }
      this.grid.destroySelectedTiles(this.pool)
   }
   onCheckClick() {
      if (this.paused || this.gameOver) return
      var self = this
      this.grid.checkWords( function(points, addedTime) {
         self.scoreHandler(points, addedTime)
      } )
   }

   scoreHandler(points, addedTime) {
      this.score += points
      this.timeLeft += addedTime
   }
}
