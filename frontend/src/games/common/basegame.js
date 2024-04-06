import {Application, Graphics} from "pixi.js"

export default class BaseGame {
   gameElement = null
   gameWidth = 0 
   gameHeight = 0
   app = null 
   gfx = null

   constructor(gameW, gameH, backgroundColor) {
      this.gameWidth = gameW 
      this.gameHeight = gameH
      this.backgroundColor = backgroundColor
   }

   async initialize() {
      let hdr = document.getElementById("header")
      let hdrH = hdr.getBoundingClientRect().height
      let windowH = window.innerHeight-hdrH

      this.app = new Application()
      await this.app.init({
         autoDensity: true, // Handles high DPI screens
         antialias: true,
         background: this.backgroundColor,
         width: this.gameWidth,
         height: this.gameHeight,
      })
      
      if (window.innerWidth <= this.gameWidth || windowH <= this.gameHeight   ) {
         this.gameElement = document.body
         this.gameElement.appendChild( this.app.canvas )
         this.resize()
      } else {
         this.gameElement = document.getElementById("game")
         this.gameElement.appendChild( this.app.canvas )
      }

      this.gfx = new Graphics() 
      this.app.stage.addChild(this.gfx)
      
      // this.gfx.rect(5, 5, this.gameWidth-10, 100).fill(0xde3249)

      // add a mask to crop the screen to game dimensions
      // let m = new Graphics() 
      // m.fill(0x000000)
      // m.rect(0, 0, this.gameWidth, this.gameHeight);
      // this.app.stage.addChild(m)
      // this.app.stage.mask = m

      this.app.ticker.add( this.update.bind(this) )
   }

   resize() {
      // Determine which screen dimension is most constrained
      let hdr = document.getElementById("header")
      let hdrH = hdr.getBoundingClientRect().height
      let windowH = window.innerHeight-hdrH

      var ratio = Math.min(window.innerWidth / this.gameWidth, windowH / this.gameHeight)
      this.app.stage.scale.x = this.app.stage.scale.y = ratio 
      this.app.renderer.resize( window.innerWidth, windowH)
      if ( this.gameWidth * ratio < window.innerWidth ) {
         this.app.stage.position.x = ((window.innerWidth - this.gameWidth*ratio) / 2.0) 
      }
   }

   get scale() {
      return this.app.stage.scale.x
   }

   addChild( child ) {
      this.app.stage.addChild(child)
   }
   removeChild( child, destroy = true ) {
      this.app.stage.removeChild(child)
      if ( destroy ) {
         child.destroy()
      }
   }

   shuffleArray( array ) {
      let currentIndex = array.length,  randomIndex

      // While there remain elements to shuffle.
      while (currentIndex != 0) {
         // Pick a remaining element.
         randomIndex = Math.floor(Math.random() * currentIndex)
         currentIndex--

         // And swap it with the current element.
         [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]]
      }

      return array;
   }

   update() {
      // base game does nothing
   }

   destroy() {
      // this.app.ticker.stop()
      this.app.stage.removeChildren()
      this.gameElement.removeChild(this.app.canvas)
   }
}