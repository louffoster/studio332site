import BasePhysicsItem from "@/games/common/basephysicsitem"
import { Text, Polygon } from "pixi.js"
import Matter from 'matter-js'

export default class Rock extends BasePhysicsItem {
   letter = null 
   extra = null
   selected = false 
   target = false
   enabled = true
   letters = []
   error = false
   polyPts = []
   static WIDTH = 55
   static HEIGHT = 55
   static FRICTION = 0.01

   constructor( x,y, letter, listener) {
      super(x,y)

      this.letter = letter
      
      this.letterColor = "#efefef"
      this.lineColor = 0x582F0E

      let tgtW = Rock.WIDTH 
      let tgtH = Rock.HEIGHT
      if ( letter.isVowel()) {
         this.fillColor = 0x6F3F14
         tgtW -= 3 
         tgtH -= 3
         this.polyPts = [ 
            {x: -tgtW/2-5, y: 0}, 
            {x: -tgtW/4, y: -tgtH/2},
            {x: +tgtW/4, y: -tgtH/2},
            {x: +tgtW/2+5, y: 0},
            {x: +tgtW/4, y: +tgtH/2}, 
            {x: -tgtW/4, y: +tgtH/2},
         ]
      } else  {
         this.fillColor = 0x7F4F24
         tgtW += 2 
         tgtH += 2
         this.polyPts = [ 
            {x: -tgtW/2, y: -tgtH/4}, 
            {x: -tgtW/4, y: -tgtH/2},
            {x: +tgtW/4, y: -tgtH/2},
            {x: +tgtW/2, y: -tgtH/4},
            {x: +tgtW/2, y: +tgtH/4}, 
            {x: +tgtW/4, y: +tgtH/2},
            {x: -tgtW/4, y: +tgtH/2},
            {x: -tgtW/2, y: +tgtH/4},
         ]
      }

      this.selectColor = 0xffd046
      this.selLetterColor = 0x414833
      this.targetColor = 0xe26312
      this.dimColor = 0x616853

      let txt = new Text({text: letter.text, style: {
         fill: this.letterColor,
         fontFamily: "Arial",
         fontSize: 18,
      }})
      txt.anchor.set(0.5)
      txt.x = 0
      txt.y = 0
      this.addChild(txt)
      this.letters.push( txt )
      if (letter.text == "Q") {
         let uTxt = new Text({text: "U", style: {
            fill: this.letterColor,
            fontFamily: "Arial",
            fontSize: 15,
         }})
         uTxt.anchor.set(0.5)
         uTxt.x = 8
         uTxt.y = 4    
         txt.x-= 4
         this.addChild(uTxt)
         this.letters.push( uTxt )
      }

      const polygon = new Polygon(this.polyPts)
      let c = Matter.Vertices.centre(this.polyPts) 
      this.pivot.set(c.x, c.y)  
      this.body = Matter.Bodies.fromVertices(x, y, this.polyPts, {isStatic: this.isStatic})
      this.hitArea = polygon

      this.body.label = "rock-"+letter.text
      this.setAirFriction( 0.0)
      this.setFriction(Rock.FRICTION)
      this.setRestitution( 0 )

      this.update()
      this.draw()

      this.cursor ="pointer"
      this.eventMode = 'static'
      this.on('pointerdown', ()=> {
         if ( this.selected && this.target == false ) return
         listener(this)
      })
   }

   pushLeft() {
      this.setFriction(0)
      this.applyForce(-0.05,0)
      setTimeout( ()=>{
         this.setFriction(Rock.FRICTION)
      }, 100)
   }
   pushRight() {
      this.setFriction(0)
      // this.applyForce(0.05,0)
      this.applyForce(0,-0.05)
      setTimeout( ()=>{
         this.setFriction(Rock.FRICTION)
      }, 100)
   }

   toggleSelected(  ) {
      this.selected = !this.selected
      if ( this.selected ) {
         this.letters.forEach( l => l.style.fill = this.selLetterColor )
      } else {
         this.letters.forEach( l => l.style.fill = this.letterColor )  
      }
      this.draw()
   }
   setTarget( flag ) {
      this.target = flag 
      if ( this.target ) {
         this.letters.forEach( l => l.style.fill = this.targetColor )
      } else {
         if ( this.selected ) {
            this.letters.forEach( l => l.style.fill = this.selLetterColor )  
         } else {
            this.letters.forEach( l => l.style.fill = this.letterColor )     
         }
      }
      this.draw()
   }
   setEnabled( enabled ) {
      this.enabled = enabled 
      if (this.enabled == false) {
         this.eventMode = 'none'
         this.cursor ="default"
      } else {
         this.eventMode = 'static'
         this.cursor ="pointer"
      }
      this.draw()
   }

   setError() {
      if (this.error == false ) {
         this.error = true 
         this.draw() 
         setTimeout( () => {
            this.error = false 
            this.draw()
         }, 500)
      }
   }

   deselect() {
      this.selected = false   
      this.letters.forEach( l => l.style.fill = this.letterColor ) 
      this.draw()
   }

   remove() {
      this.body.isSensor = true
      this.gfx.alpha = 0
   }

   draw() {
      this.gfx.clear()

      this.gfx.poly( this.polyPts )
      if ( this.target ) {
         this.gfx.stroke({width: 5, color: this.targetColor} )   
      } else {
         this.gfx.stroke({width: 1, color: this.lineColor})
      }
      if (this.enabled == false ) {
         this.gfx.fill(this.dimColor)
      } else {
         if ( this.error ) {
            this.gfx.fill(0xa20c01) 
         } else if ( this.selected ) {
            this.gfx.fill(this.selectColor)
         } else {
            this.gfx.fill(this.fillColor)
         }
      }
   }

   get text() {
      let out = this.letter.text 
      if ( out == "Q") {
         out += "U"
      }
      return out
   }

   get value() {
      return this.letter.value
   }
}