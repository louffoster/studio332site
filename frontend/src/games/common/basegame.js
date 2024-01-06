import * as PIXI from "pixi.js"

export default class BaseGame {
   gameElement = null
   gameWidth = 0 
   gameHeight = 0
   app = null 
   scene = null
   gfx = null

   constructor(gameW, gameH, backgroundColor) {
      this.gameWidth = gameW 
      this.gameHeight = gameH

      let hdr = document.getElementById("header")
      let hdrH = hdr.getBoundingClientRect().height
      let windowH = window.innerHeight-hdrH

      PIXI.settings.RESOLUTION = window.devicePixelRatio || 1
      this.app = new PIXI.Application({
         autoDensity: true, // Handles high DPI screens
         antialias: true,
         backgroundColor: backgroundColor,
         width: this.gameWidth,
         height: this.gameHeight,
      })

      if (window.innerWidth <= this.gameWidth || windowH <= this.gameHeight   ) {
         this.gameElement = document.body
         this.gameElement.appendChild( this.app.view )
         this.scene = new PIXI.Container()
         this.app.stage.addChild( this.scene )
         this.resize()
      } else {
         this.gameElement = document.getElementById("game")
         this.gameElement.appendChild( this.app.view )
         this.scene = new PIXI.Container()
         this.app.stage.addChild( this.scene )
      }

      this.gfx = new PIXI.Graphics() 
      this.scene.addChild(this.gfx)

      // add a mask to crop the screen to game dimensions
      let m = new PIXI.Graphics() 
      m.beginFill(0x000000)
      m.drawRect(0, 0, this.gameWidth, this.gameHeight);
      m.endFill()
      this.scene.addChild(m)
      this.scene.mask = m

      this.app.ticker.add( this.update.bind(this) )
   }

   resize() {
      // Determine which screen dimension is most constrained

      let hdr = document.getElementById("header")
      let hdrH = hdr.getBoundingClientRect().height
      let windowH = window.innerHeight-hdrH

      var ratio = Math.min(window.innerWidth / this.gameWidth, windowH / this.gameHeight)
      this.scene.scale.x = this.scene.scale.y = ratio 
      this.app.renderer.resize( window.innerWidth, windowH)
      if ( this.gameWidth * ratio < window.innerWidth ) {
         this.scene.position.x = ((window.innerWidth - this.gameWidth*ratio) / 2.0) 
      }
   }

   get scaleX() {
      return this.scene.scale.x
   }
   get scaleY() {
      return this.scene.scale.y
   }

   addChild( child ) {
      this.scene.addChild(child)
   }
   removeChild( child ) {
      this.scene.removeChild(child)
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
      this.app.ticker.stop()
   
      this.scene.destroy({
         children: true,
         texture: true,
         baseTexture: true
      })
      
      this.app.stage.removeChildren()
      this.gameElement.removeChild(this.app.view)
   }
}