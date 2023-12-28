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
         // hdr.style.display = "none"
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

      this.app.ticker.add( this.update.bind(this) )
   }

   resize() {
      // Determine which screen dimension is most constrained

      let hdr = document.getElementById("header")
      let hdrH = hdr.getBoundingClientRect().height
      let windowH = window.innerHeight-hdrH

      let ratioW = window.innerWidth / this.gameWidth
      let ratioH = windowH / this.gameHeight
      let delW = window.innerWidth - this.gameWidth 
      let delH = windowH - this.gameHeight
      if (delW < 0 || delH < 0 ) {
         if ( delW < delH ) {
            this.scene.scale.x = this.scene.scale.y = ratioW 
         } else {
            this.scene.scale.x = this.scene.scale.y = ratioH  
            if ( delW < 0) {
               this.scene.position.x = ((window.innerWidth - this.gameWidth*ratioH) / 2.0) 
            } else {
               this.scene.position.x = ((window.innerWidth - this.gameWidth) / 2.0) / ratioW 
            }
         }
      } 
      this.app.renderer.resize( window.innerWidth, windowH)
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