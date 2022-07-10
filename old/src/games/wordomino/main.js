import Phaser from 'phaser'
import * as letters from './letters'
import * as cards from './cards'
import Puzzle from './puzzle'
import Words from './words'
import MessageBox from './messages'

export default class Wordomino extends Phaser.Scene {
   constructor() {
      super({ key: 'wordomino' })
   }

   create() {
      this.eventBus = new Phaser.Events.EventEmitter()
      this.gameState = "PICK_CARD"
      this.graphics = this.add.graphics()

      // Even listeners
      this.eventBus.on("cardPicked", this.handleCardPicked, this)
      this.eventBus.on("letterPicked", this.handleLetterPicked, this)
      this.eventBus.on("letterPlaced", this.handleLetterPlaced, this)
      this.eventBus.on("letterReturned", this.handleLetterReturned, this)
      this.eventBus.on("wordsSubmitted", this.handleWordsSubmitted, this)
      this.eventBus.on("wordsFailed", this.handleWordsFailed, this)
      this.eventBus.on("cardFull", this.handleCardFull, this)
      this.eventBus.on("cardNotFull", this.handleCardNotFull, this)
      this.eventBus.on("wordsValid", this.handleWordsValid, this)
      
      this.letterPool = new letters.Pool(this, 10,10)
      this.letterPool.fillGrid()

      this.msgBox = new MessageBox(this, 10, 245)
      this.msgBox.setMessage("Pick a puzzle shape card")
      
      this.cardPool = new cards.Pool(this)
      this.cardPool.setChoiceCoordinates( 10,285, 125,285)
     

      this.words = new Words(this, 255, 10)
      this.puzzle = new Puzzle(this, 255,285)
      
      this.draw()
      this.gameTimer = this.time.addEvent({ delay: 1000, callback: this.tick, callbackScope: this, loop: true })

      this.input.on('pointermove', pointer => {
         this.cardPool.mouseMove(pointer.x, pointer.y)
         this.letterPool.mouseMove(pointer.x, pointer.y)
         this.words.mouseMove(pointer.x, pointer.y)
         this.puzzle.mouseMove(pointer.x, pointer.y)
      });
      this.input.on('pointerdown', pointer => {
         this.cardPool.mouseDown(pointer.x, pointer.y)
         this.letterPool.mouseDown(pointer.x, pointer.y)
         this.words.mouseDown(pointer.x, pointer.y)
      });
   }

   tick() {
      // this.checkGameState()
   }

   handleCardPicked(cardInfo) {
      if (this.gameState == "PICK_CARD") {
         this.gameState = "PICK_LETTERS"
         this.msgBox.setMessage("Fill card with words")
         this.msgBox.draw()
         this.words.setCard(cardInfo)
         this.words.draw()
         this.letterPool.activate()
         this.words.activate()   
         this.cardPool.deactivate()
      }
   }

   handleLetterPicked(letterInfo) {
      this.gameState = "PLACE_LETTER"
      this.msgBox.setMessage("Place letter on card")
      this.msgBox.draw()
      this.words.setNewLetter(letterInfo)
      this.words.draw()
   }

   handleLetterPlaced(letterInfo) {
      if(this.gameState == "PLACE_LETTER") {
         this.gameState = "PICK_LETTERS"
         this.msgBox.setMessage("Fill card with words")
         this.msgBox.draw()
         this.words.draw()
         this.letterPool.letterUsed(letterInfo)
         this.letterPool.draw()
      }
   }

   handleLetterReturned(letterInfo) {
      this.letterPool.returnLetter(letterInfo)
   }

   handleWordsSubmitted() {
      this.msgBox.setMessage("Checking words...")
      this.msgBox.draw()  
   }

   handleWordsFailed() {
      this.msgBox.setMessage("Failed! Fix words on card")
      this.msgBox.draw()
   }

   handleCardNotFull() {
      this.msgBox.setMessage("Fill card with words")
      this.msgBox.draw()   
   }

   handleCardFull() {
      this.msgBox.setMessage("Submit words!")
      this.msgBox.draw()
   }
   
   handleWordsValid(card) {
      this.msgBox.setMessage("Place shape in puzzle")
      this.msgBox.draw() 
      this.letterPool.deactivate()
      this.words.deactivate()
      this.cardPool.deactivate()
      this.puzzle.setNewShape(card.layout)
      this.puzzle.activate()
   }

   draw() {
      this.letterPool.draw()
      this.cardPool.draw()
      this.msgBox.draw()
      this.words.draw()
      this.puzzle.draw()
   }
}